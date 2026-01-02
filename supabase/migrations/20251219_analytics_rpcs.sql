-- =====================================================
-- MIGRACIÓN: Sistema de Analítica con RPCs
-- =====================================================
-- Crea funciones RPC para obtener métricas reales de BD
-- Todas las funciones son SECURITY DEFINER para bypasear RLS
-- pero validan internamente que el usuario pertenezca a la empresa
-- =====================================================

-- =====================================================
-- 1. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para encuestas y respuestas
CREATE INDEX IF NOT EXISTS idx_encuestas_empresa_estado
  ON encuestas(empresa_id, estado);
CREATE INDEX IF NOT EXISTS idx_encuestas_empresa_created
  ON encuestas(empresa_id, created_at);

CREATE INDEX IF NOT EXISTS idx_respuestas_encuesta_created
  ON respuestas_encuesta(encuesta_id, created_at);
CREATE INDEX IF NOT EXISTS idx_respuestas_empleado_created
  ON respuestas_encuesta(empleado_id, created_at);

-- Índices para comunicados
CREATE INDEX IF NOT EXISTS idx_comunicados_empresa_estado
  ON comunicados(empresa_id, estado);
CREATE INDEX IF NOT EXISTS idx_comunicados_empresa_created
  ON comunicados(empresa_id, created_at);
CREATE INDEX IF NOT EXISTS idx_comunicados_lecturas_comunicado
  ON comunicados_lecturas(comunicado_id);

-- Índices para empleados
CREATE INDEX IF NOT EXISTS idx_empleados_empresa_estado
  ON empleados(empresa_id, estado);
CREATE INDEX IF NOT EXISTS idx_empleados_empresa_depto
  ON empleados(empresa_id, departamento_id);

-- =====================================================
-- 2. FUNCIÓN HELPER: Validar empresa del usuario
-- =====================================================

CREATE OR REPLACE FUNCTION fn_get_user_empresa_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
BEGIN
  SELECT empresa_id INTO v_empresa_id
  FROM empleados
  WHERE auth_user_id = auth.uid()
  LIMIT 1;

  RETURN v_empresa_id;
END;
$$;

-- =====================================================
-- 3. RPC: analytics_overview
-- =====================================================
-- Devuelve resumen general de métricas de la empresa
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_overview(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_department_ids uuid[] DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_date_from timestamptz;
  v_date_to timestamptz;
  v_result jsonb;

  -- Contadores
  v_employees_total int := 0;
  v_employees_active int := 0;
  v_surveys_total int := 0;
  v_surveys_active int := 0;
  v_surveys_closed int := 0;
  v_survey_responses int := 0;
  v_communications_sent int := 0;
  v_communications_read int := 0;
  v_communications_reach int := 0;

  -- Métricas calculadas
  v_participation_rate numeric := 0;
  v_read_rate numeric := 0;
  v_wellbeing_index numeric := 0;
  v_wellbeing_prev numeric := 0;
  v_wellbeing_variation numeric := 0;
BEGIN
  -- Obtener empresa del usuario autenticado
  v_empresa_id := fn_get_user_empresa_id();

  IF v_empresa_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no asociado a ninguna empresa';
  END IF;

  -- Establecer rango de fechas (default: últimos 90 días)
  v_date_from := COALESCE(p_date_from, NOW() - INTERVAL '90 days');
  v_date_to := COALESCE(p_date_to, NOW());

  -- ==========================================
  -- EMPLEADOS
  -- ==========================================

  -- Total empleados activos
  SELECT COUNT(*) INTO v_employees_total
  FROM empleados
  WHERE empresa_id = v_empresa_id
    AND LOWER(estado) = 'activo'
    AND (p_department_ids IS NULL OR departamento_id = ANY(p_department_ids));

  -- Empleados con actividad en el rango (respuestas encuestas O lecturas comunicados)
  SELECT COUNT(DISTINCT e.id) INTO v_employees_active
  FROM empleados e
  WHERE e.empresa_id = v_empresa_id
    AND LOWER(e.estado) = 'activo'
    AND (p_department_ids IS NULL OR e.departamento_id = ANY(p_department_ids))
    AND (
      EXISTS (
        SELECT 1 FROM respuestas_encuesta r
        JOIN encuestas enc ON r.encuesta_id = enc.id
        WHERE r.empleado_id = e.id
          AND enc.empresa_id = v_empresa_id
          AND r.created_at BETWEEN v_date_from AND v_date_to
      )
      OR EXISTS (
        SELECT 1 FROM comunicados_lecturas cl
        JOIN comunicados c ON cl.comunicado_id = c.id
        WHERE cl.empleado_id = e.id
          AND c.empresa_id = v_empresa_id
          AND cl.fecha_lectura BETWEEN v_date_from AND v_date_to
      )
    );

  -- Tasa de participación
  IF v_employees_total > 0 THEN
    v_participation_rate := ROUND((v_employees_active::numeric / v_employees_total) * 100, 1);
  END IF;

  -- ==========================================
  -- ENCUESTAS
  -- ==========================================

  -- Total encuestas
  SELECT COUNT(*) INTO v_surveys_total
  FROM encuestas
  WHERE empresa_id = v_empresa_id;

  -- Encuestas activas
  SELECT COUNT(*) INTO v_surveys_active
  FROM encuestas
  WHERE empresa_id = v_empresa_id
    AND LOWER(estado) = 'activa';

  -- Encuestas cerradas/completadas
  SELECT COUNT(*) INTO v_surveys_closed
  FROM encuestas
  WHERE empresa_id = v_empresa_id
    AND LOWER(estado) = 'cerrada';

  -- Total respuestas en el rango
  SELECT COUNT(*) INTO v_survey_responses
  FROM respuestas_encuesta r
  JOIN encuestas enc ON r.encuesta_id = enc.id
  WHERE enc.empresa_id = v_empresa_id
    AND r.created_at BETWEEN v_date_from AND v_date_to;

  -- ==========================================
  -- COMUNICADOS
  -- ==========================================

  -- Comunicados enviados en el rango
  SELECT COUNT(*), COALESCE(SUM(alcance_estimado), 0)
  INTO v_communications_sent, v_communications_reach
  FROM comunicados
  WHERE empresa_id = v_empresa_id
    AND LOWER(estado) IN ('enviado', 'publicado')
    AND created_at BETWEEN v_date_from AND v_date_to;

  -- Lecturas de comunicados en el rango
  SELECT COUNT(*) INTO v_communications_read
  FROM comunicados_lecturas cl
  JOIN comunicados c ON cl.comunicado_id = c.id
  WHERE c.empresa_id = v_empresa_id
    AND cl.fecha_lectura BETWEEN v_date_from AND v_date_to;

  -- Tasa de lectura
  IF v_communications_reach > 0 THEN
    v_read_rate := ROUND((v_communications_read::numeric / v_communications_reach) * 100, 1);
  END IF;

  -- ==========================================
  -- ÍNDICE DE BIENESTAR (de respuestas numéricas 1-5)
  -- ==========================================

  SELECT COALESCE(AVG(
    CASE
      WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int
      ELSE NULL
    END
  ), 0) INTO v_wellbeing_index
  FROM respuestas_encuesta r
  JOIN encuestas enc ON r.encuesta_id = enc.id
  WHERE enc.empresa_id = v_empresa_id
    AND r.created_at BETWEEN v_date_from AND v_date_to;

  -- Bienestar del período anterior (para calcular variación)
  SELECT COALESCE(AVG(
    CASE
      WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int
      ELSE NULL
    END
  ), 0) INTO v_wellbeing_prev
  FROM respuestas_encuesta r
  JOIN encuestas enc ON r.encuesta_id = enc.id
  WHERE enc.empresa_id = v_empresa_id
    AND r.created_at BETWEEN (v_date_from - (v_date_to - v_date_from)) AND v_date_from;

  -- Calcular variación
  IF v_wellbeing_prev > 0 THEN
    v_wellbeing_variation := ROUND(v_wellbeing_index - v_wellbeing_prev, 2);
  END IF;

  -- ==========================================
  -- CONSTRUIR RESULTADO
  -- ==========================================

  v_result := jsonb_build_object(
    'empresa_id', v_empresa_id,
    'date_range', jsonb_build_object(
      'from', v_date_from,
      'to', v_date_to
    ),
    'employees', jsonb_build_object(
      'total', v_employees_total,
      'active', v_employees_active,
      'participation_rate', v_participation_rate
    ),
    'surveys', jsonb_build_object(
      'total', v_surveys_total,
      'active', v_surveys_active,
      'closed', v_surveys_closed,
      'responses_in_period', v_survey_responses
    ),
    'communications', jsonb_build_object(
      'sent', v_communications_sent,
      'read', v_communications_read,
      'reach', v_communications_reach,
      'read_rate', v_read_rate
    ),
    'wellbeing', jsonb_build_object(
      'index', ROUND(v_wellbeing_index, 2),
      'previous_period', ROUND(v_wellbeing_prev, 2),
      'variation', v_wellbeing_variation
    ),
    'generated_at', NOW()
  );

  RETURN v_result;
END;
$$;

-- =====================================================
-- 4. RPC: analytics_departments_ranking
-- =====================================================
-- Ranking de departamentos por participación y bienestar
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_departments_ranking(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_limit int DEFAULT 10
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_date_from timestamptz;
  v_date_to timestamptz;
  v_result jsonb;
BEGIN
  v_empresa_id := fn_get_user_empresa_id();

  IF v_empresa_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no asociado a ninguna empresa';
  END IF;

  v_date_from := COALESCE(p_date_from, NOW() - INTERVAL '90 days');
  v_date_to := COALESCE(p_date_to, NOW());

  SELECT jsonb_agg(dept_data ORDER BY wellbeing_score DESC NULLS LAST)
  INTO v_result
  FROM (
    SELECT jsonb_build_object(
      'id', d.id,
      'nombre', d.nombre,
      'employees_total', COUNT(DISTINCT e.id),
      'employees_active', COUNT(DISTINCT CASE
        WHEN EXISTS (
          SELECT 1 FROM respuestas_encuesta r
          JOIN encuestas enc ON r.encuesta_id = enc.id
          WHERE r.empleado_id = e.id
            AND r.created_at BETWEEN v_date_from AND v_date_to
        ) THEN e.id
      END),
      'participation_rate', ROUND(
        COUNT(DISTINCT CASE
          WHEN EXISTS (
            SELECT 1 FROM respuestas_encuesta r
            JOIN encuestas enc ON r.encuesta_id = enc.id
            WHERE r.empleado_id = e.id
              AND r.created_at BETWEEN v_date_from AND v_date_to
          ) THEN e.id
        END)::numeric / NULLIF(COUNT(DISTINCT e.id), 0) * 100, 1
      ),
      'wellbeing_score', (
        SELECT ROUND(AVG(
          CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END
        ), 2)
        FROM respuestas_encuesta r
        JOIN encuestas enc ON r.encuesta_id = enc.id
        WHERE r.empleado_id IN (SELECT id FROM empleados WHERE departamento_id = d.id)
          AND enc.empresa_id = v_empresa_id
          AND r.created_at BETWEEN v_date_from AND v_date_to
      ),
      'trend', CASE
        WHEN (
          SELECT AVG(CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END)
          FROM respuestas_encuesta r
          JOIN encuestas enc ON r.encuesta_id = enc.id
          WHERE r.empleado_id IN (SELECT id FROM empleados WHERE departamento_id = d.id)
            AND enc.empresa_id = v_empresa_id
            AND r.created_at BETWEEN v_date_from AND v_date_to
        ) >= 4.0 THEN 'up'
        WHEN (
          SELECT AVG(CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END)
          FROM respuestas_encuesta r
          JOIN encuestas enc ON r.encuesta_id = enc.id
          WHERE r.empleado_id IN (SELECT id FROM empleados WHERE departamento_id = d.id)
            AND enc.empresa_id = v_empresa_id
            AND r.created_at BETWEEN v_date_from AND v_date_to
        ) < 3.0 THEN 'down'
        ELSE 'stable'
      END
    ) as dept_data,
    (
      SELECT AVG(CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END)
      FROM respuestas_encuesta r
      JOIN encuestas enc ON r.encuesta_id = enc.id
      WHERE r.empleado_id IN (SELECT id FROM empleados WHERE departamento_id = d.id)
        AND enc.empresa_id = v_empresa_id
        AND r.created_at BETWEEN v_date_from AND v_date_to
    ) as wellbeing_score
    FROM departamentos d
    LEFT JOIN empleados e ON e.departamento_id = d.id AND LOWER(e.estado) = 'activo'
    WHERE d.empresa_id = v_empresa_id
    GROUP BY d.id, d.nombre
    LIMIT p_limit
  ) sub;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- =====================================================
-- 5. RPC: analytics_wellbeing_timeseries
-- =====================================================
-- Evolución temporal del bienestar (por mes)
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_wellbeing_timeseries(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_granularity text DEFAULT 'month' -- 'week' o 'month'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_date_from timestamptz;
  v_date_to timestamptz;
  v_result jsonb;
BEGIN
  v_empresa_id := fn_get_user_empresa_id();

  IF v_empresa_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no asociado a ninguna empresa';
  END IF;

  v_date_from := COALESCE(p_date_from, NOW() - INTERVAL '6 months');
  v_date_to := COALESCE(p_date_to, NOW());

  IF p_granularity = 'week' THEN
    SELECT jsonb_agg(series_data ORDER BY period_start)
    INTO v_result
    FROM (
      SELECT jsonb_build_object(
        'period', TO_CHAR(DATE_TRUNC('week', r.created_at), 'DD Mon YYYY'),
        'period_start', DATE_TRUNC('week', r.created_at),
        'wellbeing_avg', ROUND(AVG(
          CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END
        ), 2),
        'responses_count', COUNT(*),
        'participants', COUNT(DISTINCT r.empleado_id)
      ) as series_data,
      DATE_TRUNC('week', r.created_at) as period_start
      FROM respuestas_encuesta r
      JOIN encuestas enc ON r.encuesta_id = enc.id
      WHERE enc.empresa_id = v_empresa_id
        AND r.created_at BETWEEN v_date_from AND v_date_to
      GROUP BY DATE_TRUNC('week', r.created_at)
    ) sub;
  ELSE
    SELECT jsonb_agg(series_data ORDER BY period_start)
    INTO v_result
    FROM (
      SELECT jsonb_build_object(
        'period', TO_CHAR(DATE_TRUNC('month', r.created_at), 'Mon YYYY'),
        'period_start', DATE_TRUNC('month', r.created_at),
        'wellbeing_avg', ROUND(AVG(
          CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END
        ), 2),
        'responses_count', COUNT(*),
        'participants', COUNT(DISTINCT r.empleado_id)
      ) as series_data,
      DATE_TRUNC('month', r.created_at) as period_start
      FROM respuestas_encuesta r
      JOIN encuestas enc ON r.encuesta_id = enc.id
      WHERE enc.empresa_id = v_empresa_id
        AND r.created_at BETWEEN v_date_from AND v_date_to
      GROUP BY DATE_TRUNC('month', r.created_at)
    ) sub;
  END IF;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- =====================================================
-- 6. RPC: analytics_categories
-- =====================================================
-- Métricas por categoría de bienestar
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_categories(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_date_from timestamptz;
  v_date_to timestamptz;
  v_result jsonb;
BEGIN
  v_empresa_id := fn_get_user_empresa_id();

  IF v_empresa_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no asociado a ninguna empresa';
  END IF;

  v_date_from := COALESCE(p_date_from, NOW() - INTERVAL '90 days');
  v_date_to := COALESCE(p_date_to, NOW());

  SELECT jsonb_agg(cat_data ORDER BY category)
  INTO v_result
  FROM (
    SELECT jsonb_build_object(
      'category', COALESCE(p.categoria, 'General'),
      'current_value', ROUND(AVG(
        CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END
      ), 2),
      'previous_value', (
        SELECT ROUND(AVG(
          CASE WHEN r2.respuesta ~ '^[1-5]$' THEN r2.respuesta::int ELSE NULL END
        ), 2)
        FROM respuestas_encuesta r2
        JOIN preguntas_encuesta p2 ON r2.pregunta_id = p2.id
        JOIN encuestas enc2 ON p2.encuesta_id = enc2.id
        WHERE enc2.empresa_id = v_empresa_id
          AND COALESCE(p2.categoria, 'General') = COALESCE(p.categoria, 'General')
          AND r2.created_at BETWEEN (v_date_from - (v_date_to - v_date_from)) AND v_date_from
      ),
      'variation', ROUND(
        AVG(CASE WHEN r.respuesta ~ '^[1-5]$' THEN r.respuesta::int ELSE NULL END) -
        COALESCE((
          SELECT AVG(CASE WHEN r2.respuesta ~ '^[1-5]$' THEN r2.respuesta::int ELSE NULL END)
          FROM respuestas_encuesta r2
          JOIN preguntas_encuesta p2 ON r2.pregunta_id = p2.id
          JOIN encuestas enc2 ON p2.encuesta_id = enc2.id
          WHERE enc2.empresa_id = v_empresa_id
            AND COALESCE(p2.categoria, 'General') = COALESCE(p.categoria, 'General')
            AND r2.created_at BETWEEN (v_date_from - (v_date_to - v_date_from)) AND v_date_from
        ), 0)
      , 2),
      'responses_count', COUNT(*)
    ) as cat_data,
    COALESCE(p.categoria, 'General') as category
    FROM respuestas_encuesta r
    JOIN preguntas_encuesta p ON r.pregunta_id = p.id
    JOIN encuestas enc ON p.encuesta_id = enc.id
    WHERE enc.empresa_id = v_empresa_id
      AND r.created_at BETWEEN v_date_from AND v_date_to
    GROUP BY COALESCE(p.categoria, 'General')
  ) sub;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- =====================================================
-- 7. RPC: analytics_debug (solo para verificación)
-- =====================================================
-- Devuelve counts directos para verificar consistencia
-- =====================================================

CREATE OR REPLACE FUNCTION analytics_debug()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_result jsonb;
BEGIN
  v_empresa_id := fn_get_user_empresa_id();

  IF v_empresa_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Usuario no asociado a ninguna empresa');
  END IF;

  SELECT jsonb_build_object(
    'empresa_id', v_empresa_id,
    'raw_counts', jsonb_build_object(
      'empleados_total', (SELECT COUNT(*) FROM empleados WHERE empresa_id = v_empresa_id),
      'empleados_activos', (SELECT COUNT(*) FROM empleados WHERE empresa_id = v_empresa_id AND LOWER(estado) = 'activo'),
      'departamentos', (SELECT COUNT(*) FROM departamentos WHERE empresa_id = v_empresa_id),
      'encuestas_total', (SELECT COUNT(*) FROM encuestas WHERE empresa_id = v_empresa_id),
      'encuestas_activas', (SELECT COUNT(*) FROM encuestas WHERE empresa_id = v_empresa_id AND LOWER(estado) = 'activa'),
      'encuestas_cerradas', (SELECT COUNT(*) FROM encuestas WHERE empresa_id = v_empresa_id AND LOWER(estado) = 'cerrada'),
      'respuestas_total', (
        SELECT COUNT(*) FROM respuestas_encuesta r
        JOIN encuestas e ON r.encuesta_id = e.id
        WHERE e.empresa_id = v_empresa_id
      ),
      'comunicados_total', (SELECT COUNT(*) FROM comunicados WHERE empresa_id = v_empresa_id),
      'comunicados_enviados', (SELECT COUNT(*) FROM comunicados WHERE empresa_id = v_empresa_id AND LOWER(estado) IN ('enviado', 'publicado')),
      'lecturas_total', (
        SELECT COUNT(*) FROM comunicados_lecturas cl
        JOIN comunicados c ON cl.comunicado_id = c.id
        WHERE c.empresa_id = v_empresa_id
      )
    ),
    'timestamp', NOW()
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- =====================================================
-- 8. PERMISOS
-- =====================================================

-- Solo usuarios autenticados pueden ejecutar estas RPCs
GRANT EXECUTE ON FUNCTION analytics_overview TO authenticated;
GRANT EXECUTE ON FUNCTION analytics_departments_ranking TO authenticated;
GRANT EXECUTE ON FUNCTION analytics_wellbeing_timeseries TO authenticated;
GRANT EXECUTE ON FUNCTION analytics_categories TO authenticated;
GRANT EXECUTE ON FUNCTION analytics_debug TO authenticated;
GRANT EXECUTE ON FUNCTION fn_get_user_empresa_id TO authenticated;

-- =====================================================
-- DOCUMENTACIÓN DE KPIs
-- =====================================================
/*
## Definiciones de KPIs

### employees_total
- Empleados con estado = 'Activo' en la empresa

### employees_active
- Empleados con al menos 1 acción en el período:
  - Respuesta a encuesta
  - Lectura de comunicado

### participation_rate
- (employees_active / employees_total) * 100

### surveys_active
- Encuestas con estado = 'activa'

### surveys_closed
- Encuestas con estado = 'cerrada'

### survey_responses
- Count de respuestas_encuesta en el período

### communications_sent
- Comunicados con estado IN ('enviado', 'publicado') en el período

### communications_read
- Count de comunicados_lecturas en el período

### read_rate
- (communications_read / alcance_estimado total) * 100

### wellbeing_index
- Promedio de respuestas numéricas (1-5) en el período

### wellbeing_variation
- wellbeing_index_actual - wellbeing_index_período_anterior
*/
