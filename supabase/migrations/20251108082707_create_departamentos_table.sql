/*
  # Crear tabla de departamentos

  1. Nueva tabla
    - `departamentos`
      - `id` (uuid, primary key)
      - `nombre` (text, unique) - Nombre del departamento
      - `descripcion` (text) - Descripción del departamento
      - `created_at` (timestamptz) - Fecha de creación
      - `updated_at` (timestamptz) - Fecha de actualización

  2. Seguridad
    - Habilitar RLS en la tabla `departamentos`
    - Política para que usuarios autenticados puedan leer departamentos

  3. Datos iniciales
    - Se insertan los departamentos principales de la empresa
*/

CREATE TABLE IF NOT EXISTS departamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text UNIQUE NOT NULL,
  descripcion text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios autenticados pueden leer departamentos" ON departamentos;
CREATE POLICY "Usuarios autenticados pueden leer departamentos"
  ON departamentos FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden crear departamentos" ON departamentos;
CREATE POLICY "Usuarios autenticados pueden crear departamentos"
  ON departamentos FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar departamentos" ON departamentos;
CREATE POLICY "Usuarios autenticados pueden actualizar departamentos"
  ON departamentos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar departamentos" ON departamentos;
CREATE POLICY "Usuarios autenticados pueden eliminar departamentos"
  ON departamentos FOR DELETE
  TO authenticated
  USING (true);

-- Insertar departamentos iniciales
INSERT INTO departamentos (nombre, descripcion) VALUES
  ('Desarrollo', 'Departamento de desarrollo de software'),
  ('Marketing', 'Departamento de marketing y comunicación'),
  ('Ventas', 'Departamento de ventas y comercial'),
  ('RRHH', 'Departamento de recursos humanos'),
  ('Finanzas', 'Departamento de finanzas y contabilidad'),
  ('Operaciones', 'Departamento de operaciones'),
  ('Atención al Cliente', 'Departamento de atención al cliente'),
  ('Calidad', 'Departamento de calidad'),
  ('Administración', 'Departamento de administración')
ON CONFLICT (nombre) DO NOTHING;