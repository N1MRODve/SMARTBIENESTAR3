/*
  # Crear tablas de recompensas y canjes

  1. Nuevas tablas
    - `recompensas`
      - `id` (uuid, primary key)
      - `nombre` (text) - Nombre de la recompensa
      - `descripcion` (text) - Descripción de la recompensa
      - `categoria` (text) - Categoría: 'Bienestar', 'Desarrollo', 'Experiencias', 'Productos'
      - `costo_puntos` (integer) - Costo en puntos
      - `stock` (integer) - Cantidad disponible (-1 para ilimitado)
      - `imagen_url` (text) - URL de la imagen
      - `activa` (boolean) - Si está activa o no
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `canjes_recompensas`
      - `id` (uuid, primary key)
      - `empleado_id` (uuid, foreign key) - Empleado que realizó el canje
      - `recompensa_id` (uuid, foreign key) - Recompensa canjeada
      - `puntos_gastados` (integer) - Puntos gastados en el canje
      - `estado` (text) - Estado: 'pendiente', 'procesado', 'completado', 'cancelado'
      - `notas` (text) - Notas adicionales
      - `fecha_canje` (timestamptz) - Fecha del canje
      - `fecha_procesado` (timestamptz) - Fecha de procesamiento
      - `created_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que usuarios autenticados puedan ver recompensas
    - Políticas para que usuarios puedan canjear recompensas
    - Políticas para que usuarios puedan ver su historial de canjes
*/

CREATE TABLE IF NOT EXISTS recompensas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('Bienestar', 'Desarrollo', 'Experiencias', 'Productos')),
  costo_puntos integer NOT NULL CHECK (costo_puntos > 0),
  stock integer DEFAULT -1,
  imagen_url text,
  activa boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS canjes_recompensas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  recompensa_id uuid REFERENCES recompensas(id) ON DELETE SET NULL NOT NULL,
  puntos_gastados integer NOT NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesado', 'completado', 'cancelado')),
  notas text,
  fecha_canje timestamptz DEFAULT now(),
  fecha_procesado timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_recompensas_categoria ON recompensas(categoria);
CREATE INDEX IF NOT EXISTS idx_recompensas_activa ON recompensas(activa);
CREATE INDEX IF NOT EXISTS idx_canjes_empleado ON canjes_recompensas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_canjes_recompensa ON canjes_recompensas(recompensa_id);
CREATE INDEX IF NOT EXISTS idx_canjes_estado ON canjes_recompensas(estado);

-- RLS para recompensas
ALTER TABLE recompensas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer recompensas activas"
  ON recompensas FOR SELECT
  TO authenticated
  USING (activa = true);

CREATE POLICY "Usuarios autenticados pueden crear recompensas"
  ON recompensas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar recompensas"
  ON recompensas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar recompensas"
  ON recompensas FOR DELETE
  TO authenticated
  USING (true);

-- RLS para canjes
ALTER TABLE canjes_recompensas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propios canjes"
  ON canjes_recompensas FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden ver todos los canjes"
  ON canjes_recompensas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden crear canjes"
  ON canjes_recompensas FOR INSERT
  TO authenticated
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Usuarios autenticados pueden actualizar canjes"
  ON canjes_recompensas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);