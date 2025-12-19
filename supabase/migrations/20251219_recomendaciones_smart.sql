/*
  # Sistema de Recomendaciones SMART Automáticas

  Este sistema genera objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes, Temporales)
  basados en los resultados de las encuestas de bienestar, utilizando umbrales académicos IWBS.

  ## Tablas
  - recomendaciones_smart: Almacena las recomendaciones generadas con estructura SMART

  ## Funciones
  - fn_calcular_nivel_riesgo: Calcula nivel de riesgo basado en score
  - fn_obtener_acciones_por_dimension: Retorna acciones sugeridas por dimensión
  - fn_generar_recomendaciones_smart: Genera recomendaciones automáticamente
*/

-- ============================================
-- TABLA: recomendaciones_smart
-- ============================================
CREATE TABLE IF NOT EXISTS recomendaciones_smart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  encuesta_id uuid NOT NULL REFERENCES encuestas(id) ON DELETE CASCADE,

  -- Contexto de generación
  generada_automaticamente boolean DEFAULT true,
  fecha_generacion timestamptz DEFAULT now(),

  -- Datos del análisis que generó la recomendación
  indice_bienestar_global numeric(5,2) NOT NULL,
  dimension_afectada text NOT NULL,
  score_dimension numeric(5,2) NOT NULL,
  nivel_riesgo text NOT NULL CHECK (nivel_riesgo IN ('optimo', 'saludable', 'moderado', 'alto', 'critico')),

  -- Estructura SMART
  titulo text NOT NULL,
  descripcion text NOT NULL,
  objetivo_especifico text NOT NULL,        -- S: Específico
  metrica_exito text NOT NULL,               -- M: Medible
  es_alcanzable_justificacion text,          -- A: Alcanzable
  relevancia text,                           -- R: Relevante
  fecha_limite date,                         -- T: Temporal
  plazo_dias integer DEFAULT 30,

  -- Prioridad y estado
  prioridad integer DEFAULT 5 CHECK (prioridad BETWEEN 1 AND 10),  -- 1=urgente, 10=baja
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'completada', 'descartada')),

  -- Acciones sugeridas (array de acciones concretas)
  acciones_sugeridas jsonb DEFAULT '[]',
  /* Ejemplo:
  [
    {"orden": 1, "accion": "Programar talleres de mindfulness", "responsable": "rrhh", "urgencia": "alta"},
    {"orden": 2, "accion": "Encuesta de pulso semanal", "responsable": "admin", "urgencia": "media"}
  ]
  */

  -- Servicio SMART recomendado (vinculo con serviciosSmart.js)
  servicio_smart_id text,

  -- Seguimiento
  fecha_inicio_seguimiento date,
  fecha_completado timestamptz,
  notas_seguimiento text,
  resultado_final text,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_recomendaciones_empresa ON recomendaciones_smart(empresa_id);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_encuesta ON recomendaciones_smart(encuesta_id);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_estado ON recomendaciones_smart(estado, prioridad);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_dimension ON recomendaciones_smart(dimension_afectada);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE recomendaciones_smart ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver recomendaciones de su empresa
DROP POLICY IF EXISTS "Empresas ven sus recomendaciones" ON recomendaciones_smart;
CREATE POLICY "Empresas ven sus recomendaciones" ON recomendaciones_smart
  FOR SELECT TO authenticated USING (
    empresa_id IN (SELECT empresa_id FROM empleados WHERE auth_user_id = auth.uid())
  );

-- Política: Admins pueden gestionar recomendaciones de su empresa
DROP POLICY IF EXISTS "Admins gestionan recomendaciones" ON recomendaciones_smart;
CREATE POLICY "Admins gestionan recomendaciones" ON recomendaciones_smart
  FOR ALL TO authenticated USING (
    empresa_id IN (
      SELECT empresa_id FROM empleados
      WHERE auth_user_id = auth.uid() AND es_admin = true
    )
  ) WITH CHECK (
    empresa_id IN (
      SELECT empresa_id FROM empleados
      WHERE auth_user_id = auth.uid() AND es_admin = true
    )
  );

-- ============================================
-- FUNCIÓN: Calcular nivel de riesgo (umbrales IWBS)
-- ============================================
CREATE OR REPLACE FUNCTION fn_calcular_nivel_riesgo(p_score numeric)
RETURNS text AS $$
BEGIN
  RETURN CASE
    WHEN p_score < 53 THEN 'critico'
    WHEN p_score < 66 THEN 'alto'
    WHEN p_score < 75 THEN 'moderado'
    WHEN p_score < 88 THEN 'saludable'
    ELSE 'optimo'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN: Obtener prioridad por nivel de riesgo
-- ============================================
CREATE OR REPLACE FUNCTION fn_obtener_prioridad(p_nivel_riesgo text)
RETURNS integer AS $$
BEGIN
  RETURN CASE p_nivel_riesgo
    WHEN 'critico' THEN 1
    WHEN 'alto' THEN 3
    WHEN 'moderado' THEN 5
    WHEN 'saludable' THEN 7
    ELSE 9
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN: Obtener plazo por nivel de riesgo
-- ============================================
CREATE OR REPLACE FUNCTION fn_obtener_plazo_dias(p_nivel_riesgo text)
RETURNS integer AS $$
BEGIN
  RETURN CASE p_nivel_riesgo
    WHEN 'critico' THEN 15
    WHEN 'alto' THEN 30
    WHEN 'moderado' THEN 45
    ELSE 60
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN: Mapear dimensión a servicio SMART
-- ============================================
CREATE OR REPLACE FUNCTION fn_mapear_servicio_smart(p_dimension text)
RETURNS text AS $$
BEGIN
  RETURN CASE lower(p_dimension)
    WHEN 'salud_mental' THEN 'salud-mental'
    WHEN 'salud-mental' THEN 'salud-mental'
    WHEN 'clima_laboral' THEN 'clima-laboral'
    WHEN 'clima-laboral' THEN 'clima-laboral'
    WHEN 'carga_trabajo' THEN 'balance-vida'
    WHEN 'carga-laboral' THEN 'balance-vida'
    WHEN 'comunicacion' THEN 'comunicacion-interna'
    WHEN 'liderazgo' THEN 'liderazgo-efectivo'
    WHEN 'desarrollo' THEN 'desarrollo-profesional'
    WHEN 'desarrollo_profesional' THEN 'desarrollo-profesional'
    WHEN 'reconocimiento' THEN 'reconocimiento'
    WHEN 'bienestar_fisico' THEN 'recursos-condiciones'
    WHEN 'bienestar-fisico' THEN 'recursos-condiciones'
    WHEN 'proposito' THEN 'cultura-innovacion'
    ELSE 'clima-laboral'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN: Obtener acciones sugeridas por dimensión y nivel
-- ============================================
CREATE OR REPLACE FUNCTION fn_obtener_acciones_por_dimension(
  p_dimension text,
  p_nivel_riesgo text
)
RETURNS jsonb AS $$
DECLARE
  v_acciones jsonb;
BEGIN
  -- Determinar acciones basadas en dimensión y nivel de urgencia
  IF lower(p_dimension) IN ('salud_mental', 'salud-mental') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Programar talleres de mindfulness y gestión del estrés", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Ofrecer sesiones 1:1 de apoyo psicológico", "responsable": "bienestar", "urgencia": "alta"},
        {"orden": 3, "accion": "Implementar días de salud mental", "responsable": "direccion", "urgencia": "media"},
        {"orden": 4, "accion": "Revisar cargas de trabajo del equipo", "responsable": "lideres", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Encuestas de pulso más frecuentes", "responsable": "rrhh", "urgencia": "media"},
        {"orden": 2, "accion": "Pausas activas durante la jornada", "responsable": "bienestar", "urgencia": "baja"},
        {"orden": 3, "accion": "Recursos de gestión del estrés", "responsable": "comunicacion", "urgencia": "baja"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('comunicacion') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Implementar reuniones de equipo semanales", "responsable": "lideres", "urgencia": "alta"},
        {"orden": 2, "accion": "Crear canales de comunicación transparentes", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Capacitación en comunicación efectiva", "responsable": "rrhh", "urgencia": "media"},
        {"orden": 4, "accion": "Establecer protocolos de comunicación claros", "responsable": "operaciones", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Town halls mensuales", "responsable": "direccion", "urgencia": "media"},
        {"orden": 2, "accion": "Reforzar feedback bidireccional", "responsable": "lideres", "urgencia": "media"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('carga_trabajo', 'carga-laboral') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Revisar políticas de horarios y flexibilidad", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Implementar horarios flexibles o trabajo remoto", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Establecer límites claros de disponibilidad", "responsable": "lideres", "urgencia": "alta"},
        {"orden": 4, "accion": "Promover desconexión fuera del horario", "responsable": "comunicacion", "urgencia": "media"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Mantener políticas de flexibilidad", "responsable": "rrhh", "urgencia": "baja"},
        {"orden": 2, "accion": "Promover vacaciones y descanso", "responsable": "lideres", "urgencia": "media"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('clima_laboral', 'clima-laboral') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Diagnóstico de clima con focus groups", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Plan de mejora de ambiente laboral", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Actividades de team building", "responsable": "bienestar", "urgencia": "media"},
        {"orden": 4, "accion": "Reconocimiento público de logros", "responsable": "lideres", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Mantener actividades de integración", "responsable": "bienestar", "urgencia": "media"},
        {"orden": 2, "accion": "Celebrar éxitos del equipo", "responsable": "lideres", "urgencia": "baja"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('liderazgo') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Programa de desarrollo de liderazgo", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Coaching ejecutivo para líderes", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Feedback 360 para managers", "responsable": "rrhh", "urgencia": "media"},
        {"orden": 4, "accion": "Capacitación en liderazgo empático", "responsable": "desarrollo", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Sesiones de mentoring continuo", "responsable": "direccion", "urgencia": "media"},
        {"orden": 2, "accion": "Reforzar prácticas de liderazgo positivo", "responsable": "rrhh", "urgencia": "baja"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('reconocimiento') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Implementar programa de reconocimiento formal", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Sistema de bonos o incentivos", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Reconocimiento público en comunicados", "responsable": "comunicacion", "urgencia": "media"},
        {"orden": 4, "accion": "Programa de empleado del mes", "responsable": "bienestar", "urgencia": "media"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Mantener reconocimientos periódicos", "responsable": "lideres", "urgencia": "media"},
        {"orden": 2, "accion": "Celebrar aniversarios y logros", "responsable": "rrhh", "urgencia": "baja"}
      ]'::jsonb;
    END IF;

  ELSIF lower(p_dimension) IN ('desarrollo', 'desarrollo_profesional') THEN
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Crear planes de carrera individuales", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Programa de capacitación continua", "responsable": "desarrollo", "urgencia": "alta"},
        {"orden": 3, "accion": "Oportunidades de promoción interna", "responsable": "direccion", "urgencia": "media"},
        {"orden": 4, "accion": "Mentoring con líderes senior", "responsable": "lideres", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Cursos de actualización periódicos", "responsable": "desarrollo", "urgencia": "media"},
        {"orden": 2, "accion": "Participación en proyectos especiales", "responsable": "lideres", "urgencia": "baja"}
      ]'::jsonb;
    END IF;

  ELSE
    -- Acciones genéricas para otras dimensiones
    IF p_nivel_riesgo IN ('critico', 'alto') THEN
      v_acciones := '[
        {"orden": 1, "accion": "Diagnóstico detallado del área", "responsable": "rrhh", "urgencia": "alta"},
        {"orden": 2, "accion": "Plan de intervención inmediata", "responsable": "direccion", "urgencia": "alta"},
        {"orden": 3, "accion": "Asignar responsables y recursos", "responsable": "operaciones", "urgencia": "alta"},
        {"orden": 4, "accion": "Monitoreo semanal de progreso", "responsable": "rrhh", "urgencia": "alta"}
      ]'::jsonb;
    ELSE
      v_acciones := '[
        {"orden": 1, "accion": "Encuestas de seguimiento", "responsable": "rrhh", "urgencia": "media"},
        {"orden": 2, "accion": "Mejoras incrementales", "responsable": "lideres", "urgencia": "baja"}
      ]'::jsonb;
    END IF;
  END IF;

  RETURN v_acciones;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN: Obtener descripción del nivel de riesgo
-- ============================================
CREATE OR REPLACE FUNCTION fn_obtener_descripcion_nivel(p_nivel_riesgo text)
RETURNS text AS $$
BEGIN
  RETURN CASE p_nivel_riesgo
    WHEN 'critico' THEN 'Se requiere atención URGENTE e inmediata. Alto riesgo de rotación y bajo rendimiento.'
    WHEN 'alto' THEN 'Requiere acción prioritaria. Situación preocupante que puede empeorar.'
    WHEN 'moderado' THEN 'Oportunidad de mejora proactiva. Potencial de optimización identificado.'
    WHEN 'saludable' THEN 'Mantener monitoreo continuo. Situación estable con áreas de refuerzo.'
    ELSE 'Excelente. Mantener prácticas actuales y documentar buenas prácticas.'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- FUNCIÓN PRINCIPAL: Generar recomendaciones SMART
-- ============================================
CREATE OR REPLACE FUNCTION fn_generar_recomendaciones_smart(
  p_encuesta_id uuid,
  p_empresa_id uuid,
  p_resultados jsonb
  /* Estructura esperada de p_resultados:
  {
    "indice_global": 65.5,
    "categorias": [
      {
        "nombre": "Salud Mental",
        "dimension_id": "salud_mental",
        "valor": 48.5
      },
      ...
    ]
  }
  */
)
RETURNS jsonb AS $$
DECLARE
  v_categoria jsonb;
  v_nivel_riesgo text;
  v_prioridad integer;
  v_plazo_dias integer;
  v_titulo text;
  v_descripcion text;
  v_objetivo text;
  v_metrica text;
  v_acciones jsonb;
  v_servicio text;
  v_incremento_esperado numeric;
  v_objetivo_score numeric;
  v_recomendacion_id uuid;
  v_resultado jsonb := '[]'::jsonb;
  v_recomendaciones_count integer := 0;
BEGIN
  -- Verificar que no existan recomendaciones previas para esta encuesta
  IF EXISTS (SELECT 1 FROM recomendaciones_smart WHERE encuesta_id = p_encuesta_id LIMIT 1) THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Ya existen recomendaciones para esta encuesta',
      'recomendaciones_generadas', 0,
      'recomendaciones', '[]'::jsonb
    );
  END IF;

  -- Iterar sobre categorías con riesgo
  FOR v_categoria IN SELECT * FROM jsonb_array_elements(p_resultados->'categorias')
  LOOP
    -- Calcular nivel de riesgo
    v_nivel_riesgo := fn_calcular_nivel_riesgo((v_categoria->>'valor')::numeric);

    -- Solo procesar categorías con riesgo moderado o superior
    IF v_nivel_riesgo IN ('critico', 'alto', 'moderado') THEN

      -- Obtener parámetros basados en nivel de riesgo
      v_prioridad := fn_obtener_prioridad(v_nivel_riesgo);
      v_plazo_dias := fn_obtener_plazo_dias(v_nivel_riesgo);

      -- Calcular incremento esperado y objetivo
      v_incremento_esperado := CASE v_nivel_riesgo
        WHEN 'critico' THEN 15
        WHEN 'alto' THEN 12
        WHEN 'moderado' THEN 8
        ELSE 5
      END;
      v_objetivo_score := LEAST((v_categoria->>'valor')::numeric + v_incremento_esperado, 85);

      -- Generar textos SMART
      v_titulo := format('Plan de mejora: %s', v_categoria->>'nombre');
      v_descripcion := format('Score actual: %s%%. %s',
        round((v_categoria->>'valor')::numeric, 1),
        fn_obtener_descripcion_nivel(v_nivel_riesgo)
      );
      v_objetivo := format(
        'Incrementar el índice de %s del %s%% actual a %s%% en %s días',
        v_categoria->>'nombre',
        round((v_categoria->>'valor')::numeric, 0),
        round(v_objetivo_score, 0),
        v_plazo_dias
      );
      v_metrica := format(
        'Score >= %s%% en próxima encuesta de seguimiento',
        round(LEAST((v_categoria->>'valor')::numeric + 10, 80), 0)
      );

      -- Obtener acciones sugeridas
      v_acciones := fn_obtener_acciones_por_dimension(
        COALESCE(v_categoria->>'dimension_id', lower(replace(v_categoria->>'nombre', ' ', '_'))),
        v_nivel_riesgo
      );

      -- Mapear servicio SMART
      v_servicio := fn_mapear_servicio_smart(
        COALESCE(v_categoria->>'dimension_id', lower(replace(v_categoria->>'nombre', ' ', '_')))
      );

      -- Insertar recomendación
      INSERT INTO recomendaciones_smart (
        empresa_id,
        encuesta_id,
        indice_bienestar_global,
        dimension_afectada,
        score_dimension,
        nivel_riesgo,
        titulo,
        descripcion,
        objetivo_especifico,
        metrica_exito,
        es_alcanzable_justificacion,
        relevancia,
        plazo_dias,
        fecha_limite,
        prioridad,
        acciones_sugeridas,
        servicio_smart_id
      ) VALUES (
        p_empresa_id,
        p_encuesta_id,
        (p_resultados->>'indice_global')::numeric,
        COALESCE(v_categoria->>'dimension_id', lower(replace(v_categoria->>'nombre', ' ', '_'))),
        (v_categoria->>'valor')::numeric,
        v_nivel_riesgo,
        v_titulo,
        v_descripcion,
        v_objetivo,
        v_metrica,
        'Basado en mejoras incrementales de 10-15% observadas en programas de bienestar similares.',
        format('Impacta directamente en el índice de bienestar global (%s%%) y afecta la productividad del equipo.',
          round((p_resultados->>'indice_global')::numeric, 0)),
        v_plazo_dias,
        CURRENT_DATE + v_plazo_dias,
        v_prioridad,
        v_acciones,
        v_servicio
      )
      RETURNING id INTO v_recomendacion_id;

      -- Agregar al resultado
      v_resultado := v_resultado || jsonb_build_object(
        'id', v_recomendacion_id,
        'dimension', v_categoria->>'nombre',
        'nivel_riesgo', v_nivel_riesgo,
        'prioridad', v_prioridad
      );

      v_recomendaciones_count := v_recomendaciones_count + 1;

    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Se generaron %s recomendaciones SMART', v_recomendaciones_count),
    'recomendaciones_generadas', v_recomendaciones_count,
    'recomendaciones', v_resultado
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'recomendaciones_generadas', 0,
    'recomendaciones', '[]'::jsonb
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios de documentación
COMMENT ON TABLE recomendaciones_smart IS 'Almacena recomendaciones SMART generadas automáticamente basadas en resultados de encuestas de bienestar';
COMMENT ON FUNCTION fn_generar_recomendaciones_smart IS 'Genera recomendaciones SMART automáticamente basadas en los resultados de una encuesta y umbrales académicos IWBS';
COMMENT ON FUNCTION fn_calcular_nivel_riesgo IS 'Calcula el nivel de riesgo basado en umbrales académicos IWBS (11,702 empleados)';
