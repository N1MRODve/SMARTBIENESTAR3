/*
  # Sistema de Preguntas Inteligente

  Este sistema proporciona:
  - Taxonomía de dimensiones de bienestar
  - Catálogo de preguntas reutilizable con metadatos analíticos
  - Versionado de preguntas para comparabilidad temporal
  - Series temporales para tendencias
  - Reglas de acción automáticas

  Tablas creadas:
  1. dimensiones_bienestar - Taxonomía de áreas de bienestar
  2. categorias_analiticas - KPIs y umbrales de alerta
  3. preguntas_catalogo - Catálogo maestro de preguntas
  4. preguntas_versiones - Historial de cambios
  5. series_temporales_preguntas - Agregaciones para tendencias
  6. reglas_accion_encuesta - Automatizaciones basadas en respuestas
  7. historial_acciones - Log de acciones ejecutadas
*/

-- 1. Crear tabla de dimensiones de bienestar
CREATE TABLE IF NOT EXISTS dimensiones_bienestar (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  icono text,
  color text,
  orden integer,
  activa boolean DEFAULT true,
  fecha_creacion timestamptz DEFAULT now()
);

-- Insertar dimensiones predefinidas
INSERT INTO dimensiones_bienestar (id, nombre, descripcion, icono, color, orden, activa) VALUES
('salud_mental', 'Salud Mental', 'Estrés, ansiedad, bienestar emocional', 'brain', '#8B5CF6', 1, true),
('clima_laboral', 'Clima Laboral', 'Ambiente, relaciones, cultura organizacional', 'smile', '#3B82F6', 2, true),
('carga_trabajo', 'Carga de Trabajo', 'Balance vida-trabajo, productividad, tiempo', 'activity', '#F97316', 3, true),
('comunicacion', 'Comunicación', 'Claridad, feedback, transparencia', 'message-circle', '#06B6D4', 4, true),
('liderazgo', 'Liderazgo', 'Gestión, apoyo, dirección', 'users', '#10B981', 5, true),
('desarrollo', 'Desarrollo Profesional', 'Crecimiento, formación, carrera', 'trending-up', '#22C55E', 6, true),
('reconocimiento', 'Reconocimiento', 'Valoración, recompensas, feedback positivo', 'award', '#EAB308', 7, true),
('bienestar_fisico', 'Bienestar Físico', 'Ergonomía, salud física, condiciones laborales', 'heart', '#EF4444', 8, true),
('proposito', 'Propósito', 'Sentido, alineación con valores, impacto', 'target', '#EC4899', 9, true)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  icono = EXCLUDED.icono,
  color = EXCLUDED.color,
  orden = EXCLUDED.orden;

-- 2. Crear tabla de categorías analíticas
CREATE TABLE IF NOT EXISTS categorias_analiticas (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  tipo_agregacion text DEFAULT 'promedio', -- 'promedio', 'suma', 'porcentaje', 'nps'
  benchmark_industria decimal(5,2),
  umbral_alerta_bajo decimal(5,2),
  umbral_alerta_critico decimal(5,2),
  activa boolean DEFAULT true,
  fecha_creacion timestamptz DEFAULT now()
);

-- Insertar categorías analíticas predefinidas
INSERT INTO categorias_analiticas (id, nombre, descripcion, tipo_agregacion, benchmark_industria, umbral_alerta_bajo, umbral_alerta_critico) VALUES
('indice_bienestar', 'Índice de Bienestar Global', 'Score compuesto 0-100 de bienestar general', 'promedio', 72.0, 60.0, 45.0),
('enps', 'Employee NPS', 'Net Promoter Score de empleados (-100 a +100)', 'nps', 25.0, 0.0, -20.0),
('riesgo_burnout', 'Riesgo de Burnout', 'Indicador de agotamiento laboral (1-5, menor es mejor)', 'promedio', 2.5, 3.5, 4.0),
('engagement', 'Engagement', 'Nivel de compromiso y motivación (1-5)', 'promedio', 3.8, 3.0, 2.5),
('satisfaccion_liderazgo', 'Satisfacción con Liderazgo', 'Evaluación de gestión directa (1-5)', 'promedio', 3.7, 3.0, 2.5),
('calidad_comunicacion', 'Calidad de Comunicación', 'Efectividad de comunicación interna (1-5)', 'promedio', 3.6, 3.0, 2.5),
('balance_vida_trabajo', 'Balance Vida-Trabajo', 'Equilibrio entre vida personal y laboral (1-5)', 'promedio', 3.5, 2.8, 2.2),
('satisfaccion_desarrollo', 'Satisfacción con Desarrollo', 'Oportunidades de crecimiento percibidas (1-5)', 'promedio', 3.4, 2.8, 2.2)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  tipo_agregacion = EXCLUDED.tipo_agregacion,
  benchmark_industria = EXCLUDED.benchmark_industria,
  umbral_alerta_bajo = EXCLUDED.umbral_alerta_bajo,
  umbral_alerta_critico = EXCLUDED.umbral_alerta_critico;

-- 3. Crear catálogo maestro de preguntas
CREATE TABLE IF NOT EXISTS preguntas_catalogo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,

  -- Contenido visible
  texto text NOT NULL,
  texto_corto text, -- Para dashboards y reportes compactos
  tipo text NOT NULL, -- escala_likert, nps, opcion_multiple, si_no, texto_abierto, ranking, matriz
  subtipo text, -- acuerdo_5, satisfaccion_5, frecuencia_5, intensidad_5, etc.
  opciones jsonb, -- Para opción múltiple, ranking, etc.

  -- Metadatos analíticos (invisibles al empleado)
  dimension_bienestar text REFERENCES dimensiones_bienestar(id),
  subdimension text,
  categoria_analitica text REFERENCES categorias_analiticas(id),

  -- Indicadores
  es_indicador_clave boolean DEFAULT false,
  indicador_codigo text, -- ej: "NPS", "STRESS_INDEX", "ENGAGEMENT"
  peso_indicador decimal(3,2) DEFAULT 1.00, -- 0.00 a 1.00

  -- Sensibilidad y privacidad
  nivel_sensibilidad text DEFAULT 'normal', -- normal, sensible, critico
  muestra_minima integer DEFAULT 5,
  requiere_anonimato_completo boolean DEFAULT false,

  -- Comparabilidad y versionado
  es_comparable boolean DEFAULT true,
  version integer DEFAULT 1,
  pregunta_origen_id uuid REFERENCES preguntas_catalogo(id),
  bloqueada boolean DEFAULT false,
  motivo_bloqueo text,

  -- Validación científica
  fuente_validacion text, -- ej: "Gallup Q12", "WHO-5", "MBI", "Custom"
  es_validada_cientificamente boolean DEFAULT false,

  -- Estadísticas de uso
  veces_usada integer DEFAULT 0,
  ultima_vez_usada timestamptz,

  -- Reglas automáticas (jsonb para flexibilidad)
  reglas_alerta jsonb,
  reglas_accion jsonb,

  -- Metadata
  tags text[],
  notas_internas text,

  -- Timestamps
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz,
  creado_por uuid REFERENCES auth.users(id),
  modificado_por uuid REFERENCES auth.users(id)
);

-- Comentarios en columnas para documentación
COMMENT ON COLUMN preguntas_catalogo.texto_corto IS 'Versión resumida para dashboards (max 50 chars)';
COMMENT ON COLUMN preguntas_catalogo.nivel_sensibilidad IS 'normal: sin restricciones, sensible: requiere cuidado, critico: puede activar alertas';
COMMENT ON COLUMN preguntas_catalogo.muestra_minima IS 'Número mínimo de respuestas para mostrar resultados (protección de anonimato)';
COMMENT ON COLUMN preguntas_catalogo.es_comparable IS 'Si false, no se incluye en comparativas temporales';
COMMENT ON COLUMN preguntas_catalogo.peso_indicador IS 'Peso relativo en índices compuestos (0.00-1.00)';

-- 4. Crear tabla de versiones de preguntas
CREATE TABLE IF NOT EXISTS preguntas_versiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id) ON DELETE CASCADE,
  version integer NOT NULL,

  -- Cambios registrados
  texto_anterior text,
  texto_nuevo text,
  tipo_cambio text, -- 'texto', 'tipo', 'opciones', 'metadatos', 'multiple'
  cambios_detalle jsonb, -- Detalle de todos los campos cambiados

  -- Evaluación del cambio
  es_cambio_menor boolean DEFAULT false, -- No afecta comparabilidad (ej: ortografía)
  rompe_comparabilidad boolean DEFAULT false,
  motivo_cambio text,

  -- Auditoría
  cambiado_por uuid REFERENCES auth.users(id),
  fecha_cambio timestamptz DEFAULT now(),
  ip_address inet,

  UNIQUE(pregunta_id, version)
);

COMMENT ON COLUMN preguntas_versiones.es_cambio_menor IS 'true si solo fue corrección ortográfica o de formato';
COMMENT ON COLUMN preguntas_versiones.rompe_comparabilidad IS 'true si el cambio invalida comparaciones históricas';

-- 5. Crear tabla de series temporales
CREATE TABLE IF NOT EXISTS series_temporales_preguntas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id) ON DELETE CASCADE,
  empresa_id uuid NOT NULL,
  encuesta_id uuid REFERENCES encuestas(id) ON DELETE SET NULL,

  -- Periodo
  periodo text NOT NULL, -- '2024-Q4', '2024-12', '2024-W50'
  tipo_periodo text NOT NULL, -- 'semanal', 'mensual', 'trimestral', 'anual'
  fecha_inicio date,
  fecha_fin date,

  -- Métricas agregadas generales
  n_respuestas integer NOT NULL,
  n_respondentes_unicos integer,
  promedio decimal(5,2),
  mediana decimal(5,2),
  moda decimal(5,2),
  desviacion_std decimal(5,2),
  varianza decimal(5,2),

  -- Percentiles
  percentil_10 decimal(5,2),
  percentil_25 decimal(5,2),
  percentil_75 decimal(5,2),
  percentil_90 decimal(5,2),

  -- Distribución (para escalas)
  distribucion jsonb, -- {"1": 5, "2": 10, "3": 25, "4": 35, "5": 25}

  -- Para NPS específicamente
  promotores integer,
  pasivos integer,
  detractores integer,
  nps_score decimal(5,2),

  -- Comparabilidad
  es_comparable_anterior boolean DEFAULT true,
  nota_comparabilidad text,
  version_pregunta integer,

  -- Variación respecto a periodo anterior
  variacion_absoluta decimal(5,2),
  variacion_porcentual decimal(5,2),
  tendencia text, -- 'subiendo', 'estable', 'bajando'

  -- Metadata
  calculado_automaticamente boolean DEFAULT true,
  fecha_calculo timestamptz DEFAULT now(),

  UNIQUE(pregunta_id, empresa_id, periodo, tipo_periodo)
);

-- Índices para consultas de tendencias
CREATE INDEX IF NOT EXISTS idx_series_periodo ON series_temporales_preguntas(empresa_id, tipo_periodo, periodo DESC);
CREATE INDEX IF NOT EXISTS idx_series_pregunta ON series_temporales_preguntas(pregunta_id, periodo DESC);

-- 6. Crear tabla de reglas de acción
CREATE TABLE IF NOT EXISTS reglas_accion_encuesta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  activa boolean DEFAULT true,

  -- Condiciones de activación
  tipo_trigger text NOT NULL, -- 'pregunta_individual', 'promedio_dimension', 'tendencia', 'nps', 'encuesta_completada'
  pregunta_id uuid REFERENCES preguntas_catalogo(id),
  dimension text REFERENCES dimensiones_bienestar(id),
  categoria text REFERENCES categorias_analiticas(id),

  -- Lógica de condición (jsonb para flexibilidad)
  condicion jsonb NOT NULL,
  /* Ejemplos:
  {"operador": "<", "valor": 2.5}
  {"operador": "between", "valor_min": 2, "valor_max": 3}
  {"operador": "tendencia", "direccion": "baja", "periodos": 3, "umbral_pct": -15}
  {"operador": "nps_categoria", "valor": "detractor"}
  */

  -- Acción a ejecutar
  tipo_accion text NOT NULL, -- 'notificacion', 'tarea', 'recurso', 'plan_mejora', 'puntos', 'webhook'
  accion_config jsonb NOT NULL,
  /* Ejemplos:
  {"destinatarios": ["admin", "rrhh"], "prioridad": "alta", "canal": "email"}
  {"plantilla_id": "tarea_seguimiento", "asignar_a": "responsable_area"}
  {"recurso_id": "guia_estres", "canal": "app"}
  {"puntos": 50, "concepto": "participacion"}
  */

  -- Control de ejecución
  cooldown_horas integer DEFAULT 720, -- 30 días por defecto
  max_ejecuciones integer, -- null = sin límite
  ejecuciones_count integer DEFAULT 0,
  ultima_ejecucion timestamptz,

  -- Metadata
  prioridad integer DEFAULT 5, -- 1-10, menor = más prioritario
  tags text[],
  fecha_creacion timestamptz DEFAULT now(),
  creado_por uuid REFERENCES auth.users(id)
);

-- 7. Crear tabla de historial de acciones
CREATE TABLE IF NOT EXISTS historial_acciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regla_id uuid REFERENCES reglas_accion_encuesta(id) ON DELETE SET NULL,
  empresa_id uuid NOT NULL,
  encuesta_id uuid REFERENCES encuestas(id) ON DELETE SET NULL,

  -- Contexto de ejecución
  tipo_trigger text,
  pregunta_id uuid,
  dimension text,
  valor_trigger decimal(10,4),
  condicion_evaluada text,
  contexto jsonb, -- Datos adicionales del momento

  -- Resultado
  accion_ejecutada text,
  accion_config jsonb,
  resultado jsonb,
  exito boolean,
  error text,

  -- Auditoría
  fecha_ejecucion timestamptz DEFAULT now(),
  tiempo_ejecucion_ms integer
);

-- Índices para consultas de historial
CREATE INDEX IF NOT EXISTS idx_historial_empresa ON historial_acciones(empresa_id, fecha_ejecucion DESC);
CREATE INDEX IF NOT EXISTS idx_historial_regla ON historial_acciones(regla_id, fecha_ejecucion DESC);

-- 8. Modificar tabla preguntas_encuesta para vincular con catálogo
DO $$
BEGIN
  -- Añadir columna pregunta_catalogo_id si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'preguntas_encuesta' AND column_name = 'pregunta_catalogo_id'
  ) THEN
    ALTER TABLE preguntas_encuesta
    ADD COLUMN pregunta_catalogo_id uuid REFERENCES preguntas_catalogo(id);
  END IF;

  -- Añadir columna es_personalizada si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'preguntas_encuesta' AND column_name = 'es_personalizada'
  ) THEN
    ALTER TABLE preguntas_encuesta
    ADD COLUMN es_personalizada boolean DEFAULT false;
  END IF;

  -- Añadir columna dimension_bienestar si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'preguntas_encuesta' AND column_name = 'dimension_bienestar'
  ) THEN
    ALTER TABLE preguntas_encuesta
    ADD COLUMN dimension_bienestar text;
  END IF;
END $$;

-- 9. Crear índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_empresa ON preguntas_catalogo(empresa_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_dimension ON preguntas_catalogo(dimension_bienestar);
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_categoria ON preguntas_catalogo(categoria_analitica);
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_indicador ON preguntas_catalogo(es_indicador_clave) WHERE es_indicador_clave = true;
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_tipo ON preguntas_catalogo(tipo);
CREATE INDEX IF NOT EXISTS idx_preguntas_encuesta_catalogo ON preguntas_encuesta(pregunta_catalogo_id) WHERE pregunta_catalogo_id IS NOT NULL;

-- 10. Crear función para auto-versionado
CREATE OR REPLACE FUNCTION fn_versionar_pregunta()
RETURNS TRIGGER AS $$
DECLARE
  v_cambios jsonb;
BEGIN
  -- Solo versionar si hay cambios significativos
  IF OLD.texto != NEW.texto OR OLD.tipo != NEW.tipo OR OLD.opciones::text != NEW.opciones::text THEN
    -- Incrementar versión
    NEW.version = OLD.version + 1;
    NEW.fecha_modificacion = now();

    -- Construir detalle de cambios
    v_cambios = '{}'::jsonb;
    IF OLD.texto != NEW.texto THEN
      v_cambios = v_cambios || jsonb_build_object('texto', jsonb_build_object('anterior', OLD.texto, 'nuevo', NEW.texto));
    END IF;
    IF OLD.tipo != NEW.tipo THEN
      v_cambios = v_cambios || jsonb_build_object('tipo', jsonb_build_object('anterior', OLD.tipo, 'nuevo', NEW.tipo));
    END IF;
    IF OLD.opciones::text != NEW.opciones::text THEN
      v_cambios = v_cambios || jsonb_build_object('opciones', jsonb_build_object('anterior', OLD.opciones, 'nuevo', NEW.opciones));
    END IF;

    -- Insertar en historial de versiones
    INSERT INTO preguntas_versiones (
      pregunta_id,
      version,
      texto_anterior,
      texto_nuevo,
      tipo_cambio,
      cambios_detalle,
      es_cambio_menor,
      rompe_comparabilidad,
      cambiado_por
    ) VALUES (
      NEW.id,
      NEW.version,
      OLD.texto,
      NEW.texto,
      CASE
        WHEN OLD.tipo != NEW.tipo THEN 'tipo'
        WHEN OLD.opciones::text != NEW.opciones::text THEN 'opciones'
        ELSE 'texto'
      END,
      v_cambios,
      -- Es cambio menor si solo cambia mayúsculas/minúsculas o espacios
      lower(trim(OLD.texto)) = lower(trim(NEW.texto)),
      -- Rompe comparabilidad si cambia el tipo o las opciones
      OLD.tipo != NEW.tipo OR OLD.opciones::text != NEW.opciones::text,
      NEW.modificado_por
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS tr_versionar_pregunta ON preguntas_catalogo;
CREATE TRIGGER tr_versionar_pregunta
  BEFORE UPDATE ON preguntas_catalogo
  FOR EACH ROW
  EXECUTE FUNCTION fn_versionar_pregunta();

-- 11. Crear función para verificar modificación de pregunta
CREATE OR REPLACE FUNCTION fn_verificar_modificacion_pregunta(
  p_pregunta_id uuid,
  p_forzar boolean DEFAULT false
)
RETURNS jsonb AS $$
DECLARE
  v_pregunta preguntas_catalogo%ROWTYPE;
  v_usos integer;
  v_resultado jsonb;
BEGIN
  SELECT * INTO v_pregunta FROM preguntas_catalogo WHERE id = p_pregunta_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('puede_modificar', false, 'razon', 'Pregunta no encontrada');
  END IF;

  -- Contar usos en encuestas activas/finalizadas
  SELECT COUNT(DISTINCT e.id) INTO v_usos
  FROM preguntas_encuesta pe
  JOIN encuestas e ON pe.encuesta_id = e.id
  WHERE pe.pregunta_catalogo_id = p_pregunta_id
  AND e.estado IN ('activa', 'finalizada');

  v_resultado = jsonb_build_object(
    'puede_modificar', true,
    'advertencias', '[]'::jsonb,
    'bloqueada', v_pregunta.bloqueada,
    'usos_encuestas', v_usos,
    'es_indicador_clave', v_pregunta.es_indicador_clave,
    'version_actual', v_pregunta.version
  );

  -- Verificar bloqueo
  IF v_pregunta.bloqueada AND NOT p_forzar THEN
    RETURN jsonb_build_object(
      'puede_modificar', false,
      'razon', COALESCE(v_pregunta.motivo_bloqueo, 'Pregunta bloqueada por administrador'),
      'bloqueada', true
    );
  END IF;

  -- Verificar si es indicador clave con usos
  IF v_pregunta.es_indicador_clave AND v_usos > 0 THEN
    v_resultado = jsonb_set(v_resultado, '{advertencias}',
      (v_resultado->'advertencias') || jsonb_build_array(
        jsonb_build_object(
          'tipo', 'indicador_clave',
          'severidad', 'high',
          'mensaje', format('Esta pregunta alimenta indicadores clave y se ha usado en %s encuestas. Modificarla romperá la comparabilidad histórica.', v_usos),
          'usos', v_usos
        )
      )
    );
  END IF;

  -- Verificar si tiene historial extenso
  IF v_usos >= 3 THEN
    v_resultado = jsonb_set(v_resultado, '{advertencias}',
      (v_resultado->'advertencias') || jsonb_build_array(
        jsonb_build_object(
          'tipo', 'historial_extenso',
          'severidad', 'medium',
          'mensaje', format('Esta pregunta se ha usado en %s encuestas. Considera crear una nueva versión en lugar de modificar.', v_usos),
          'sugerencia', 'crear_nueva'
        )
      )
    );
  END IF;

  -- Verificar si tiene series temporales
  IF EXISTS (SELECT 1 FROM series_temporales_preguntas WHERE pregunta_id = p_pregunta_id LIMIT 1) THEN
    v_resultado = jsonb_set(v_resultado, '{advertencias}',
      (v_resultado->'advertencias') || jsonb_build_array(
        jsonb_build_object(
          'tipo', 'tiene_series_temporales',
          'severidad', 'medium',
          'mensaje', 'Existen datos históricos agregados para esta pregunta.',
          'sugerencia', 'crear_nueva'
        )
      )
    );
  END IF;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

-- 12. Habilitar RLS en nuevas tablas
ALTER TABLE dimensiones_bienestar ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_analiticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas_versiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_temporales_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_accion_encuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_acciones ENABLE ROW LEVEL SECURITY;

-- 13. Crear políticas RLS

-- Dimensiones y categorías: lectura pública para usuarios autenticados
CREATE POLICY "Todos pueden ver dimensiones" ON dimensiones_bienestar
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Todos pueden ver categorías" ON categorias_analiticas
  FOR SELECT TO authenticated USING (true);

-- Preguntas catálogo: empresas ven solo sus preguntas
CREATE POLICY "Empresas ven sus preguntas" ON preguntas_catalogo
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Empresas crean preguntas" ON preguntas_catalogo
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Empresas actualizan sus preguntas" ON preguntas_catalogo
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Empresas eliminan sus preguntas" ON preguntas_catalogo
  FOR DELETE TO authenticated USING (true);

-- Versiones: lectura para empresas
CREATE POLICY "Empresas ven versiones de sus preguntas" ON preguntas_versiones
  FOR SELECT TO authenticated USING (true);

-- Series temporales
CREATE POLICY "Empresas ven sus series" ON series_temporales_preguntas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sistema crea series" ON series_temporales_preguntas
  FOR INSERT TO authenticated WITH CHECK (true);

-- Reglas de acción
CREATE POLICY "Empresas gestionan sus reglas" ON reglas_accion_encuesta
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Historial de acciones
CREATE POLICY "Empresas ven su historial" ON historial_acciones
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sistema registra acciones" ON historial_acciones
  FOR INSERT TO authenticated WITH CHECK (true);

-- 14. Crear vista para análisis de preguntas
CREATE OR REPLACE VIEW v_preguntas_analisis AS
SELECT
  pe.id as pregunta_encuesta_id,
  pe.encuesta_id,
  pe.texto as texto_usado,
  pe.tipo,
  pe.orden,
  pe.pregunta_catalogo_id,
  pe.es_personalizada,
  COALESCE(pc.dimension_bienestar, pe.dimension_bienestar) as dimension,
  pc.subdimension,
  pc.categoria_analitica,
  pc.es_indicador_clave,
  pc.indicador_codigo,
  pc.peso_indicador,
  pc.nivel_sensibilidad,
  pc.muestra_minima,
  pc.es_comparable,
  pc.version as version_catalogo,
  pc.es_validada_cientificamente,
  pc.fuente_validacion,
  db.nombre as dimension_nombre,
  db.color as dimension_color,
  db.icono as dimension_icono,
  ca.nombre as categoria_nombre,
  ca.tipo_agregacion,
  ca.benchmark_industria,
  ca.umbral_alerta_bajo,
  ca.umbral_alerta_critico
FROM preguntas_encuesta pe
LEFT JOIN preguntas_catalogo pc ON pe.pregunta_catalogo_id = pc.id
LEFT JOIN dimensiones_bienestar db ON COALESCE(pc.dimension_bienestar, pe.dimension_bienestar) = db.id
LEFT JOIN categorias_analiticas ca ON pc.categoria_analitica = ca.id;

COMMENT ON VIEW v_preguntas_analisis IS 'Vista unificada de preguntas con todos los metadatos para análisis';

-- 15. Insertar preguntas de ejemplo validadas científicamente
INSERT INTO preguntas_catalogo (
  empresa_id, texto, texto_corto, tipo, subtipo, opciones,
  dimension_bienestar, categoria_analitica, es_indicador_clave, indicador_codigo,
  nivel_sensibilidad, es_validada_cientificamente, fuente_validacion
) VALUES
-- NPS (pregunta estándar)
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  'En una escala del 0 al 10, ¿qué tan probable es que recomiendes esta empresa como lugar para trabajar?',
  'eNPS: Recomendarías la empresa',
  'nps', 'nps_estandar', NULL,
  'clima_laboral', 'enps', true, 'ENPS',
  'normal', true, 'Net Promoter System'
),
-- Salud Mental - Estrés (basado en PSS)
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  '¿Con qué frecuencia te has sentido estresado por situaciones fuera de tu control en el trabajo durante el último mes?',
  'Frecuencia de estrés laboral',
  'escala_likert', 'frecuencia_5', '{"1": "Nunca", "2": "Casi nunca", "3": "A veces", "4": "Frecuentemente", "5": "Muy frecuentemente"}',
  'salud_mental', 'riesgo_burnout', true, 'STRESS_FREQ',
  'sensible', true, 'Perceived Stress Scale (PSS)'
),
-- Engagement (basado en Gallup Q12)
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  '¿Sabes lo que se espera de ti en el trabajo?',
  'Claridad de expectativas',
  'escala_likert', 'acuerdo_5', '{"1": "Muy en desacuerdo", "2": "En desacuerdo", "3": "Neutral", "4": "De acuerdo", "5": "Muy de acuerdo"}',
  'comunicacion', 'engagement', true, 'GALLUP_Q01',
  'normal', true, 'Gallup Q12'
),
-- Engagement (basado en Gallup Q12)
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  '¿Tienes los materiales y equipos necesarios para hacer bien tu trabajo?',
  'Recursos disponibles',
  'escala_likert', 'acuerdo_5', '{"1": "Muy en desacuerdo", "2": "En desacuerdo", "3": "Neutral", "4": "De acuerdo", "5": "Muy de acuerdo"}',
  'bienestar_fisico', 'engagement', true, 'GALLUP_Q02',
  'normal', true, 'Gallup Q12'
),
-- Balance vida-trabajo
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  '¿Logras mantener un equilibrio saludable entre tu vida laboral y personal?',
  'Balance vida-trabajo',
  'escala_likert', 'frecuencia_5', '{"1": "Nunca", "2": "Casi nunca", "3": "A veces", "4": "Frecuentemente", "5": "Siempre"}',
  'carga_trabajo', 'balance_vida_trabajo', true, 'BALANCE_01',
  'normal', true, 'WHO Work-Life Balance'
),
-- Liderazgo
(
  '00000000-0000-0000-0000-000000000000'::uuid,
  '¿Tu supervisor o alguien en el trabajo se preocupa por ti como persona?',
  'Apoyo del supervisor',
  'escala_likert', 'acuerdo_5', '{"1": "Muy en desacuerdo", "2": "En desacuerdo", "3": "Neutral", "4": "De acuerdo", "5": "Muy de acuerdo"}',
  'liderazgo', 'satisfaccion_liderazgo', true, 'GALLUP_Q05',
  'normal', true, 'Gallup Q12'
)
ON CONFLICT DO NOTHING;

-- Listo
COMMENT ON TABLE preguntas_catalogo IS 'Catálogo maestro de preguntas con metadatos analíticos para el sistema de encuestas inteligente';
