/*
  # Función RPC para otorgar puntos al completar encuesta

  Esta función se ejecuta con SECURITY DEFINER para bypasear RLS
  y garantizar que los puntos se otorguen correctamente.

  Incluye validaciones:
  - Verifica que el empleado exista
  - Evita duplicados (no otorga puntos dos veces por la misma encuesta)
  - Registra la transacción y actualiza el balance
*/

-- Función para otorgar puntos por completar encuesta
CREATE OR REPLACE FUNCTION fn_otorgar_puntos_encuesta(
  p_encuesta_id uuid,
  p_puntos integer DEFAULT 50
)
RETURNS jsonb AS $$
DECLARE
  v_empleado_id uuid;
  v_empleado_puntos integer;
  v_encuesta_titulo text;
  v_transaccion_existente uuid;
  v_nueva_transaccion_id uuid;
BEGIN
  -- Obtener el empleado del usuario autenticado
  SELECT id, puntos INTO v_empleado_id, v_empleado_puntos
  FROM empleados
  WHERE auth_user_id = auth.uid();

  IF v_empleado_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Empleado no encontrado para el usuario autenticado'
    );
  END IF;

  -- Verificar si ya se otorgaron puntos por esta encuesta
  SELECT id INTO v_transaccion_existente
  FROM transacciones_puntos
  WHERE empleado_id = v_empleado_id
    AND referencia_id = p_encuesta_id
    AND referencia_tipo = 'encuesta'
  LIMIT 1;

  IF v_transaccion_existente IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Los puntos ya fueron otorgados previamente para esta encuesta',
      'puntos_otorgados', 0,
      'puntos_totales', v_empleado_puntos,
      'ya_otorgados', true
    );
  END IF;

  -- Obtener título de la encuesta
  SELECT titulo INTO v_encuesta_titulo
  FROM encuestas
  WHERE id = p_encuesta_id;

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
    p_puntos,
    'ganados',
    'Encuesta completada: ' || COALESCE(v_encuesta_titulo, 'Encuesta'),
    p_encuesta_id,
    'encuesta'
  )
  RETURNING id INTO v_nueva_transaccion_id;

  -- Obtener puntos actualizados (el trigger ya los actualizó)
  SELECT puntos INTO v_empleado_puntos
  FROM empleados
  WHERE id = v_empleado_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Se otorgaron %s puntos por completar la encuesta', p_puntos),
    'puntos_otorgados', p_puntos,
    'puntos_totales', v_empleado_puntos,
    'transaccion_id', v_nueva_transaccion_id
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario de documentación
COMMENT ON FUNCTION fn_otorgar_puntos_encuesta IS 'Otorga puntos al empleado autenticado por completar una encuesta. Usa SECURITY DEFINER para bypasear RLS.';
