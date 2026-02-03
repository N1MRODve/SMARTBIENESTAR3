/*
  # Fix RLS recursion in usuarios_plataforma

  The problem: Policies that check "is this user a superadmin?" query the same
  table they're protecting, causing infinite recursion.

  Solution: Create a SECURITY DEFINER function that bypasses RLS to check
  if the current user is a platform superadmin.
*/

CREATE OR REPLACE FUNCTION is_platform_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios_plataforma
    WHERE auth_user_id = auth.uid()
    AND rol = 'superadmin'
    AND activo = true
  );
$$;

DROP POLICY IF EXISTS "Platform users can read own data" ON usuarios_plataforma;
DROP POLICY IF EXISTS "Super admins can read all platform users" ON usuarios_plataforma;
DROP POLICY IF EXISTS "Super admins can insert platform users" ON usuarios_plataforma;
DROP POLICY IF EXISTS "Super admins can update platform users" ON usuarios_plataforma;

CREATE POLICY "Users can read own platform data"
  ON usuarios_plataforma FOR SELECT
  TO authenticated
  USING (
    auth.uid() = auth_user_id
    OR is_platform_superadmin()
  );

CREATE POLICY "Superadmins can insert platform users"
  ON usuarios_plataforma FOR INSERT
  TO authenticated
  WITH CHECK (is_platform_superadmin());

CREATE POLICY "Superadmins can update platform users"
  ON usuarios_plataforma FOR UPDATE
  TO authenticated
  USING (is_platform_superadmin())
  WITH CHECK (is_platform_superadmin());

CREATE POLICY "Superadmins can delete platform users"
  ON usuarios_plataforma FOR DELETE
  TO authenticated
  USING (is_platform_superadmin());
