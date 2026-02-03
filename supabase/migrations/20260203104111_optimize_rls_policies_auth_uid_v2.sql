/*
  # Optimize RLS Policies with (select auth.uid()) Pattern

  1. Changes
    - Drop and recreate RLS policies that use auth.uid() or auth.jwt()
    - Replace with (select auth.uid()) and (select auth.jwt()) for better performance
    - This prevents re-evaluation of auth functions for each row

  2. Tables Affected
    - empleados
    - usuarios_plataforma
    - acciones_recomendadas
    - respuestas_encuesta
    - transacciones_puntos
    - solicitudes_servicios
    - reservas_sesiones
    - empresas
    - comunicados_lecturas
    - canjes_recompensas
    - recomendaciones_smart
    - comunicados
*/

-- empleados: empleados_update_own
DROP POLICY IF EXISTS "empleados_update_own" ON public.empleados;
CREATE POLICY "empleados_update_own" ON public.empleados
  FOR UPDATE TO authenticated
  USING (auth_user_id = (select auth.uid()))
  WITH CHECK (auth_user_id = (select auth.uid()));

-- empleados: empleados_insert_admin
DROP POLICY IF EXISTS "empleados_insert_admin" ON public.empleados;
CREATE POLICY "empleados_insert_admin" ON public.empleados
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = empleados.empresa_id
    )
  );

-- empleados: Admins pueden crear empleados en su empresa
DROP POLICY IF EXISTS "Admins pueden crear empleados en su empresa" ON public.empleados;

-- usuarios_plataforma: Users can read own platform data
DROP POLICY IF EXISTS "Users can read own platform data" ON public.usuarios_plataforma;
CREATE POLICY "Users can read own platform data" ON public.usuarios_plataforma
  FOR SELECT TO authenticated
  USING (auth_user_id = (select auth.uid()));

-- acciones_recomendadas: Users can insert own actions (uses user_id column)
DROP POLICY IF EXISTS "Users can insert own actions" ON public.acciones_recomendadas;
CREATE POLICY "Users can insert own actions" ON public.acciones_recomendadas
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- acciones_recomendadas: Users can read own actions (uses user_id column)
DROP POLICY IF EXISTS "Users can read own actions" ON public.acciones_recomendadas;
CREATE POLICY "Users can read own actions" ON public.acciones_recomendadas
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

-- respuestas_encuesta: respuestas_select
DROP POLICY IF EXISTS "respuestas_select" ON public.respuestas_encuesta;
CREATE POLICY "respuestas_select" ON public.respuestas_encuesta
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      JOIN public.encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND enc.id = respuestas_encuesta.encuesta_id
    )
  );

-- transacciones_puntos: Usuarios pueden ver sus propias transacciones
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias transacciones" ON public.transacciones_puntos;
CREATE POLICY "Usuarios pueden ver sus propias transacciones" ON public.transacciones_puntos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = transacciones_puntos.empleado_id
    )
  );

-- solicitudes_servicios: Usuarios pueden ver sus propias solicitudes
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias solicitudes" ON public.solicitudes_servicios;
CREATE POLICY "Usuarios pueden ver sus propias solicitudes" ON public.solicitudes_servicios
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = solicitudes_servicios.empleado_id
    )
  );

-- solicitudes_servicios: Usuarios pueden crear solicitudes
DROP POLICY IF EXISTS "Usuarios pueden crear solicitudes" ON public.solicitudes_servicios;
CREATE POLICY "Usuarios pueden crear solicitudes" ON public.solicitudes_servicios
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = solicitudes_servicios.empleado_id
    )
  );

-- reservas_sesiones: Usuarios pueden ver sus propias reservas
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias reservas" ON public.reservas_sesiones;
CREATE POLICY "Usuarios pueden ver sus propias reservas" ON public.reservas_sesiones
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = reservas_sesiones.empleado_id
    )
  );

-- reservas_sesiones: Usuarios pueden crear reservas
DROP POLICY IF EXISTS "Usuarios pueden crear reservas" ON public.reservas_sesiones;
CREATE POLICY "Usuarios pueden crear reservas" ON public.reservas_sesiones
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = reservas_sesiones.empleado_id
    )
  );

-- reservas_sesiones: Usuarios pueden actualizar sus reservas
DROP POLICY IF EXISTS "Usuarios pueden actualizar sus reservas" ON public.reservas_sesiones;
CREATE POLICY "Usuarios pueden actualizar sus reservas" ON public.reservas_sesiones
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = reservas_sesiones.empleado_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = reservas_sesiones.empleado_id
    )
  );

-- empresas: Usuarios pueden leer su propia empresa
DROP POLICY IF EXISTS "Usuarios pueden leer su propia empresa" ON public.empresas;
CREATE POLICY "Usuarios pueden leer su propia empresa" ON public.empresas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.empresa_id = empresas.id
    )
  );

-- empresas: Usuarios pueden actualizar su propia empresa
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propia empresa" ON public.empresas;
CREATE POLICY "Usuarios pueden actualizar su propia empresa" ON public.empresas
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = empresas.id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = empresas.id
    )
  );

-- comunicados_lecturas: lecturas_select_empresa
DROP POLICY IF EXISTS "lecturas_select_empresa" ON public.comunicados_lecturas;
CREATE POLICY "lecturas_select_empresa" ON public.comunicados_lecturas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = comunicados_lecturas.empleado_id
    )
  );

-- comunicados_lecturas: lecturas_insert_empleado
DROP POLICY IF EXISTS "lecturas_insert_empleado" ON public.comunicados_lecturas;
CREATE POLICY "lecturas_insert_empleado" ON public.comunicados_lecturas
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = comunicados_lecturas.empleado_id
    )
  );

-- canjes_recompensas: canjes_select_empresa
DROP POLICY IF EXISTS "canjes_select_empresa" ON public.canjes_recompensas;
CREATE POLICY "canjes_select_empresa" ON public.canjes_recompensas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND (e.id = canjes_recompensas.empleado_id OR e.es_admin = true)
    )
  );

-- canjes_recompensas: canjes_insert_empleado
DROP POLICY IF EXISTS "canjes_insert_empleado" ON public.canjes_recompensas;
CREATE POLICY "canjes_insert_empleado" ON public.canjes_recompensas
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.id = canjes_recompensas.empleado_id
    )
  );

-- recomendaciones_smart: Empresas ven sus recomendaciones
DROP POLICY IF EXISTS "Empresas ven sus recomendaciones" ON public.recomendaciones_smart;
CREATE POLICY "Empresas ven sus recomendaciones" ON public.recomendaciones_smart
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.empresa_id = recomendaciones_smart.empresa_id
    )
  );

-- recomendaciones_smart: Admins gestionan recomendaciones
DROP POLICY IF EXISTS "Admins gestionan recomendaciones" ON public.recomendaciones_smart;
CREATE POLICY "Admins gestionan recomendaciones" ON public.recomendaciones_smart
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = recomendaciones_smart.empresa_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.es_admin = true
      AND e.empresa_id = recomendaciones_smart.empresa_id
    )
  );

-- comunicados: Empleados pueden ver comunicados enviados
DROP POLICY IF EXISTS "Empleados pueden ver comunicados enviados" ON public.comunicados;
CREATE POLICY "Empleados pueden ver comunicados enviados" ON public.comunicados
  FOR SELECT TO authenticated
  USING (
    estado = 'enviado' AND
    EXISTS (
      SELECT 1 FROM public.empleados e
      WHERE e.auth_user_id = (select auth.uid())
      AND e.empresa_id = comunicados.empresa_id
    )
  );
