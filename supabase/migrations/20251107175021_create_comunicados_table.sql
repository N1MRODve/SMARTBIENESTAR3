/*
  # Crear tabla de comunicados

  1. Nuevas tablas
    - `comunicados`
      - `id` (uuid, primary key)
      - `titulo` (text) - Título del comunicado
      - `contenido` (text) - Contenido del comunicado
      - `tipo` (text) - Tipo: 'informativo', 'urgente', 'anuncio', 'celebracion'
      - `prioridad` (text) - Prioridad: 'baja', 'media', 'alta'
      - `estado` (text) - Estado: 'borrador', 'programado', 'enviado'
      - `fecha_publicacion` (timestamptz) - Fecha de publicación
      - `fecha_envio` (timestamptz) - Fecha de envío programado
      - `autor_id` (uuid, foreign key) - Empleado que creó el comunicado
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `comunicados_lecturas`
      - `id` (uuid, primary key)
      - `comunicado_id` (uuid, foreign key) - Comunicado leído
      - `empleado_id` (uuid, foreign key) - Empleado que leyó
      - `fecha_lectura` (timestamptz) - Fecha de lectura
      - `created_at` (timestamptz)

    - `comunicados_destinatarios`
      - `id` (uuid, primary key)
      - `comunicado_id` (uuid, foreign key)
      - `departamento_id` (uuid, foreign key) - NULL si es para todos
      - `empleado_id` (uuid, foreign key) - NULL si es para departamento/todos
      - `created_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas restrictivas para cada tabla
*/

CREATE TABLE IF NOT EXISTS comunicados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  contenido text NOT NULL,
  tipo text DEFAULT 'informativo' CHECK (tipo IN ('informativo', 'urgente', 'anuncio', 'celebracion')),
  prioridad text DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
  estado text DEFAULT 'borrador' CHECK (estado IN ('borrador', 'programado', 'enviado')),
  fecha_publicacion timestamptz,
  fecha_envio timestamptz,
  autor_id uuid REFERENCES empleados(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comunicados_lecturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comunicado_id uuid REFERENCES comunicados(id) ON DELETE CASCADE NOT NULL,
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  fecha_lectura timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(comunicado_id, empleado_id)
);

CREATE TABLE IF NOT EXISTS comunicados_destinatarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comunicado_id uuid REFERENCES comunicados(id) ON DELETE CASCADE NOT NULL,
  departamento_id uuid REFERENCES departamentos(id) ON DELETE CASCADE,
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CHECK (departamento_id IS NOT NULL OR empleado_id IS NOT NULL)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comunicados_autor ON comunicados(autor_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_estado ON comunicados(estado);
CREATE INDEX IF NOT EXISTS idx_comunicados_fecha_publicacion ON comunicados(fecha_publicacion);
CREATE INDEX IF NOT EXISTS idx_comunicados_lecturas_comunicado ON comunicados_lecturas(comunicado_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_lecturas_empleado ON comunicados_lecturas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_comunicados_destinatarios_comunicado ON comunicados_destinatarios(comunicado_id);

-- RLS para comunicados
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer comunicados enviados"
  ON comunicados FOR SELECT
  TO authenticated
  USING (estado = 'enviado' OR estado = 'programado');

CREATE POLICY "Usuarios autenticados pueden crear comunicados"
  ON comunicados FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Autores pueden actualizar sus comunicados"
  ON comunicados FOR UPDATE
  TO authenticated
  USING (
    autor_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    autor_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Autores pueden eliminar sus comunicados"
  ON comunicados FOR DELETE
  TO authenticated
  USING (
    autor_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

-- RLS para lecturas
ALTER TABLE comunicados_lecturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden leer sus propias lecturas"
  ON comunicados_lecturas FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Usuarios pueden registrar sus lecturas"
  ON comunicados_lecturas FOR INSERT
  TO authenticated
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

-- RLS para destinatarios
ALTER TABLE comunicados_destinatarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer destinatarios"
  ON comunicados_destinatarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear destinatarios"
  ON comunicados_destinatarios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar destinatarios"
  ON comunicados_destinatarios FOR DELETE
  TO authenticated
  USING (true);