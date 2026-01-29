/*
  # Add Platform Admin RLS Policies

  1. Changes
    - Add notas_internas and fecha_actualizacion columns to solicitudes_servicios
    - Add RLS policies for platform users to access solicitudes_servicios
    - Add RLS policies for platform users to update solicitudes status
    - Add empresa_id column to solicitudes_servicios for tracking

  2. Security
    - Platform users (superadmin, soporte, comercial) can read all solicitudes
    - Only superadmin and soporte can update solicitudes status
*/

-- Add columns to solicitudes_servicios if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'solicitudes_servicios' AND column_name = 'notas_internas'
  ) THEN
    ALTER TABLE solicitudes_servicios ADD COLUMN notas_internas text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'solicitudes_servicios' AND column_name = 'fecha_actualizacion'
  ) THEN
    ALTER TABLE solicitudes_servicios ADD COLUMN fecha_actualizacion timestamptz DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'solicitudes_servicios' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE solicitudes_servicios ADD COLUMN empresa_id uuid REFERENCES empresas(id);
  END IF;
END $$;

-- RLS policy for platform users to read all solicitudes
CREATE POLICY "Platform users can read all solicitudes"
  ON solicitudes_servicios
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol IN ('superadmin', 'soporte', 'comercial')
      AND up.activo = true
    )
  );

-- RLS policy for platform users to update solicitudes
CREATE POLICY "Platform users can update solicitudes"
  ON solicitudes_servicios
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol IN ('superadmin', 'soporte')
      AND up.activo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol IN ('superadmin', 'soporte')
      AND up.activo = true
    )
  );

-- RLS policy for platform users to read servicios
CREATE POLICY "Platform users can read all servicios"
  ON servicios
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol IN ('superadmin', 'soporte', 'comercial')
      AND up.activo = true
    )
  );

-- RLS policy for platform users to read encuestas
CREATE POLICY "Platform users can read all encuestas"
  ON encuestas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol IN ('superadmin', 'soporte')
      AND up.activo = true
    )
  );