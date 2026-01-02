-- =====================================================
-- FUNCIÓN RPC: Fuente única de verdad para encuestas pendientes
-- =====================================================
-- Esta función unifica la lógica de encuestas pendientes
-- para Badge, Dashboard y Vista de Encuestas
-- =====================================================

CREATE OR REPLACE FUNCTION fn_get_encuestas_pendientes_empleado()
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_empleado_id uuid;
  v_empresa_id uuid;
  v_result jsonb;
  v_encuestas jsonb;
  v_total integer;
BEGIN
  -- Obtener usuario autenticado
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No autenticado',
      'encuestas', '[]'::jsonb,
      'total', 0
    );
  END IF;

  -- Obtener empleado y su empresa
  SELECT id, empresa_id INTO v_empleado_id, v_empresa_id
  FROM empleados
  WHERE auth_user_id = v_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Empleado no encontrado',
      'encuestas', '[]'::jsonb,
      'total', 0
    );
  END IF;

  -- Obtener encuestas pendientes con todos los filtros correctos
  WITH encuestas_pendientes AS (
    SELECT
      e.id,
      e.titulo,
      e.descripcion,
      e.categoria,
      e.estado,
      e.privacidad_nivel,
      e.fecha_inicio,
      e.fecha_fin,
      COALESCE((
        SELECT COUNT(*)::integer
        FROM preguntas_encuesta pe
        WHERE pe.encuesta_id = e.id
      ), 0) as num_preguntas,
      -- Calcular urgencia basada en fecha_fin
      CASE
        WHEN e.fecha_fin IS NOT NULL AND
             EXTRACT(EPOCH FROM (e.fecha_fin - NOW())) / 3600 <= 24
        THEN 'urgente'
        WHEN e.fecha_fin IS NOT NULL AND
             EXTRACT(EPOCH FROM (e.fecha_fin - NOW())) / 3600 <= 72
        THEN 'pronto'
        ELSE 'normal'
      END as urgencia,
      -- Horas restantes
      CASE
        WHEN e.fecha_fin IS NOT NULL
        THEN GREATEST(0, EXTRACT(EPOCH FROM (e.fecha_fin - NOW())) / 3600)::integer
        ELSE NULL
      END as horas_restantes,
      -- Puntos estimados (fijo 50, ajustable)
      50 as puntos_recompensa
    FROM encuestas e
    WHERE
      -- Debe ser de la empresa del empleado
      e.empresa_id = v_empresa_id
      -- Debe estar activa
      AND e.estado = 'activa'
      -- Fecha de inicio: null o ya pasó
      AND (e.fecha_inicio IS NULL OR e.fecha_inicio <= NOW())
      -- Fecha de fin: null o aún no pasó
      AND (e.fecha_fin IS NULL OR e.fecha_fin > NOW())
      -- NO debe estar ya respondida por este empleado
      AND NOT EXISTS (
        SELECT 1
        FROM respuestas_encuesta re
        WHERE re.encuesta_id = e.id
          AND re.empleado_id = v_empleado_id
      )
    ORDER BY
      -- Primero las urgentes
      CASE
        WHEN e.fecha_fin IS NOT NULL AND
             EXTRACT(EPOCH FROM (e.fecha_fin - NOW())) / 3600 <= 24
        THEN 0
        WHEN e.fecha_fin IS NOT NULL AND
             EXTRACT(EPOCH FROM (e.fecha_fin - NOW())) / 3600 <= 72
        THEN 1
        ELSE 2
      END,
      -- Luego por fecha de fin más próxima
      e.fecha_fin NULLS LAST
  )
  SELECT
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', id,
        'titulo', titulo,
        'descripcion', descripcion,
        'categoria', categoria,
        'estado', estado,
        'privacidad_nivel', privacidad_nivel,
        'fecha_inicio', fecha_inicio,
        'fecha_fin', fecha_fin,
        'num_preguntas', num_preguntas,
        'tiempo_estimado', CEIL(num_preguntas * 0.5),
        'urgencia', urgencia,
        'horas_restantes', horas_restantes,
        'puntos_recompensa', puntos_recompensa
      )
    ), '[]'::jsonb),
    COUNT(*)::integer
  INTO v_encuestas, v_total
  FROM encuestas_pendientes;

  RETURN jsonb_build_object(
    'success', true,
    'empleado_id', v_empleado_id,
    'empresa_id', v_empresa_id,
    'encuestas', v_encuestas,
    'total', v_total,
    'encuesta_prioritaria', CASE
      WHEN v_total > 0 THEN v_encuestas->0
      ELSE NULL
    END
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'encuestas', '[]'::jsonb,
    'total', 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos a usuarios autenticados
GRANT EXECUTE ON FUNCTION fn_get_encuestas_pendientes_empleado() TO authenticated;

-- Comentario descriptivo
COMMENT ON FUNCTION fn_get_encuestas_pendientes_empleado() IS
'Fuente única de verdad para encuestas pendientes del empleado.
Usada por: Badge del menú, Dashboard, Vista de Encuestas.
Retorna encuestas que:
- Pertenecen a la empresa del empleado
- Están en estado "activa"
- Están dentro del rango de fechas válido
- NO han sido respondidas por el empleado';
