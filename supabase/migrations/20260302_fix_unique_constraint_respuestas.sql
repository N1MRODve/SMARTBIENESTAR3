-- =====================================================
-- MIGRACIÓN: Corregir constraint UNIQUE en respuestas_encuesta
-- =====================================================
-- PROBLEMA: El constraint UNIQUE(empleado_id, encuesta_id) es incorrecto
--           porque la tabla almacena UNA FILA POR PREGUNTA (tiene pregunta_id).
--           Una encuesta de 10 preguntas inserta 10 filas con el mismo
--           (empleado_id, encuesta_id) pero diferente pregunta_id.
--
--           El constraint actual impide que se guarden múltiples respuestas
--           por encuesta, rompiendo encuestas con más de 1 pregunta.
--
-- SOLUCIÓN: Cambiar a UNIQUE(empleado_id, encuesta_id, pregunta_id)
--           Esto permite múltiples filas por encuesta (una por pregunta)
--           pero impide responder la misma pregunta dos veces.
-- =====================================================

-- Paso 1: Eliminar constraints incorrectos
DO $$
BEGIN
  -- Eliminar constraint de migración 20251219_fix_respuestas_empleado_id.sql
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'respuestas_encuesta_empleado_encuesta_unique'
  ) THEN
    ALTER TABLE respuestas_encuesta
    DROP CONSTRAINT respuestas_encuesta_empleado_encuesta_unique;
    RAISE NOTICE 'Constraint respuestas_encuesta_empleado_encuesta_unique eliminado';
  END IF;

  -- Eliminar constraint de migración 20251219_001_sistema_puntos_encuestas.sql
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_empleado_encuesta_respuesta'
  ) THEN
    ALTER TABLE respuestas_encuesta
    DROP CONSTRAINT unique_empleado_encuesta_respuesta;
    RAISE NOTICE 'Constraint unique_empleado_encuesta_respuesta eliminado';
  END IF;
END $$;

-- Paso 2: Limpiar duplicados reales (misma pregunta respondida dos veces)
-- Mantener la respuesta más reciente
DELETE FROM respuestas_encuesta r1
USING respuestas_encuesta r2
WHERE r1.empleado_id = r2.empleado_id
  AND r1.encuesta_id = r2.encuesta_id
  AND r1.pregunta_id = r2.pregunta_id
  AND r1.fecha_respuesta < r2.fecha_respuesta;

-- Paso 3: Crear constraint CORRECTO que incluye pregunta_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_empleado_encuesta_pregunta'
  ) THEN
    ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT unique_empleado_encuesta_pregunta
    UNIQUE (empleado_id, encuesta_id, pregunta_id);
    RAISE NOTICE 'Constraint unique_empleado_encuesta_pregunta creado correctamente';
  ELSE
    RAISE NOTICE 'Constraint unique_empleado_encuesta_pregunta ya existe';
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE WARNING 'Hay duplicados (empleado_id, encuesta_id, pregunta_id) que no se pudieron limpiar';
END $$;

-- Paso 4: Crear índice optimizado para las consultas de verificación de duplicados
-- La RPC fn_submit_encuesta y el servicio frontend consultan por (empleado_id, encuesta_id)
CREATE INDEX IF NOT EXISTS idx_respuestas_empleado_encuesta
ON respuestas_encuesta(empleado_id, encuesta_id);

-- Verificación
DO $$
DECLARE
  v_constraint_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_empleado_encuesta_pregunta'
  ) INTO v_constraint_exists;

  IF v_constraint_exists THEN
    RAISE NOTICE '=== MIGRACIÓN EXITOSA ===';
    RAISE NOTICE 'Constraint UNIQUE(empleado_id, encuesta_id, pregunta_id) activo';
  ELSE
    RAISE WARNING '=== MIGRACIÓN FALLIDA ===';
    RAISE WARNING 'El constraint no se pudo crear';
  END IF;
END $$;
