/*
  # Create usuarios_plataforma table for SMART Bienestar internal team

  1. New Tables
    - `usuarios_plataforma`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, unique, references auth.users)
      - `nombre` (text, not null)
      - `email` (text, unique, not null)
      - `rol` (text, not null) - superadmin, soporte, comercial
      - `activo` (boolean, default true)
      - `fecha_creacion` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `usuarios_plataforma` table
    - Policy for platform users to read their own data
    - Policy for super admins to manage all platform users
    - Policy for platform users to access empresas and empleados

  3. Notes
    - This table is independent from `empleados` table
    - Super admins are internal SMART Bienestar team members
*/

-- Create usuarios_plataforma table
CREATE TABLE IF NOT EXISTS usuarios_plataforma (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text UNIQUE NOT NULL,
  rol text NOT NULL CHECK (rol IN ('superadmin', 'soporte', 'comercial')),
  activo boolean DEFAULT true,
  fecha_creacion timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE usuarios_plataforma ENABLE ROW LEVEL SECURITY;

-- Policy: Platform users can read their own data
CREATE POLICY "Platform users can read own data"
  ON usuarios_plataforma
  FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

-- Policy: Super admins can read all platform users
CREATE POLICY "Super admins can read all platform users"
  ON usuarios_plataforma
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  );

-- Policy: Super admins can insert platform users
CREATE POLICY "Super admins can insert platform users"
  ON usuarios_plataforma
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  );

-- Policy: Super admins can update platform users
CREATE POLICY "Super admins can update platform users"
  ON usuarios_plataforma
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  );

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_plataforma_auth_user_id 
  ON usuarios_plataforma(auth_user_id);

CREATE INDEX IF NOT EXISTS idx_usuarios_plataforma_rol 
  ON usuarios_plataforma(rol);

CREATE INDEX IF NOT EXISTS idx_usuarios_plataforma_activo 
  ON usuarios_plataforma(activo);

-- Function to check if user is a platform user
CREATE OR REPLACE FUNCTION is_platform_user(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios_plataforma
    WHERE auth_user_id = user_id
    AND activo = true
  );
$$;

-- Function to get platform user role
CREATE OR REPLACE FUNCTION get_platform_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT rol FROM usuarios_plataforma
  WHERE auth_user_id = user_id
  AND activo = true
  LIMIT 1;
$$;

-- Add RLS policy for platform users to read all empresas (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'empresas' 
    AND policyname = 'Super admins can read all empresas'
  ) THEN
    CREATE POLICY "Super admins can read all empresas"
      ON empresas
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
  END IF;
END $$;

-- Add RLS policy for platform users to read all empleados (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'empleados' 
    AND policyname = 'Super admins can read all empleados'
  ) THEN
    CREATE POLICY "Super admins can read all empleados"
      ON empleados
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
  END IF;
END $$;
