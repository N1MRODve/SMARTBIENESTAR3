-- =====================================================
-- SISTEMA DE PUNTOS UNIFICADO PARA ENCUESTAS
-- =====================================================
-- PROBLEMA: Los puntos estaban hardcodeados en el frontend
--           con valores inconsistentes (50 vs 100).
--
-- SOLUCIÓN: Fuente única de verdad en la tabla encuestas
--           con soporte para bonus por respuesta rápida.
-- =====================================================

-- =====================================================
-- PASO 1: Añadir columnas de puntos a la tabla encuestas
-- =====================================================
DO $$
BEGIN
  -- Puntos base (estándar = 50)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'encuestas' AND column_name = 'puntos_base'
  ) THEN
    ALTER TABLE encuestas ADD COLUMN puntos_base integer NOT NULL DEFAULT 50;
    RAISE NOTICE 'Columna puntos_base añadida';
  END IF;

  -- Puntos bonus por respuesta rápida (default = 0)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'encuestas' AND column_name = 'puntos_bonus_rapido'
  ) THEN
    ALTER TABLE encuestas ADD COLUMN puntos_bonus_rapido integer NOT NULL DEFAULT 0;
    RAISE NOTICE 'Columna puntos_bonus_rapido añadida';
  END IF;

  -- Horas límite para bonus rápido (default = 24)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'encuestas' AND column_name = 'bonus_horas_limite'
  ) THEN
    ALTER TABLE encuestas ADD COLUMN bonus_horas_limite integer NOT NULL DEFAULT 24;
    RAISE NOTICE 'Columna bonus_horas_limite añadida';
  END IF;

  -- Puntos máximos (opcional, para caps futuros)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'encuestas' AND column_name = 'puntos_max'
  ) THEN
    ALTER TABLE encuestas ADD COLUMN puntos_max integer DEFAULT NULL;
    RAISE NOTICE 'Columna puntos_max añadida';
  END IF;

  -- Versión del esquema de puntos (para migraciones futuras)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'encuestas' AND column_name = 'puntos_version'
  ) THEN
    ALTER TABLE encuestas ADD COLUMN puntos_version integer NOT NULL DEFAULT 1;
    RAISE NOTICE 'Columna puntos_version añadida';
  END IF;
END $$;

-- =====================================================
-- PASO 2: Añadir columna submitted_at a respuestas_encuesta
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'submitted_at'
  ) THEN
    -- Usar fecha_respuesta existente si está disponible
    ALTER TABLE respuestas_encuesta ADD COLUMN submitted_at timestamptz;
    -- Backfill con fecha_respuesta
    UPDATE respuestas_encuesta SET submitted_at = COALESCE(fecha_respuesta, created_at, NOW())
    WHERE submitted_at IS NULL;
    -- Hacer NOT NULL después del backfill
    ALTER TABLE respuestas_encuesta ALTER COLUMN submitted_at SET DEFAULT NOW();
    RAISE NOTICE 'Columna submitted_at añadida y backfilled';
  END IF;
END $$;

-- =====================================================
-- PASO 3: Añadir columnas para tracking de puntos en respuestas
-- =====================================================
DO $$
BEGIN
  -- Puntos otorgados (para auditoría)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'puntos_otorgados'
  ) THEN
    ALTER TABLE respuestas_encuesta ADD COLUMN puntos_otorgados integer DEFAULT 0;
    RAISE NOTICE 'Columna puntos_otorgados añadida';
  END IF;

  -- Flag de bonus aplicado
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'respuestas_encuesta' AND column_name = 'bonus_aplicado'
  ) THEN
    ALTER TABLE respuestas_encuesta ADD COLUMN bonus_aplicado boolean DEFAULT false;
    RAISE NOTICE 'Columna bonus_aplicado añadida';
  END IF;
END $$;

-- =====================================================
-- PASO 4: Backfill encuestas existentes con puntos estándar
-- =====================================================
UPDATE encuestas
SET puntos_base = 50,
    puntos_bonus_rapido = 0,
    bonus_horas_limite = 24
WHERE puntos_base IS NULL OR puntos_base = 0;

-- =====================================================
-- PASO 5: Crear constraint único para evitar doble respuesta
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_empleado_encuesta_respuesta'
  ) THEN
    -- Limpiar duplicados primero (mantener el más reciente)
    DELETE FROM respuestas_encuesta r1
    USING respuestas_encuesta r2
    WHERE r1.empleado_id = r2.empleado_id
      AND r1.encuesta_id = r2.encuesta_id
      AND r1.id < r2.id;

    -- Crear constraint único
    ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT unique_empleado_encuesta_respuesta
    UNIQUE (empleado_id, encuesta_id);
    RAISE NOTICE 'Constraint unique_empleado_encuesta_respuesta creado';
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE WARNING 'Hay duplicados que no se pudieron limpiar automáticamente';
END $$;

-- =====================================================
-- PASO 6: Crear índices para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_encuestas_puntos ON encuestas(puntos_base, puntos_bonus_rapido);
CREATE INDEX IF NOT EXISTS idx_respuestas_submitted ON respuestas_encuesta(submitted_at);

-- =====================================================
-- PASO 7: Comentarios de documentación
-- =====================================================
COMMENT ON COLUMN encuestas.puntos_base IS 'Puntos base otorgados por completar la encuesta (estándar: 50)';
COMMENT ON COLUMN encuestas.puntos_bonus_rapido IS 'Puntos extra por responder dentro del tiempo límite (default: 0)';
COMMENT ON COLUMN encuestas.bonus_horas_limite IS 'Horas desde creación/asignación para obtener bonus (default: 24)';
COMMENT ON COLUMN encuestas.puntos_max IS 'Límite máximo de puntos (opcional, NULL = sin límite)';
COMMENT ON COLUMN encuestas.puntos_version IS 'Versión del esquema de puntos para migraciones futuras';

COMMENT ON COLUMN respuestas_encuesta.puntos_otorgados IS 'Puntos realmente otorgados al empleado (para auditoría)';
COMMENT ON COLUMN respuestas_encuesta.bonus_aplicado IS 'Si se aplicó el bonus por respuesta rápida';
COMMENT ON COLUMN respuestas_encuesta.submitted_at IS 'Timestamp exacto de envío (para cálculo de bonus)';

-- =====================================================
-- PASO 8: Vista para diagnóstico de puntos
-- =====================================================
CREATE OR REPLACE VIEW v_encuestas_puntos AS
SELECT
  e.id,
  e.titulo,
  e.estado,
  e.puntos_base,
  e.puntos_bonus_rapido,
  e.bonus_horas_limite,
  e.puntos_base + e.puntos_bonus_rapido as puntos_maximos,
  e.fecha_creacion,
  e.fecha_inicio,
  e.fecha_fin,
  (SELECT COUNT(*) FROM respuestas_encuesta re WHERE re.encuesta_id = e.id) as total_respuestas,
  (SELECT SUM(puntos_otorgados) FROM respuestas_encuesta re WHERE re.encuesta_id = e.id) as puntos_totales_otorgados
FROM encuestas e
ORDER BY e.fecha_creacion DESC;

COMMENT ON VIEW v_encuestas_puntos IS 'Vista para monitorear puntos de encuestas y respuestas';

-- =====================================================
-- DIAGNÓSTICO: Mostrar estado actual
-- =====================================================
DO $$
DECLARE
  v_total_encuestas integer;
  v_encuestas_con_puntos integer;
BEGIN
  SELECT COUNT(*) INTO v_total_encuestas FROM encuestas;
  SELECT COUNT(*) INTO v_encuestas_con_puntos FROM encuestas WHERE puntos_base > 0;

  RAISE NOTICE '=== DIAGNÓSTICO SISTEMA DE PUNTOS ===';
  RAISE NOTICE 'Total encuestas: %', v_total_encuestas;
  RAISE NOTICE 'Encuestas con puntos configurados: %', v_encuestas_con_puntos;
END $$;
