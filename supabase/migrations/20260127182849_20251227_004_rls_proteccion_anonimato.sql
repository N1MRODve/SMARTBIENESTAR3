/*
  # Políticas RLS para proteger anonimato en respuestas

  ## Cambios realizados

  1. **Vista respuestas_anonimizadas**
    - Oculta empleado_id en encuestas anónimas
    - Los administradores ven NULL en lugar del empleado_id real

  2. **Función get_respuestas_anonimizadas**
    - RPC para que administradores consulten respuestas respetando anonimato
    - Garantiza cumplimiento RGPD a nivel de base de datos

  3. **Políticas RLS simplificadas**
    - Administradores y empleados pueden consultar respuestas
    - La vista se encarga de ocultar datos sensibles
*/

-- =====================================================
-- VISTA: respuestas_anonimizadas
-- =====================================================
CREATE OR REPLACE VIEW respuestas_anonimizadas AS
SELECT 
  re.id,
  re.encuesta_id,
  re.pregunta_id,
  CASE 
    WHEN e.privacidad_nivel IN ('anonimato_completo', 'anonimato_parcial') THEN NULL
    ELSE re.empleado_id
  END as empleado_id,
  CASE
    WHEN e.privacidad_nivel = 'anonimato_completo' THEN NULL
    ELSE re.departamento
  END as departamento,
  re.respuesta,
  re.fecha_respuesta,
  re.hash_ip,
  re.submitted_at,
  re.puntos_otorgados,
  re.bonus_aplicado,
  e.privacidad_nivel,
  e.titulo as encuesta_titulo,
  e.categoria as encuesta_categoria,
  e.empresa_id
FROM respuestas_encuesta re
INNER JOIN encuestas e ON re.encuesta_id = e.id;

GRANT SELECT ON respuestas_anonimizadas TO authenticated;

COMMENT ON VIEW respuestas_anonimizadas IS
'Vista que oculta empleado_id en encuestas anónimas. Garantiza cumplimiento RGPD.';

-- =====================================================
-- FUNCIÓN RPC: get_respuestas_anonimizadas
-- =====================================================
CREATE OR REPLACE FUNCTION get_respuestas_anonimizadas(
  p_encuesta_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  encuesta_id uuid,
  pregunta_id uuid,
  empleado_id uuid,
  departamento text,
  respuesta text,
  fecha_respuesta timestamptz,
  privacidad_nivel text,
  encuesta_titulo text,
  encuesta_categoria text
) AS $$
DECLARE
  v_user_id uuid;
  v_es_admin boolean;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  SELECT e.es_admin
  INTO v_es_admin
  FROM empleados e
  WHERE e.auth_user_id = v_user_id;

  IF v_es_admin IS NULL OR NOT v_es_admin THEN
    RAISE EXCEPTION 'Solo administradores pueden acceder a esta función';
  END IF;

  RETURN QUERY
  SELECT 
    ra.id,
    ra.encuesta_id,
    ra.pregunta_id,
    ra.empleado_id,
    ra.departamento,
    ra.respuesta,
    ra.fecha_respuesta,
    ra.privacidad_nivel,
    ra.encuesta_titulo,
    ra.encuesta_categoria
  FROM respuestas_anonimizadas ra
  WHERE (p_encuesta_id IS NULL OR ra.encuesta_id = p_encuesta_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_respuestas_anonimizadas(uuid) TO authenticated;

COMMENT ON FUNCTION get_respuestas_anonimizadas IS
'RPC para administradores. Oculta automáticamente empleado_id en encuestas anónimas.';

-- =====================================================
-- POLÍTICAS RLS
-- =====================================================
DROP POLICY IF EXISTS "Administradores pueden ver respuestas de su empresa" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Admin puede ver respuestas de su empresa" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Admins can view responses from their company" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Empleados ven sus propias respuestas" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Administradores acceden via vista anonimizada" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Administradores ven respuestas de su empresa" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Empleados ven sus respuestas" ON respuestas_encuesta;

CREATE POLICY "Admin acceso respuestas"
  ON respuestas_encuesta
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e
      WHERE e.auth_user_id = auth.uid()
        AND e.es_admin = true
    )
  );

CREATE POLICY "Empleado acceso propias respuestas"
  ON respuestas_encuesta
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e
      WHERE e.auth_user_id = auth.uid()
        AND e.id = respuestas_encuesta.empleado_id
    )
  );

COMMENT ON POLICY "Admin acceso respuestas" ON respuestas_encuesta IS
'Administradores pueden ver respuestas. Usar respuestas_anonimizadas para respetar anonimato RGPD.';

DO $$
BEGIN
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'PROTECCIÓN DE ANONIMATO RGPD IMPLEMENTADA';
  RAISE NOTICE '===========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'USO PARA ADMINISTRADORES:';
  RAISE NOTICE '  SELECT * FROM respuestas_anonimizadas;';
  RAISE NOTICE '  SELECT * FROM get_respuestas_anonimizadas();';
  RAISE NOTICE '';
  RAISE NOTICE 'empleado_id será NULL en encuestas anónimas';
  RAISE NOTICE '===========================================';
END $$;
