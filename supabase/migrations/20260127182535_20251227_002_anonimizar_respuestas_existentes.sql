/*
  # Anonimizar respuestas existentes según nivel de privacidad

  ## Cambios realizados

  1. **Agregar columnas necesarias**
    - submitted_at: timestamp de cuando se envió la respuesta
    - puntos_otorgados: puntos que se otorgaron por esta respuesta
    - bonus_aplicado: si se aplicó bonus rápido

  2. **Limpieza de datos existentes**
    - Identifica encuestas con privacidad_nivel = 'anonimato_completo' o 'anonimato_parcial'
    - Pone empleado_id = NULL en todas las respuestas de esas encuestas
    - Preserva departamento en encuestas con anonimato_parcial
    - Elimina departamento en encuestas con anonimato_completo

  3. **Auditoría**
    - Reporta cuántas respuestas fueron anonimizadas
    - Mantiene integridad referencial con otras tablas

  ## Seguridad y cumplimiento
    - Asegura que datos históricos también cumplan con RGPD
    - Elimina identificadores personales de respuestas anónimas existentes
    - Irreversible por diseño (protección de privacidad)
*/

-- =====================================================
-- PASO 1: Agregar columnas necesarias si no existen
-- =====================================================
DO $$
BEGIN
  -- Agregar submitted_at si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE respuestas_encuesta 
    ADD COLUMN submitted_at timestamptz DEFAULT NOW();
    
    -- Actualizar registros existentes con fecha_respuesta
    UPDATE respuestas_encuesta
    SET submitted_at = fecha_respuesta
    WHERE submitted_at IS NULL;
  END IF;

  -- Agregar puntos_otorgados si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'puntos_otorgados'
  ) THEN
    ALTER TABLE respuestas_encuesta 
    ADD COLUMN puntos_otorgados integer;
  END IF;

  -- Agregar bonus_aplicado si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'bonus_aplicado'
  ) THEN
    ALTER TABLE respuestas_encuesta 
    ADD COLUMN bonus_aplicado boolean DEFAULT false;
  END IF;

  RAISE NOTICE 'Columnas verificadas/agregadas correctamente';
END $$;

-- =====================================================
-- PASO 2: Anonimizar respuestas de encuestas anónimas
-- =====================================================
DO $$
DECLARE
  v_respuestas_anonimato_completo integer;
  v_respuestas_anonimato_parcial integer;
BEGIN
  -- Anonimizar completamente (sin empleado_id ni departamento)
  UPDATE respuestas_encuesta re
  SET 
    empleado_id = NULL,
    departamento = NULL
  FROM encuestas e
  WHERE re.encuesta_id = e.id
    AND e.privacidad_nivel = 'anonimato_completo'
    AND re.empleado_id IS NOT NULL;

  GET DIAGNOSTICS v_respuestas_anonimato_completo = ROW_COUNT;

  -- Anonimizar parcialmente (sin empleado_id, pero con departamento)
  UPDATE respuestas_encuesta re
  SET empleado_id = NULL
  FROM encuestas e
  WHERE re.encuesta_id = e.id
    AND e.privacidad_nivel = 'anonimato_parcial'
    AND re.empleado_id IS NOT NULL;

  GET DIAGNOSTICS v_respuestas_anonimato_parcial = ROW_COUNT;

  -- Reportar resultados
  RAISE NOTICE 'Anonimización completada:';
  RAISE NOTICE '  - Respuestas con anonimato completo: %', v_respuestas_anonimato_completo;
  RAISE NOTICE '  - Respuestas con anonimato parcial: %', v_respuestas_anonimato_parcial;
  RAISE NOTICE '  - Total anonimizado: %', v_respuestas_anonimato_completo + v_respuestas_anonimato_parcial;
END $$;

-- =====================================================
-- PASO 3: Verificar integridad después de anonimización
-- =====================================================
DO $$
DECLARE
  v_encuestas_anonimas integer;
  v_respuestas_con_empleado_id integer;
BEGIN
  -- Contar encuestas anónimas
  SELECT COUNT(*)
  INTO v_encuestas_anonimas
  FROM encuestas
  WHERE privacidad_nivel IN ('anonimato_completo', 'anonimato_parcial');

  -- Verificar que no haya respuestas con empleado_id en encuestas anónimas
  SELECT COUNT(*)
  INTO v_respuestas_con_empleado_id
  FROM respuestas_encuesta re
  INNER JOIN encuestas e ON re.encuesta_id = e.id
  WHERE e.privacidad_nivel IN ('anonimato_completo', 'anonimato_parcial')
    AND re.empleado_id IS NOT NULL;

  IF v_respuestas_con_empleado_id > 0 THEN
    RAISE WARNING 'ADVERTENCIA: Hay % respuestas con empleado_id en encuestas anónimas', v_respuestas_con_empleado_id;
  ELSE
    RAISE NOTICE 'Verificación exitosa: Todas las respuestas de encuestas anónimas están correctamente anonimizadas';
  END IF;

  RAISE NOTICE 'Estadísticas:';
  RAISE NOTICE '  - Encuestas anónimas: %', v_encuestas_anonimas;
  RAISE NOTICE '  - Respuestas con empleado_id en anónimas: %', v_respuestas_con_empleado_id;
END $$;

-- =====================================================
-- PASO 4: Agregar índice para hash_ip (performance)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_respuestas_hash_ip_encuesta 
ON respuestas_encuesta(hash_ip, encuesta_id)
WHERE hash_ip IS NOT NULL;

COMMENT ON INDEX idx_respuestas_hash_ip_encuesta IS
'Índice para verificación rápida de duplicados en encuestas anónimas usando hash_ip';
