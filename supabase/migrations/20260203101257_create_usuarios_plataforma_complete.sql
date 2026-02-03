/*
  # Create usuarios_plataforma table

  1. New Tables
    - `usuarios_plataforma`
      - `id` (uuid, primary key)
      - `auth_user_id` (uuid, references auth.users, unique, nullable)
      - `nombre` (text)
      - `email` (text, unique)
      - `rol` (text, check constraint for superadmin/soporte/comercial)
      - `activo` (boolean, default true)
      - `fecha_creacion` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Policies for reading own data and superadmin access
    
  3. Functions
    - link_platform_user_by_email: Securely links auth_user_id
*/

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

ALTER TABLE usuarios_plataforma ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Platform users can read own data"
  ON usuarios_plataforma FOR SELECT
  TO authenticated
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Super admins can read all platform users"
  ON usuarios_plataforma FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  );

CREATE POLICY "Super admins can insert platform users"
  ON usuarios_plataforma FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios_plataforma up
      WHERE up.auth_user_id = auth.uid()
      AND up.rol = 'superadmin'
      AND up.activo = true
    )
  );

CREATE POLICY "Super admins can update platform users"
  ON usuarios_plataforma FOR UPDATE
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

CREATE OR REPLACE FUNCTION link_platform_user_by_email()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_email TEXT;
  v_result jsonb;
BEGIN
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = auth.uid();

  IF v_user_email IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.usuarios_plataforma
  SET auth_user_id = auth.uid(), updated_at = now()
  WHERE email = v_user_email
    AND auth_user_id IS NULL
    AND activo = true
  RETURNING to_jsonb(usuarios_plataforma.*) INTO v_result;

  RETURN v_result;
END;
$$;

INSERT INTO usuarios_plataforma (auth_user_id, email, nombre, rol, activo)
VALUES (
  '5928c5ab-f8be-482b-baf2-97e80108d908',
  'dieter@smartbienestar.com',
  'Dieter',
  'superadmin',
  true
)
ON CONFLICT (email) DO UPDATE SET 
  auth_user_id = '5928c5ab-f8be-482b-baf2-97e80108d908',
  rol = 'superadmin',
  activo = true;
