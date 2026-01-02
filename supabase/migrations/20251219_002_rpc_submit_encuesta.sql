-- =====================================================
-- RPC: fn_submit_encuesta - Envío atómico de encuesta
-- =====================================================
-- Esta función maneja todo el flujo de envío de encuesta:
-- 1. Validaciones (empresa, estado, fechas, duplicados)
-- 2. Inserción de respuestas
-- 3. Cálculo de puntos (base + bonus si aplica)
-- 4. Otorgamiento de puntos al empleado
-- 5. Retorno de resultado completo
-- =====================================================

CREATE OR REPLACE FUNCTION fn_submit_encuesta(
  p_encuesta_id uuid,
  p_respuestas jsonb  -- Array de {pregunta_id, respuesta}
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_empleado_id uuid;
  v_empleado_empresa_id uuid;
  v_empleado_puntos integer;
  v_encuesta record;
  v_respuesta record;
  v_puntos_base integer;
  v_puntos_bonus integer := 0;
  v_puntos_total integer;
  v_bonus_aplicado boolean := false;
  v_horas_transcurridas numeric;
  v_fecha_referencia timestamptz;
  v_respuestas_insertadas integer := 0;
  v_ya_respondida boolean := false;
BEGIN
  -- =====================================================
  -- VALIDACIÓN 1: Usuario autenticado
  -- =====================================================
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No autenticado',
      'code', 'AUTH_REQUIRED'
    );
  END IF;

  -- =====================================================
  -- VALIDACIÓN 2: Obtener empleado
  -- =====================================================
  SELECT id, empresa_id, puntos
  INTO v_empleado_id, v_empleado_empresa_id, v_empleado_puntos
  FROM empleados
  WHERE auth_user_id = v_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Empleado no encontrado',
      'code', 'EMPLOYEE_NOT_FOUND'
    );
  END IF;

  -- =====================================================
  -- VALIDACIÓN 3: Obtener encuesta y validar
  -- =====================================================
  SELECT
    e.id,
    e.titulo,
    e.estado,
    e.empresa_id,
    e.fecha_inicio,
    e.fecha_fin,
    e.fecha_creacion,
    COALESCE(e.puntos_base, 50) as puntos_base,
    COALESCE(e.puntos_bonus_rapido, 0) as puntos_bonus_rapido,
    COALESCE(e.bonus_horas_limite, 24) as bonus_horas_limite
  INTO v_encuesta
  FROM encuestas e
  WHERE e.id = p_encuesta_id;

  IF v_encuesta IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Encuesta no encontrada',
      'code', 'SURVEY_NOT_FOUND'
    );
  END IF;

  -- Validar empresa
  IF v_encuesta.empresa_id != v_empleado_empresa_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No tienes acceso a esta encuesta',
      'code', 'ACCESS_DENIED'
    );
  END IF;

  -- Validar estado
  IF v_encuesta.estado != 'activa' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Esta encuesta no está activa',
      'code', 'SURVEY_NOT_ACTIVE'
    );
  END IF;

  -- Validar fechas
  IF v_encuesta.fecha_inicio IS NOT NULL AND v_encuesta.fecha_inicio > NOW() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Esta encuesta aún no ha comenzado',
      'code', 'SURVEY_NOT_STARTED'
    );
  END IF;

  IF v_encuesta.fecha_fin IS NOT NULL AND v_encuesta.fecha_fin < NOW() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Esta encuesta ha expirado',
      'code', 'SURVEY_EXPIRED'
    );
  END IF;

  -- =====================================================
  -- VALIDACIÓN 4: Verificar si ya respondió (idempotencia)
  -- =====================================================
  SELECT EXISTS(
    SELECT 1 FROM respuestas_encuesta
    WHERE encuesta_id = p_encuesta_id
      AND empleado_id = v_empleado_id
  ) INTO v_ya_respondida;

  IF v_ya_respondida THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ya has respondido esta encuesta',
      'code', 'ALREADY_SUBMITTED',
      'is_duplicate', true
    );
  END IF;

  -- =====================================================
  -- PASO 1: Insertar respuestas
  -- =====================================================
  FOR v_respuesta IN SELECT * FROM jsonb_to_recordset(p_respuestas) AS x(pregunta_id uuid, respuesta text)
  LOOP
    INSERT INTO respuestas_encuesta (
      encuesta_id,
      pregunta_id,
      empleado_id,
      respuesta,
      fecha_respuesta,
      submitted_at
    ) VALUES (
      p_encuesta_id,
      v_respuesta.pregunta_id,
      v_empleado_id,
      v_respuesta.respuesta,
      NOW(),
      NOW()
    );
    v_respuestas_insertadas := v_respuestas_insertadas + 1;
  END LOOP;

  -- =====================================================
  -- PASO 2: Calcular puntos
  -- =====================================================
  v_puntos_base := v_encuesta.puntos_base;

  -- Calcular bonus si aplica
  IF v_encuesta.puntos_bonus_rapido > 0 THEN
    -- Usar fecha_inicio como referencia, o fecha_creacion como fallback
    v_fecha_referencia := COALESCE(v_encuesta.fecha_inicio, v_encuesta.fecha_creacion);

    -- Calcular horas transcurridas
    v_horas_transcurridas := EXTRACT(EPOCH FROM (NOW() - v_fecha_referencia)) / 3600;

    IF v_horas_transcurridas <= v_encuesta.bonus_horas_limite THEN
      v_puntos_bonus := v_encuesta.puntos_bonus_rapido;
      v_bonus_aplicado := true;
    END IF;
  END IF;

  v_puntos_total := v_puntos_base + v_puntos_bonus;

  -- =====================================================
  -- PASO 3: Registrar puntos otorgados en respuesta
  -- =====================================================
  UPDATE respuestas_encuesta
  SET puntos_otorgados = v_puntos_total,
      bonus_aplicado = v_bonus_aplicado
  WHERE encuesta_id = p_encuesta_id
    AND empleado_id = v_empleado_id
    AND puntos_otorgados IS NULL OR puntos_otorgados = 0;

  -- =====================================================
  -- PASO 4: Otorgar puntos al empleado
  -- =====================================================
  -- Verificar si ya se otorgaron puntos por esta encuesta
  IF NOT EXISTS (
    SELECT 1 FROM transacciones_puntos
    WHERE empleado_id = v_empleado_id
      AND referencia_id = p_encuesta_id
      AND referencia_tipo = 'encuesta'
  ) THEN
    -- Insertar transacción de puntos
    INSERT INTO transacciones_puntos (
      empleado_id,
      cantidad,
      tipo,
      motivo,
      referencia_id,
      referencia_tipo
    ) VALUES (
      v_empleado_id,
      v_puntos_total,
      'ganados',
      CASE
        WHEN v_bonus_aplicado THEN
          format('Encuesta completada: %s (+%s bonus rápido)', v_encuesta.titulo, v_puntos_bonus)
        ELSE
          format('Encuesta completada: %s', v_encuesta.titulo)
      END,
      p_encuesta_id,
      'encuesta'
    );

    -- El trigger de transacciones_puntos debería actualizar el saldo
    -- Pero por si no existe, actualizamos directamente
    UPDATE empleados
    SET puntos = COALESCE(puntos, 0) + v_puntos_total
    WHERE id = v_empleado_id;
  END IF;

  -- Obtener nuevo balance
  SELECT puntos INTO v_empleado_puntos
  FROM empleados
  WHERE id = v_empleado_id;

  -- =====================================================
  -- RETORNO EXITOSO
  -- =====================================================
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Respuestas enviadas correctamente',
    'data', jsonb_build_object(
      'encuesta_id', p_encuesta_id,
      'encuesta_titulo', v_encuesta.titulo,
      'respuestas_guardadas', v_respuestas_insertadas,
      'puntos_base', v_puntos_base,
      'puntos_bonus', v_puntos_bonus,
      'puntos_total', v_puntos_total,
      'bonus_aplicado', v_bonus_aplicado,
      'nuevo_balance', v_empleado_puntos
    )
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ya has respondido esta encuesta',
      'code', 'DUPLICATE_SUBMISSION',
      'is_duplicate', true
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', 'INTERNAL_ERROR'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos
GRANT EXECUTE ON FUNCTION fn_submit_encuesta(uuid, jsonb) TO authenticated;

-- Documentación
COMMENT ON FUNCTION fn_submit_encuesta IS
'RPC atómica para enviar respuestas de encuesta.
Maneja: validaciones, inserción, cálculo de puntos (base + bonus), y otorgamiento.
Retorna: success, puntos_total, bonus_aplicado, nuevo_balance.
Usa SECURITY DEFINER para bypasear RLS.';

-- =====================================================
-- FUNCIÓN HELPER: Obtener puntos de una encuesta
-- =====================================================
CREATE OR REPLACE FUNCTION fn_get_encuesta_puntos(p_encuesta_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_encuesta record;
BEGIN
  SELECT
    COALESCE(puntos_base, 50) as puntos_base,
    COALESCE(puntos_bonus_rapido, 0) as puntos_bonus_rapido,
    COALESCE(bonus_horas_limite, 24) as bonus_horas_limite,
    fecha_inicio,
    fecha_creacion
  INTO v_encuesta
  FROM encuestas
  WHERE id = p_encuesta_id;

  IF v_encuesta IS NULL THEN
    RETURN jsonb_build_object(
      'puntos_base', 50,
      'puntos_bonus', 0,
      'bonus_horas', 24,
      'tiene_bonus', false
    );
  END IF;

  RETURN jsonb_build_object(
    'puntos_base', v_encuesta.puntos_base,
    'puntos_bonus', v_encuesta.puntos_bonus_rapido,
    'bonus_horas', v_encuesta.bonus_horas_limite,
    'tiene_bonus', v_encuesta.puntos_bonus_rapido > 0,
    'puntos_maximos', v_encuesta.puntos_base + v_encuesta.puntos_bonus_rapido
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION fn_get_encuesta_puntos(uuid) TO authenticated;

COMMENT ON FUNCTION fn_get_encuesta_puntos IS
'Obtiene la configuración de puntos de una encuesta.
Usado por el frontend para mostrar puntos correctos.';
