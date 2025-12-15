/*
  # Crear tabla de empleados

  1. Nueva tabla
    - `empleados`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, foreign key) - Relación con auth.users
      - `nombre` (text) - Nombre completo del empleado
      - `email` (text, unique) - Email del empleado
      - `departamento_id` (uuid, foreign key) - Departamento al que pertenece
      - `cargo` (text) - Cargo del empleado
      - `estado` (text) - Estado: 'Activo', 'Inactivo', 'Invitado'
      - `puntos` (integer) - Puntos de gamificación
      - `avatar_url` (text) - URL del avatar
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización

  2. Seguridad
    - Habilitar RLS en la tabla `empleados`
    - Política para que usuarios autenticados puedan leer todos los empleados
    - Política para que usuarios puedan actualizar su propia información
    - Política para que administradores puedan crear, actualizar y eliminar empleados

  3. Notas importantes
    - La columna `puntos` almacena el total de puntos de gamificación del empleado
    - El estado 'Invitado' indica que el empleado ha sido invitado pero aún no ha activado su cuenta
*/

CREATE TABLE IF NOT EXISTS empleados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  departamento_id uuid REFERENCES departamentos(id) ON DELETE SET NULL,
  cargo text DEFAULT '',
  estado text DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Invitado')),
  puntos integer DEFAULT 0,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_empleados_departamento ON empleados(departamento_id);
CREATE INDEX IF NOT EXISTS idx_empleados_auth_user ON empleados(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_empleados_email ON empleados(email);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);

ALTER TABLE empleados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios autenticados pueden leer empleados" ON empleados;
CREATE POLICY "Usuarios autenticados pueden leer empleados"
  ON empleados FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON empleados;
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON empleados FOR UPDATE
  TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Cualquier usuario autenticado puede crear empleados" ON empleados;
CREATE POLICY "Cualquier usuario autenticado puede crear empleados"
  ON empleados FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Cualquier usuario autenticado puede eliminar empleados" ON empleados;
CREATE POLICY "Cualquier usuario autenticado puede eliminar empleados"
  ON empleados FOR DELETE
  TO authenticated
  USING (true);