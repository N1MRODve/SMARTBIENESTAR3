/*
  # Corrección crítica RGPD: Respeto al anonimato en encuestas

  ## Cambios realizados

  1. **Modificación de fn_submit_encuesta**
    - Ahora consulta el `privacidad_nivel` de la encuesta ANTES de insertar respuestas
    - Para `anonimato_completo`: NO almacena empleado_id (usa NULL)
    - Para `anonimato_parcial`: NO almacena empleado_id, solo departamento
    - Para `identificado`: Funciona normalmente con empleado_id
    - Usa hash_ip para control de duplicados en encuestas anónimas

  2. **Compatibilidad con gamificación**
    - Los puntos se otorgan a través de transacciones_puntos que SÍ guardan empleado_id
    - Las respuestas anónimas NO almacenan empleado_id
    - Separación de concerns: anonimato de respuestas vs tracking de participación

  3. **Seguridad**
    - Garantiza que el empleado_id nunca se almacena en encuestas anónimas
    - Previene violaciones de la promesa de anonimato
    - Cumplimiento RGPD
*/

-- =====================================================
-- FUNCIÓN MODIFICADA: fn_submit_encuesta
-- Ahora respeta el nivel de privacidad de la encuesta
-- =====================================================
CREATE OR REPLACE FUNCTION fn_submit_encuesta(
  p_encuesta_id uuid,
  p_respuestas jsonb,
  p_hash_ip text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_empleado_id uuid;
  v_empleado_empresa_id uuid;
  v_empleado_departamento_id uuid;
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
  v_privacidad_nivel text;
  v_empleado_id_a_guardar uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No autenticado',
      'code', 'AUTH_REQUIRED'
    );
  END IF;

  SELECT id, empresa_id, departamento_id, puntos
  INTO v_empleado_id, v_empleado_empresa_id, v_empleado_departamento_id, v_empleado_puntos
  FROM empleados
  WHERE auth_user_id = v_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Empleado no encontrado',
      'code', 'EMPLOYEE_NOT_FOUND'
    );
  END IF;

  SELECT
    e.id,
    e.titulo,
    e.estado,
    e.empresa_id,
    e.fecha_inicio,
    e.fecha_fin,
    e.fecha_creacion,
    e.privacidad_nivel,
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

  IF v_encuesta.empresa_id != v_empleado_empresa_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'No tienes acceso a esta encuesta',
      'code', 'ACCESS_DENIED'
    );
  END IF;

  IF v_encuesta.estado != 'activa' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Esta encuesta no está activa',
      'code', 'SURVEY_NOT_ACTIVE'
    );
  END IF;

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

  v_privacidad_nivel := COALESCE(v_encuesta.privacidad_nivel, 'identificado');

  CASE v_privacidad_nivel
    WHEN 'anonimato_completo' THEN
      v_empleado_id_a_guardar := NULL;
    WHEN 'anonimato_parcial' THEN
      v_empleado_id_a_guardar := NULL;
    ELSE
      v_empleado_id_a_guardar := v_empleado_id;
  END CASE;

  IF v_privacidad_nivel IN ('anonimato_completo', 'anonimato_parcial') THEN
    IF p_hash_ip IS NOT NULL THEN
      SELECT EXISTS(
        SELECT 1 FROM respuestas_encuesta
        WHERE encuesta_id = p_encuesta_id
          AND hash_ip = p_hash_ip
      ) INTO v_ya_respondida;
    ELSE
      v_ya_respondida := false;
    END IF;
  ELSE
    SELECT EXISTS(
      SELECT 1 FROM respuestas_encuesta
      WHERE encuesta_id = p_encuesta_id
        AND empleado_id = v_empleado_id
    ) INTO v_ya_respondida;
  END IF;

  IF v_ya_respondida THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Ya has respondido esta encuesta',
      'code', 'ALREADY_SUBMITTED',
      'is_duplicate', true
    );
  END IF;

  FOR v_respuesta IN SELECT * FROM jsonb_to_recordset(p_respuestas) AS x(pregunta_id uuid, respuesta text)
  LOOP
    INSERT INTO respuestas_encuesta (
      encuesta_id,
      pregunta_id,
      empleado_id,
      departamento_id,
      hash_ip,
      respuesta,
      fecha_respuesta,
      submitted_at
    ) VALUES (
      p_encuesta_id,
      v_respuesta.pregunta_id,
      v_empleado_id_a_guardar,
      CASE
        WHEN v_privacidad_nivel = 'anonimato_parcial' THEN v_empleado_departamento_id
        ELSE NULL
      END,
      p_hash_ip,
      v_respuesta.respuesta,
      NOW(),
      NOW()
    );
    v_respuestas_insertadas := v_respuestas_insertadas + 1;
  END LOOP;

  v_puntos_base := v_encuesta.puntos_base;

  IF v_encuesta.puntos_bonus_rapido > 0 THEN
    v_fecha_referencia := COALESCE(v_encuesta.fecha_inicio, v_encuesta.fecha_creacion);
    v_horas_transcurridas := EXTRACT(EPOCH FROM (NOW() - v_fecha_referencia)) / 3600;

    IF v_horas_transcurridas <= v_encuesta.bonus_horas_limite THEN
      v_puntos_bonus := v_encuesta.puntos_bonus_rapido;
      v_bonus_aplicado := true;
    END IF;
  END IF;

  v_puntos_total := v_puntos_base + v_puntos_bonus;

  IF v_empleado_id_a_guardar IS NOT NULL THEN
    UPDATE respuestas_encuesta
    SET puntos_otorgados = v_puntos_total,
        bonus_aplicado = v_bonus_aplicado
    WHERE encuesta_id = p_encuesta_id
      AND empleado_id = v_empleado_id
      AND (puntos_otorgados IS NULL OR puntos_otorgados = 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM transacciones_puntos
    WHERE empleado_id = v_empleado_id
      AND referencia_id = p_encuesta_id
      AND referencia_tipo = 'encuesta'
  ) THEN
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

    UPDATE empleados
    SET puntos = COALESCE(puntos, 0) + v_puntos_total
    WHERE id = v_empleado_id;
  END IF;

  SELECT puntos INTO v_empleado_puntos
  FROM empleados
  WHERE id = v_empleado_id;

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
      'nuevo_balance', v_empleado_puntos,
      'privacidad_nivel', v_privacidad_nivel,
      'anonima', v_empleado_id_a_guardar IS NULL
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

GRANT EXECUTE ON FUNCTION fn_submit_encuesta(uuid, jsonb, text) TO authenticated;

COMMENT ON FUNCTION fn_submit_encuesta IS
'RPC atómica para enviar respuestas de encuesta con respeto a RGPD.';

CREATE OR REPLACE FUNCTION fn_submit_encuesta(
  p_encuesta_id uuid,
  p_respuestas jsonb
)
RETURNS jsonb AS $$
BEGIN
  RETURN fn_submit_encuesta(p_encuesta_id, p_respuestas, NULL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION fn_submit_encuesta(uuid, jsonb) TO authenticated;
