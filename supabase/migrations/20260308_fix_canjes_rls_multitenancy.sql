/*
  # Fix canjes_recompensas RLS Policies for Multitenancy

  ## Security Fixes
  - "Administradores pueden ver todos los canjes" was USING(true) - allows any user to see all canjes
  - "Usuarios autenticados pueden actualizar canjes" was USING(true) - allows anyone to update any canje

  ## Changes
  - Replace permissive policies with proper empresa_id filtering
  - Admins can only see/update canjes from employees of their company
*/

-- Fix: "Administradores pueden ver todos los canjes"
-- Was USING(true), should only allow admins to see canjes from their company
DROP POLICY IF EXISTS "Administradores pueden ver todos los canjes" ON public.canjes_recompensas;

CREATE POLICY "Admins pueden ver canjes de su empresa" ON public.canjes_recompensas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados admin_emp
      JOIN public.empleados canje_emp ON canje_emp.id = canjes_recompensas.empleado_id
      WHERE admin_emp.auth_user_id = (select auth.uid())
      AND admin_emp.es_admin = true
      AND admin_emp.empresa_id = canje_emp.empresa_id
    )
  );

-- Fix: "Usuarios autenticados pueden actualizar canjes"
-- Was USING(true), should only allow admins to update canjes from their company
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar canjes" ON public.canjes_recompensas;

CREATE POLICY "Admins pueden actualizar canjes de su empresa" ON public.canjes_recompensas
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados admin_emp
      JOIN public.empleados canje_emp ON canje_emp.id = canjes_recompensas.empleado_id
      WHERE admin_emp.auth_user_id = (select auth.uid())
      AND admin_emp.es_admin = true
      AND admin_emp.empresa_id = canje_emp.empresa_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados admin_emp
      JOIN public.empleados canje_emp ON canje_emp.id = canjes_recompensas.empleado_id
      WHERE admin_emp.auth_user_id = (select auth.uid())
      AND admin_emp.es_admin = true
      AND admin_emp.empresa_id = canje_emp.empresa_id
    )
  );

-- Note: Keep existing policy "Usuarios pueden ver sus propios canjes"
-- This allows employees to see their own canjes (line 94-99 in original migration)
