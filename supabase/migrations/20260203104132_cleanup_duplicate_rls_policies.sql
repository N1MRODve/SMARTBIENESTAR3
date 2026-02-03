/*
  # Cleanup Duplicate RLS Policies

  1. Changes
    - Remove duplicate permissive policies for the same action
    - Keep the most specific/secure policy for each table/action combination
    
  2. Tables Affected
    - acciones_recomendadas
    - comunicados
    - departamentos
    - empleados
    - empresas
    - encuestas
    - recomendaciones_smart
    - recompensas
    - reservas_sesiones
    - servicios
    - solicitudes_servicios
    - transacciones_puntos
*/

-- acciones_recomendadas: Keep "Users can read own actions", drop admin policy
DROP POLICY IF EXISTS "Admins can read all actions" ON public.acciones_recomendadas;

-- comunicados: Clean up duplicates
DROP POLICY IF EXISTS "comunicados_delete_admin" ON public.comunicados;
DROP POLICY IF EXISTS "comunicados_insert_admin" ON public.comunicados;
DROP POLICY IF EXISTS "comunicados_select_empresa" ON public.comunicados;
DROP POLICY IF EXISTS "comunicados_update_admin" ON public.comunicados;

-- departamentos: Clean up duplicates
DROP POLICY IF EXISTS "departamentos_delete_admin" ON public.departamentos;
DROP POLICY IF EXISTS "departamentos_insert_admin" ON public.departamentos;
DROP POLICY IF EXISTS "departamentos_select_empresa" ON public.departamentos;
DROP POLICY IF EXISTS "departamentos_update_admin" ON public.departamentos;

-- empleados: Clean up duplicates
DROP POLICY IF EXISTS "empleados_delete_admin" ON public.empleados;
DROP POLICY IF EXISTS "empleados_select_same_empresa" ON public.empleados;

-- empresas: Clean up duplicates
DROP POLICY IF EXISTS "empresas_select_own" ON public.empresas;
DROP POLICY IF EXISTS "empresas_update_admin" ON public.empresas;

-- encuestas: Clean up duplicates
DROP POLICY IF EXISTS "encuestas_delete_admin" ON public.encuestas;
DROP POLICY IF EXISTS "encuestas_insert_admin" ON public.encuestas;
DROP POLICY IF EXISTS "encuestas_select_empresa" ON public.encuestas;
DROP POLICY IF EXISTS "encuestas_update_admin" ON public.encuestas;

-- recompensas: Clean up duplicates
DROP POLICY IF EXISTS "recompensas_delete_admin" ON public.recompensas;
DROP POLICY IF EXISTS "recompensas_insert_admin" ON public.recompensas;
DROP POLICY IF EXISTS "recompensas_select_empresa" ON public.recompensas;
DROP POLICY IF EXISTS "recompensas_update_admin" ON public.recompensas;
