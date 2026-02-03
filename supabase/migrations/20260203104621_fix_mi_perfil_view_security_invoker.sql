/*
  # Fix mi_perfil View Security

  1. Changes
    - Drop and recreate `mi_perfil` view with SECURITY INVOKER instead of SECURITY DEFINER
    - SECURITY INVOKER ensures the view runs with the privileges of the calling user
    - This is more secure as it respects RLS policies

  2. Security
    - View now executes with invoker's permissions
    - RLS policies on underlying tables will be enforced
*/

DROP VIEW IF EXISTS public.mi_perfil;

CREATE VIEW public.mi_perfil
WITH (security_invoker = true)
AS
SELECT 
  e.id,
  e.nombre,
  e.email,
  e.cargo,
  e.estado,
  e.puntos,
  e.es_admin,
  e.avatar_url,
  e.empresa_id,
  emp.nombre AS empresa_nombre,
  emp.logo_url AS empresa_logo,
  emp.dominio AS empresa_dominio,
  d.nombre AS departamento_nombre
FROM empleados e
LEFT JOIN empresas emp ON e.empresa_id = emp.id
LEFT JOIN departamentos d ON e.departamento_id = d.id
WHERE e.auth_user_id = (select auth.uid());

GRANT SELECT ON public.mi_perfil TO authenticated;
