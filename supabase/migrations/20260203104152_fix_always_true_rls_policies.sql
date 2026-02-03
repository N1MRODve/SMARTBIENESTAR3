/*
  # Fix Always-True RLS Policies

  1. Security Fixes
    - Fix "Administradores pueden actualizar cualquier reserva" - was USING(true)
    - Fix "Administradores pueden actualizar solicitudes" - was USING(true)
    - Fix "Sistema puede crear transacciones" - was WITH CHECK(true)

  2. Changes
    - Add proper admin checks to restrict access to only admins of the same company
*/

-- Fix reservas_sesiones: Administradores pueden actualizar cualquier reserva
DROP POLICY IF EXISTS "Administradores pueden actualizar cualquier reserva" ON public.reservas_sesiones;
CREATE POLICY "Administradores pueden actualizar cualquier reserva" ON public.reservas_sesiones
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      JOIN public.sesiones s ON s.id = reservas_sesiones.sesion_id
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = s.empresa_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      JOIN public.sesiones s ON s.id = reservas_sesiones.sesion_id
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = s.empresa_id
    )
  );

-- Fix solicitudes_servicios: Administradores pueden actualizar solicitudes
DROP POLICY IF EXISTS "Administradores pueden actualizar solicitudes" ON public.solicitudes_servicios;
CREATE POLICY "Administradores pueden actualizar solicitudes" ON public.solicitudes_servicios
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados admin_emp
      JOIN public.empleados sol_emp ON sol_emp.id = solicitudes_servicios.empleado_id
      WHERE admin_emp.auth_user_id = (select auth.uid())
      AND admin_emp.es_admin = true
      AND admin_emp.empresa_id = sol_emp.empresa_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados admin_emp
      JOIN public.empleados sol_emp ON sol_emp.id = solicitudes_servicios.empleado_id
      WHERE admin_emp.auth_user_id = (select auth.uid())
      AND admin_emp.es_admin = true
      AND admin_emp.empresa_id = sol_emp.empresa_id
    )
  );

-- Fix transacciones_puntos: Sistema puede crear transacciones
-- This should only allow inserting transactions for the authenticated user's employee record
DROP POLICY IF EXISTS "Sistema puede crear transacciones" ON public.transacciones_puntos;
CREATE POLICY "Sistema puede crear transacciones" ON public.transacciones_puntos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND (e.id = transacciones_puntos.empleado_id OR e.es_admin = true)
    )
  );
