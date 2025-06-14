/*
  # Create collaborators management tables

  1. New Tables
    - `perfil_colaboradores`
      - Core profile information for collaborators
      - Tracks verification status and professional details
    
    - `habilidades_colaboradores`
      - Skills and certifications for each collaborator
      - Links collaborators to specific services they can provide

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create perfil_colaboradores table
CREATE TABLE IF NOT EXISTS perfil_colaboradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  especialidad text NOT NULL,
  descripcion text,
  experiencia integer NOT NULL,
  calificacion decimal(3,2) DEFAULT 0.0,
  disponibilidad jsonb DEFAULT '{}',
  servicios text[] DEFAULT '{}',
  estado text NOT NULL DEFAULT 'pendiente',
  verificado_por uuid REFERENCES auth.users(id),
  fecha_verificacion timestamptz,
  notas_verificacion text,
  fecha_actualizacion timestamptz DEFAULT now(),
  CONSTRAINT estado_valido CHECK (estado IN ('pendiente', 'verificado', 'rechazado', 'suspendido'))
);

-- Create habilidades_colaboradores table
CREATE TABLE IF NOT EXISTS habilidades_colaboradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  servicio_id text NOT NULL,
  nivel_experiencia text NOT NULL,
  certificacion_validada boolean DEFAULT false,
  validado_por uuid REFERENCES auth.users(id),
  fecha_validacion timestamptz,
  activo boolean DEFAULT true,
  CONSTRAINT nivel_experiencia_valido CHECK (nivel_experiencia IN ('principiante', 'intermedio', 'avanzado', 'experto'))
);

-- Create view for collaborators list
CREATE OR REPLACE VIEW colaboradores AS
SELECT 
  u.id,
  u.email,
  u.nombre,
  u.apellido,
  u.telefono,
  pc.especialidad,
  pc.experiencia,
  pc.calificacion,
  pc.estado,
  pc.fecha_verificacion,
  u.fecha_registro,
  pc.descripcion,
  pc.servicios,
  pc.notas_verificacion
FROM usuarios u
JOIN perfil_colaboradores pc ON u.id = pc.usuario_id
WHERE u.tipo_usuario = 'colaborador'
AND u.activo = true;

-- Enable RLS
ALTER TABLE perfil_colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE habilidades_colaboradores ENABLE ROW LEVEL SECURITY;

-- Create policies for perfil_colaboradores
CREATE POLICY "Allow read access for authenticated users"
  ON perfil_colaboradores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON perfil_colaboradores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated superadmins"
  ON perfil_colaboradores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() 
      AND tipo_usuario = 'superadmin'
    )
  );

-- Create policies for habilidades_colaboradores
CREATE POLICY "Allow read access for authenticated users"
  ON habilidades_colaboradores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON habilidades_colaboradores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated superadmins"
  ON habilidades_colaboradores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() 
      AND tipo_usuario = 'superadmin'
    )
  );

-- Create function to approve collaborator
CREATE OR REPLACE FUNCTION aprobar_colaborador(
  colaborador_id_param uuid,
  notas_param text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE perfil_colaboradores
  SET 
    estado = 'verificado',
    verificado_por = auth.uid(),
    fecha_verificacion = NOW(),
    notas_verificacion = notas_param
  WHERE usuario_id = colaborador_id_param;
END;
$$;