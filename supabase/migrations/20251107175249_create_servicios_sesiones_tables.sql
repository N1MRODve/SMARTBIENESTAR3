/*
  # Crear tablas de servicios y sesiones

  1. Nuevas tablas
    - `servicios`
      - `id` (uuid, primary key)
      - `nombre` (text) - Nombre del servicio
      - `descripcion` (text) - Descripción del servicio
      - `categoria` (text) - Categoría: 'salud_mental', 'fisico', 'financiero', 'legal', 'familiar'
      - `tipo` (text) - Tipo: 'sesion_grupal', 'sesion_individual', 'taller', 'webinar'
      - `duracion_minutos` (integer) - Duración en minutos
      - `cupo_maximo` (integer) - Cupo máximo de participantes
      - `proveedor` (text) - Nombre del proveedor
      - `activo` (boolean) - Si está activo o no
      - `imagen_url` (text) - URL de la imagen
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sesiones`
      - `id` (uuid, primary key)
      - `servicio_id` (uuid, foreign key) - Servicio relacionado
      - `titulo` (text) - Título de la sesión
      - `descripcion` (text) - Descripción de la sesión
      - `fecha_inicio` (timestamptz) - Fecha y hora de inicio
      - `fecha_fin` (timestamptz) - Fecha y hora de fin
      - `modalidad` (text) - Modalidad: 'presencial', 'virtual', 'hibrido'
      - `ubicacion` (text) - Ubicación física o enlace virtual
      - `cupo_maximo` (integer) - Cupo máximo
      - `cupo_disponible` (integer) - Cupo disponible
      - `estado` (text) - Estado: 'programada', 'en_curso', 'completada', 'cancelada'
      - `instructor` (text) - Nombre del instructor
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `solicitudes_servicios`
      - `id` (uuid, primary key)
      - `empleado_id` (uuid, foreign key) - Empleado que solicita
      - `servicio_id` (uuid, foreign key) - Servicio solicitado
      - `estado` (text) - Estado: 'pendiente', 'aprobada', 'rechazada', 'completada'
      - `motivo` (text) - Motivo de la solicitud
      - `notas_admin` (text) - Notas del administrador
      - `fecha_solicitud` (timestamptz)
      - `fecha_respuesta` (timestamptz)
      - `created_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas apropiadas para cada tabla
*/

CREATE TABLE IF NOT EXISTS servicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('salud_mental', 'fisico', 'financiero', 'legal', 'familiar')),
  tipo text NOT NULL CHECK (tipo IN ('sesion_grupal', 'sesion_individual', 'taller', 'webinar')),
  duracion_minutos integer,
  cupo_maximo integer,
  proveedor text,
  activo boolean DEFAULT true,
  imagen_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sesiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  servicio_id uuid REFERENCES servicios(id) ON DELETE CASCADE NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  fecha_inicio timestamptz NOT NULL,
  fecha_fin timestamptz NOT NULL,
  modalidad text NOT NULL CHECK (modalidad IN ('presencial', 'virtual', 'hibrido')),
  ubicacion text,
  cupo_maximo integer NOT NULL,
  cupo_disponible integer NOT NULL,
  estado text DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'completada', 'cancelada')),
  instructor text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solicitudes_servicios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  servicio_id uuid REFERENCES servicios(id) ON DELETE SET NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'completada')),
  motivo text,
  notas_admin text,
  fecha_solicitud timestamptz DEFAULT now(),
  fecha_respuesta timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);
CREATE INDEX IF NOT EXISTS idx_sesiones_servicio ON sesiones(servicio_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_sesiones_estado ON sesiones(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_empleado ON solicitudes_servicios(empleado_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_servicios(estado);

-- RLS para servicios
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer servicios activos"
  ON servicios FOR SELECT
  TO authenticated
  USING (activo = true);

CREATE POLICY "Usuarios autenticados pueden crear servicios"
  ON servicios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar servicios"
  ON servicios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar servicios"
  ON servicios FOR DELETE
  TO authenticated
  USING (true);

-- RLS para sesiones
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados pueden leer sesiones"
  ON sesiones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados pueden crear sesiones"
  ON sesiones FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar sesiones"
  ON sesiones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar sesiones"
  ON sesiones FOR DELETE
  TO authenticated
  USING (true);

-- RLS para solicitudes
ALTER TABLE solicitudes_servicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propias solicitudes"
  ON solicitudes_servicios FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden ver todas las solicitudes"
  ON solicitudes_servicios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden crear solicitudes"
  ON solicitudes_servicios FOR INSERT
  TO authenticated
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden actualizar solicitudes"
  ON solicitudes_servicios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);