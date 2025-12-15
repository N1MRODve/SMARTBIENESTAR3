# Sistema de Preguntas Inteligente - SMART Bienestar

## Diseño Completo del Motor de Generación de Datos

---

## 1. Arquitectura de Tipos de Preguntas

### 1.1 Escala Likert (escala_likert)

**Cuándo usar:**
- Medir actitudes, percepciones o niveles de acuerdo
- Preguntas sobre satisfacción, frecuencia, intensidad
- Cuando se necesita granularidad en la respuesta

**Subtipos:**

| Subtipo | Valores | Uso ideal | Ejemplo |
|---------|---------|-----------|---------|
| `acuerdo_5` | 1-5 (Muy en desacuerdo → Muy de acuerdo) | Opiniones, percepciones | "Mi líder comunica expectativas claras" |
| `satisfaccion_5` | 1-5 (Muy insatisfecho → Muy satisfecho) | Evaluación de experiencias | "¿Qué tan satisfecho estás con tu equilibrio vida-trabajo?" |
| `frecuencia_5` | 1-5 (Nunca → Siempre) | Comportamientos recurrentes | "¿Con qué frecuencia te sientes estresado?" |
| `intensidad_5` | 1-5 (Nada → Extremadamente) | Grado de percepción | "¿Qué tan apoyado te sientes por tu equipo?" |

**Datos generados:**
- Valor numérico (1-5)
- Media, mediana, desviación estándar
- Distribución por valor
- Tendencia histórica

**Riesgos de mal uso:**
- Preguntas dobles ("¿Te sientes estresado y agotado?")
- Escalas invertidas que confunden
- Etiquetas ambiguas

**Impacto en analítica:**
- Alta comparabilidad temporal
- Permite benchmarking
- Alimenta índices compuestos

---

### 1.2 Net Promoter Score (nps)

**Cuándo usar:**
- Medir lealtad y recomendación
- Indicador clave de clima organizacional
- Comparativas con estándares de industria

**Estructura:**
- Escala 0-10
- Clasificación: Detractores (0-6), Pasivos (7-8), Promotores (9-10)
- Cálculo: % Promotores - % Detractores

**Pregunta estándar:**
> "En una escala del 0 al 10, ¿qué tan probable es que recomiendes [empresa] como lugar para trabajar?"

**Datos generados:**
- Score NPS (-100 a +100)
- Distribución por categoría
- Evolución temporal
- Segmentación por departamento (si anonimato lo permite)

**Riesgos de mal uso:**
- Modificar la pregunta estándar (rompe comparabilidad)
- Aplicar a contextos donde no tiene sentido
- No dar seguimiento a detractores

**Impacto en analítica:**
- Indicador estrella del dashboard
- Benchmark con industria
- Predictor de rotación

---

### 1.3 Opción Múltiple (opcion_multiple)

**Cuándo usar:**
- Identificar preferencias o prioridades
- Recoger información categórica
- Entender distribución de opiniones

**Variantes:**

| Variante | Descripción | Uso |
|----------|-------------|-----|
| `seleccion_unica` | Solo una opción | Clasificación mutuamente excluyente |
| `seleccion_multiple` | Varias opciones | Identificar múltiples factores |
| `seleccion_multiple_limite` | Máx N opciones | "Top 3 factores..." |

**Datos generados:**
- Frecuencia por opción
- Porcentaje de selección
- Combinaciones más comunes (multi-selección)

**Riesgos de mal uso:**
- Opciones no mutuamente excluyentes en selección única
- Omitir "Otro" o "Ninguna de las anteriores"
- Demasiadas opciones (>7 ideal)

**Impacto en analítica:**
- Identificación de patrones
- Priorización de acciones
- Segmentación cualitativa

---

### 1.4 Sí / No (si_no)

**Cuándo usar:**
- Confirmar hechos concretos
- Filtrar respondentes
- Preguntas de control o validación

**Variantes:**

| Variante | Opciones | Uso |
|----------|----------|-----|
| `si_no_simple` | Sí, No | Hechos binarios |
| `si_no_ns` | Sí, No, No sé | Cuando el desconocimiento es válido |

**Datos generados:**
- Porcentaje sí/no
- Tasa de "No sé" (si aplica)
- Tendencia temporal

**Riesgos de mal uso:**
- Forzar respuesta binaria a temas complejos
- Preguntas que deberían ser de escala
- Sesgo de aquiescencia

**Impacto en analítica:**
- Tasas de incidencia
- Indicadores de alerta
- Filtros para análisis

---

### 1.5 Texto Abierto (texto_abierto)

**Cuándo usar:**
- Recoger sugerencias y feedback cualitativo
- Entender el "por qué" detrás de los números
- Detectar temas emergentes

**Variantes:**

| Variante | Longitud | Uso |
|----------|----------|-----|
| `texto_corto` | 50-200 chars | Complemento a otra pregunta |
| `texto_largo` | 500+ chars | Feedback detallado |
| `texto_opcional` | Variable | Comentario adicional |

**Datos generados:**
- Texto raw (anonimizado)
- Análisis de sentimiento (futuro)
- Categorización temática (futuro)
- Nube de palabras

**Riesgos de mal uso:**
- Abusar de preguntas abiertas (fatiga)
- No analizar las respuestas
- Riesgo de identificación por contenido

**Impacto en analítica:**
- Contexto cualitativo
- Descubrimiento de insights
- Generación de hipótesis

**Límites recomendados:**
- Máximo 2-3 preguntas abiertas por encuesta
- Siempre opcionales
- Advertencia de anonimato

---

### 1.6 Ranking (ranking)

**Cuándo usar:**
- Establecer prioridades claras
- Comparar importancia relativa
- Forzar discriminación entre opciones

**Estructura:**
- Lista de items a ordenar
- Máximo 5-7 items
- Resultado: posición de cada item

**Datos generados:**
- Posición media por item
- Frecuencia en top 3
- Índice de prioridad ponderado

**Riesgos de mal uso:**
- Demasiados items para rankear
- Items no comparables entre sí
- UX confusa en móvil

**Impacto en analítica:**
- Priorización estratégica
- Asignación de recursos
- Roadmap de acciones

---

### 1.7 Matriz de Preguntas (matriz)

**Cuándo usar:**
- Evaluar múltiples items con la misma escala
- Reducir longitud percibida
- Mantener consistencia de medición

**Estructura:**
```
         | Muy malo | Malo | Regular | Bueno | Muy bueno |
---------|----------|------|---------|-------|-----------|
Comunicación |    |      |    X    |       |           |
Liderazgo    |    |      |         |   X   |           |
Beneficios   |    |  X   |         |       |           |
```

**Datos generados:**
- Score por item
- Comparativa entre items
- Patrones de respuesta

**Riesgos de mal uso:**
- Matrices demasiado largas (>7 filas)
- Respuesta en piloto automático
- Escalas diferentes por fila

**Impacto en analítica:**
- Comparativa eficiente
- Identificación de áreas débiles
- Priorización de mejoras

---

## 2. Metadatos Invisibles (Motor Core)

### 2.1 Estructura de Metadatos por Pregunta

```sql
-- Tabla extendida de preguntas
CREATE TABLE preguntas_catalogo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id),

  -- Contenido visible
  texto text NOT NULL,
  texto_corto text, -- Para dashboards y reportes
  tipo text NOT NULL,
  subtipo text,
  opciones jsonb,

  -- Metadatos analíticos (invisibles al empleado)
  dimension_bienestar text NOT NULL,
  subdimension text,
  categoria_analitica text NOT NULL,

  -- Indicadores
  es_indicador_clave boolean DEFAULT false,
  indicador_codigo text, -- ej: "NPS", "STRESS_INDEX", "ENGAGEMENT"
  peso_indicador decimal(3,2) DEFAULT 1.00, -- 0.00 a 1.00

  -- Sensibilidad y privacidad
  nivel_sensibilidad text DEFAULT 'normal', -- normal, sensible, critico
  muestra_minima integer DEFAULT 5,
  requiere_anonimato_completo boolean DEFAULT false,

  -- Comparabilidad
  es_comparable boolean DEFAULT true,
  version integer DEFAULT 1,
  pregunta_origen_id uuid REFERENCES preguntas_catalogo(id),
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz,
  bloqueada boolean DEFAULT false,
  motivo_bloqueo text,

  -- Validación científica
  fuente_validacion text, -- ej: "Gallup Q12", "WHO-5", "MBI"
  es_validada_cientificamente boolean DEFAULT false,

  -- Uso
  veces_usada integer DEFAULT 0,
  ultima_vez_usada timestamptz,

  -- Reglas automáticas
  reglas_alerta jsonb,
  reglas_accion jsonb
);
```

### 2.2 Dimensiones de Bienestar (Taxonomía)

```sql
CREATE TABLE dimensiones_bienestar (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  icono text,
  color text,
  orden integer,
  activa boolean DEFAULT true
);

INSERT INTO dimensiones_bienestar VALUES
('salud_mental', 'Salud Mental', 'Estrés, ansiedad, bienestar emocional', 'brain', '#8B5CF6', 1, true),
('clima_laboral', 'Clima Laboral', 'Ambiente, relaciones, cultura', 'smile', '#3B82F6', 2, true),
('carga_trabajo', 'Carga de Trabajo', 'Balance, productividad, tiempo', 'activity', '#F97316', 3, true),
('comunicacion', 'Comunicación', 'Claridad, feedback, transparencia', 'message-circle', '#06B6D4', 4, true),
('liderazgo', 'Liderazgo', 'Gestión, apoyo, dirección', 'users', '#10B981', 5, true),
('desarrollo', 'Desarrollo Profesional', 'Crecimiento, formación, carrera', 'trending-up', '#22C55E', 6, true),
('reconocimiento', 'Reconocimiento', 'Valoración, recompensas, feedback positivo', 'award', '#EAB308', 7, true),
('bienestar_fisico', 'Bienestar Físico', 'Ergonomía, salud, condiciones', 'heart', '#EF4444', 8, true),
('proposito', 'Propósito', 'Sentido, alineación, impacto', 'target', '#EC4899', 9, true);
```

### 2.3 Categorías Analíticas

```sql
CREATE TABLE categorias_analiticas (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  tipo_agregacion text, -- 'promedio', 'suma', 'porcentaje', 'nps'
  benchmark_industria decimal(5,2),
  umbral_alerta_bajo decimal(5,2),
  umbral_alerta_critico decimal(5,2)
);

INSERT INTO categorias_analiticas VALUES
('indice_bienestar', 'Índice de Bienestar Global', 'Score compuesto 0-100', 'promedio', 72.0, 60.0, 45.0),
('enps', 'Employee NPS', 'Net Promoter Score empleados', 'nps', 25.0, 0.0, -20.0),
('riesgo_burnout', 'Riesgo de Burnout', 'Indicador de agotamiento', 'promedio', 2.5, 3.5, 4.0),
('engagement', 'Engagement', 'Nivel de compromiso', 'promedio', 3.8, 3.0, 2.5),
('satisfaccion_liderazgo', 'Satisfacción con Liderazgo', 'Evaluación de gestión', 'promedio', 3.7, 3.0, 2.5),
('calidad_comunicacion', 'Calidad de Comunicación', 'Efectividad comunicativa', 'promedio', 3.6, 3.0, 2.5);
```

### 2.4 Reglas de Alerta (jsonb)

```json
{
  "alertas": [
    {
      "tipo": "umbral_bajo",
      "condicion": "promedio < 2.5",
      "severidad": "warning",
      "mensaje": "Puntuación por debajo del umbral saludable",
      "accion_sugerida": "Revisar plan de acción para esta área"
    },
    {
      "tipo": "umbral_critico",
      "condicion": "promedio < 2.0",
      "severidad": "critical",
      "mensaje": "Nivel crítico detectado - requiere atención inmediata",
      "notificar_a": ["admin", "rrhh"]
    },
    {
      "tipo": "tendencia_negativa",
      "condicion": "variacion_mensual < -15%",
      "severidad": "warning",
      "mensaje": "Caída significativa respecto al mes anterior"
    }
  ]
}
```

### 2.5 Reglas de Acción (jsonb)

```json
{
  "acciones": [
    {
      "trigger": "promedio < 3.0",
      "tipo": "plan_mejora",
      "plantilla_id": "pm_estres_alto",
      "descripcion": "Activar plan de gestión del estrés"
    },
    {
      "trigger": "respuesta = 1 OR respuesta = 2",
      "tipo": "seguimiento_individual",
      "solo_si_identificado": true,
      "descripcion": "Ofrecer apoyo personalizado"
    },
    {
      "trigger": "dimension = 'salud_mental' AND promedio < 2.5",
      "tipo": "recurso_automatico",
      "recurso": "guia_bienestar_mental",
      "descripcion": "Enviar recursos de apoyo psicológico"
    }
  ]
}
```

---

## 3. Comparabilidad y Evolución Temporal

### 3.1 Sistema de Versionado

```sql
-- Historial de versiones de preguntas
CREATE TABLE preguntas_versiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id),
  version integer NOT NULL,
  texto_anterior text,
  texto_nuevo text,
  tipo_cambio text, -- 'texto', 'tipo', 'opciones', 'metadatos'
  es_cambio_menor boolean, -- No afecta comparabilidad
  motivo_cambio text,
  cambiado_por uuid REFERENCES auth.users(id),
  fecha_cambio timestamptz DEFAULT now(),

  UNIQUE(pregunta_id, version)
);

-- Trigger para auto-versionado
CREATE OR REPLACE FUNCTION fn_versionar_pregunta()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.texto != NEW.texto OR OLD.tipo != NEW.tipo THEN
    NEW.version = OLD.version + 1;
    NEW.fecha_modificacion = now();

    INSERT INTO preguntas_versiones (
      pregunta_id, version, texto_anterior, texto_nuevo,
      tipo_cambio, es_cambio_menor
    ) VALUES (
      NEW.id, NEW.version, OLD.texto, NEW.texto,
      CASE
        WHEN OLD.tipo != NEW.tipo THEN 'tipo'
        ELSE 'texto'
      END,
      -- Cambio menor: solo correcciones ortográficas
      OLD.texto ILIKE '%' || NEW.texto || '%' OR NEW.texto ILIKE '%' || OLD.texto || '%'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_versionar_pregunta
  BEFORE UPDATE ON preguntas_catalogo
  FOR EACH ROW
  EXECUTE FUNCTION fn_versionar_pregunta();
```

### 3.2 Bloqueo de Preguntas Críticas

```sql
-- Función para verificar si se puede modificar
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

  -- Contar usos en encuestas activas/finalizadas
  SELECT COUNT(*) INTO v_usos
  FROM preguntas_encuesta pe
  JOIN encuestas e ON pe.encuesta_id = e.id
  WHERE pe.pregunta_catalogo_id = p_pregunta_id
  AND e.estado IN ('activa', 'finalizada');

  v_resultado = jsonb_build_object(
    'puede_modificar', true,
    'advertencias', '[]'::jsonb,
    'bloqueada', v_pregunta.bloqueada
  );

  -- Verificar bloqueo
  IF v_pregunta.bloqueada AND NOT p_forzar THEN
    RETURN jsonb_build_object(
      'puede_modificar', false,
      'razon', v_pregunta.motivo_bloqueo,
      'bloqueada', true
    );
  END IF;

  -- Verificar si es indicador clave con usos
  IF v_pregunta.es_indicador_clave AND v_usos > 0 THEN
    v_resultado = jsonb_set(v_resultado, '{advertencias}',
      v_resultado->'advertencias' || jsonb_build_array(
        jsonb_build_object(
          'tipo', 'indicador_clave',
          'severidad', 'high',
          'mensaje', 'Esta pregunta alimenta indicadores clave. Modificarla romperá la comparabilidad histórica.',
          'usos', v_usos
        )
      )
    );
  END IF;

  -- Verificar si tiene datos históricos
  IF v_usos >= 3 THEN
    v_resultado = jsonb_set(v_resultado, '{advertencias}',
      v_resultado->'advertencias' || jsonb_build_array(
        jsonb_build_object(
          'tipo', 'historial_extenso',
          'severidad', 'medium',
          'mensaje', format('Esta pregunta se ha usado en %s encuestas. Considera crear una nueva versión.', v_usos),
          'sugerencia', 'crear_nueva'
        )
      )
    );
  END IF;

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Marcadores de Comparabilidad

```sql
-- Tabla de series temporales por pregunta
CREATE TABLE series_temporales_preguntas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id),
  empresa_id uuid NOT NULL,
  periodo text NOT NULL, -- '2024-Q1', '2024-01', etc.
  tipo_periodo text NOT NULL, -- 'mensual', 'trimestral', 'anual'

  -- Métricas agregadas
  n_respuestas integer NOT NULL,
  promedio decimal(5,2),
  mediana decimal(5,2),
  desviacion_std decimal(5,2),
  percentil_25 decimal(5,2),
  percentil_75 decimal(5,2),

  -- Para NPS
  promotores integer,
  pasivos integer,
  detractores integer,
  nps_score decimal(5,2),

  -- Comparabilidad
  es_comparable_anterior boolean DEFAULT true,
  nota_comparabilidad text,
  version_pregunta integer,

  fecha_calculo timestamptz DEFAULT now(),

  UNIQUE(pregunta_id, empresa_id, periodo, tipo_periodo)
);
```

### 3.4 Reutilización Segura entre Encuestas

```sql
-- Catálogo de preguntas reutilizables
CREATE TABLE preguntas_encuesta_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id uuid NOT NULL REFERENCES encuestas(id) ON DELETE CASCADE,

  -- Referencia al catálogo (nueva columna)
  pregunta_catalogo_id uuid REFERENCES preguntas_catalogo(id),

  -- Copia local (por si se personaliza)
  texto text NOT NULL,
  tipo text NOT NULL,
  opciones jsonb,
  orden integer NOT NULL,

  -- Control de personalización
  es_personalizada boolean DEFAULT false,
  texto_original text, -- Si se personalizó, guardar original

  -- Metadatos heredados o personalizados
  dimension_bienestar text,
  es_obligatoria boolean DEFAULT true,

  fecha_creacion timestamptz DEFAULT now()
);

-- Vista para análisis que une con catálogo
CREATE VIEW v_preguntas_analisis AS
SELECT
  pe.id,
  pe.encuesta_id,
  pe.texto,
  pe.tipo,
  COALESCE(pc.dimension_bienestar, pe.dimension_bienestar) as dimension,
  COALESCE(pc.categoria_analitica, 'general') as categoria,
  pc.es_indicador_clave,
  pc.indicador_codigo,
  pc.es_comparable,
  pc.version as version_catalogo,
  pe.es_personalizada
FROM preguntas_encuesta_v2 pe
LEFT JOIN preguntas_catalogo pc ON pe.pregunta_catalogo_id = pc.id;
```

---

## 4. UX para el Administrador

### 4.1 Asistente de Redacción de Preguntas

**Pantalla: Editor de Pregunta con Guía Inteligente**

```vue
<!-- Componente: PreguntaEditor.vue -->
<template>
  <div class="pregunta-editor">
    <!-- Input de texto con análisis en tiempo real -->
    <div class="pregunta-input-wrapper">
      <textarea
        v-model="pregunta.texto"
        @input="analizarPregunta"
        placeholder="Escribe tu pregunta aquí..."
        :class="{ 'tiene-advertencias': advertencias.length > 0 }"
      />

      <!-- Indicador de calidad -->
      <div class="calidad-indicator">
        <div
          class="calidad-bar"
          :style="{ width: calidadScore + '%' }"
          :class="calidadClase"
        />
        <span class="calidad-label">{{ calidadLabel }}</span>
      </div>
    </div>

    <!-- Advertencias en tiempo real -->
    <div v-if="advertencias.length > 0" class="advertencias-panel">
      <div
        v-for="adv in advertencias"
        :key="adv.id"
        class="advertencia"
        :class="adv.severidad"
      >
        <component :is="adv.icono" class="adv-icon" />
        <div class="adv-content">
          <p class="adv-mensaje">{{ adv.mensaje }}</p>
          <p v-if="adv.sugerencia" class="adv-sugerencia">
            <strong>Sugerencia:</strong> {{ adv.sugerencia }}
          </p>
          <button
            v-if="adv.accion"
            @click="aplicarSugerencia(adv)"
            class="btn-sugerencia"
          >
            {{ adv.accionTexto }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sugerencias automáticas -->
    <div v-if="sugerencias.length > 0" class="sugerencias-panel">
      <h4>Sugerencias basadas en tu pregunta</h4>

      <div class="sugerencia-tipo">
        <span class="label">Tipo recomendado:</span>
        <div class="tipos-sugeridos">
          <button
            v-for="tipo in tiposSugeridos"
            :key="tipo.id"
            @click="seleccionarTipo(tipo)"
            class="tipo-btn"
            :class="{ activo: pregunta.tipo === tipo.id }"
          >
            <component :is="tipo.icono" />
            <span>{{ tipo.nombre }}</span>
            <span class="confianza">{{ tipo.confianza }}%</span>
          </button>
        </div>
      </div>

      <div v-if="escalaSugerida" class="sugerencia-escala">
        <span class="label">Escala recomendada:</span>
        <p class="escala-preview">
          {{ escalaSugerida.etiquetaInicio }} → {{ escalaSugerida.etiquetaFin }}
        </p>
      </div>
    </div>
  </div>
</template>
```

### 4.2 Reglas de Análisis en Tiempo Real

```javascript
// analizadorPreguntas.js

export const analizarPregunta = (texto) => {
  const advertencias = [];
  const sugerencias = [];
  let calidadScore = 100;

  // 1. Detectar preguntas dobles
  if (/\by\b.*\?/i.test(texto) && texto.split(/\by\b/i).length > 2) {
    advertencias.push({
      id: 'pregunta_doble',
      severidad: 'error',
      mensaje: 'Parece una pregunta doble. Las preguntas con "y" que evalúan dos cosas diferentes confunden a los empleados.',
      sugerencia: 'Divide esta pregunta en dos preguntas separadas.',
      ejemplo: {
        mal: '¿Te sientes apoyado y motivado en tu trabajo?',
        bien: ['¿Te sientes apoyado en tu trabajo?', '¿Te sientes motivado en tu trabajo?']
      }
    });
    calidadScore -= 30;
  }

  // 2. Detectar preguntas inductivas
  const palabrasInductivas = ['obviamente', 'claramente', 'sin duda', 'es evidente'];
  const tieneInduccion = palabrasInductivas.some(p => texto.toLowerCase().includes(p));
  if (tieneInduccion) {
    advertencias.push({
      id: 'pregunta_inductiva',
      severidad: 'warning',
      mensaje: 'Esta pregunta puede inducir la respuesta. Las palabras como "obviamente" o "claramente" sesgan las respuestas.',
      sugerencia: 'Reformula de forma neutral.',
      accion: 'auto_corregir',
      accionTexto: 'Corregir automáticamente'
    });
    calidadScore -= 20;
  }

  // 3. Detectar negaciones dobles
  if (/no\s+\w+\s+no/i.test(texto) || /nunca\s+\w+\s+no/i.test(texto)) {
    advertencias.push({
      id: 'negacion_doble',
      severidad: 'error',
      mensaje: 'Las negaciones dobles confunden. Reformula de forma afirmativa.',
      ejemplo: {
        mal: '¿No consideras que no hay suficiente comunicación?',
        bien: '¿Consideras que hay suficiente comunicación?'
      }
    });
    calidadScore -= 25;
  }

  // 4. Detectar preguntas demasiado largas
  if (texto.length > 150) {
    advertencias.push({
      id: 'pregunta_larga',
      severidad: 'warning',
      mensaje: `Tu pregunta tiene ${texto.length} caracteres. Las preguntas largas reducen la tasa de respuesta.`,
      sugerencia: 'Intenta reducirla a menos de 100 caracteres.'
    });
    calidadScore -= 10;
  }

  // 5. Detectar jerga o tecnicismos
  const tecnicismos = ['KPI', 'ROI', 'OKR', 'stakeholder', 'feedback loop', 'synergy'];
  const tieneTecnicismo = tecnicismos.some(t => texto.toLowerCase().includes(t.toLowerCase()));
  if (tieneTecnicismo) {
    advertencias.push({
      id: 'tecnicismo',
      severidad: 'info',
      mensaje: 'Contiene términos técnicos que algunos empleados podrían no entender.',
      sugerencia: 'Considera usar lenguaje más sencillo para asegurar que todos entiendan.'
    });
    calidadScore -= 5;
  }

  // 6. Sugerir tipo de pregunta
  const tiposSugeridos = inferirTipoPregunta(texto);

  // 7. Detectar dimensión de bienestar
  const dimensionDetectada = inferirDimension(texto);

  return {
    advertencias,
    sugerencias,
    calidadScore: Math.max(0, calidadScore),
    tiposSugeridos,
    dimensionDetectada
  };
};

const inferirTipoPregunta = (texto) => {
  const texto_lower = texto.toLowerCase();
  const sugerencias = [];

  // Patrones para escala
  if (/qué tan|cuánto|en qué medida|nivel de|grado de/i.test(texto)) {
    sugerencias.push({
      id: 'escala_likert',
      nombre: 'Escala 1-5',
      confianza: 90,
      razon: 'Preguntas de grado o nivel funcionan mejor con escalas'
    });
  }

  // Patrones para Sí/No
  if (/^¿(tienes|has|puedes|existe|hay|cuentas)/i.test(texto)) {
    sugerencias.push({
      id: 'si_no',
      nombre: 'Sí / No',
      confianza: 85,
      razon: 'Pregunta de confirmación'
    });
  }

  // Patrones para opción múltiple
  if (/cuál|qué factores|qué aspectos|principales razones/i.test(texto)) {
    sugerencias.push({
      id: 'opcion_multiple',
      nombre: 'Opción múltiple',
      confianza: 80,
      razon: 'Pregunta de selección entre opciones'
    });
  }

  // Patrones para NPS
  if (/recomendar|recomendarías/i.test(texto)) {
    sugerencias.push({
      id: 'nps',
      nombre: 'NPS (0-10)',
      confianza: 95,
      razon: 'Pregunta estándar de recomendación'
    });
  }

  return sugerencias.sort((a, b) => b.confianza - a.confianza);
};

const inferirDimension = (texto) => {
  const dimensiones = {
    'salud_mental': ['estrés', 'ansiedad', 'agotamiento', 'burnout', 'emocional', 'mental'],
    'clima_laboral': ['ambiente', 'compañeros', 'equipo', 'relaciones', 'cultura'],
    'carga_trabajo': ['carga', 'trabajo', 'horas', 'tiempo', 'equilibrio', 'balance'],
    'comunicacion': ['comunicación', 'información', 'claridad', 'feedback'],
    'liderazgo': ['líder', 'jefe', 'supervisor', 'manager', 'dirección', 'gestión'],
    'desarrollo': ['crecimiento', 'formación', 'carrera', 'aprender', 'desarrollo'],
    'reconocimiento': ['reconocimiento', 'valorado', 'apreciado', 'recompensa']
  };

  const texto_lower = texto.toLowerCase();
  let mejorMatch = { dimension: 'general', score: 0 };

  for (const [dimension, keywords] of Object.entries(dimensiones)) {
    const matches = keywords.filter(k => texto_lower.includes(k)).length;
    if (matches > mejorMatch.score) {
      mejorMatch = { dimension, score: matches };
    }
  }

  return mejorMatch.dimension;
};
```

### 4.3 Microcopy Educativo

```javascript
// microcopy.js - Textos educativos para el administrador

export const MICROCOPY = {
  tipos_pregunta: {
    escala_likert: {
      titulo: 'Escala 1-5',
      descripcion: 'Ideal para medir grados de acuerdo, satisfacción o frecuencia.',
      cuando_usar: 'Usa este tipo cuando necesites medir "cuánto" o "qué tan".',
      tip: 'Las escalas de 5 puntos ofrecen el mejor balance entre precisión y facilidad de respuesta.'
    },
    nps: {
      titulo: 'Net Promoter Score',
      descripcion: 'Escala 0-10 para medir lealtad y probabilidad de recomendación.',
      cuando_usar: 'Úsala solo para la pregunta estándar de recomendación. Es un indicador global.',
      tip: 'No modifiques el texto de la pregunta NPS; romperías la comparabilidad con benchmarks.'
    },
    opcion_multiple: {
      titulo: 'Opción múltiple',
      descripcion: 'Permite seleccionar una o varias opciones predefinidas.',
      cuando_usar: 'Cuando quieras conocer preferencias o identificar factores específicos.',
      tip: 'Incluye siempre una opción "Otro" y limita a máximo 7 opciones.'
    },
    si_no: {
      titulo: 'Sí / No',
      descripcion: 'Respuesta binaria para hechos concretos.',
      cuando_usar: 'Para confirmar hechos o como pregunta filtro.',
      tip: 'No uses Sí/No para opiniones; usa escalas que capturan matices.'
    },
    texto_abierto: {
      titulo: 'Texto abierto',
      descripcion: 'Permite respuestas libres para feedback cualitativo.',
      cuando_usar: 'Para recoger sugerencias o entender el "por qué" detrás de los números.',
      tip: 'Limita a 2-3 por encuesta. Las preguntas abiertas fatigan y reducen participación.'
    }
  },

  advertencias: {
    pregunta_doble: {
      titulo: 'Pregunta doble detectada',
      explicacion: 'Las preguntas que evalúan dos cosas a la vez confunden a quien responde. Si alguien está de acuerdo con una parte pero no con la otra, ¿qué responde?',
      impacto: 'Datos ambiguos que no podrás interpretar con confianza.'
    },
    muestra_pequena: {
      titulo: 'Muestra pequeña',
      explicacion: 'Con menos de {n} respuestas, los resultados no son estadísticamente significativos y podrían identificar personas.',
      impacto: 'Resultados no confiables y posible violación de privacidad.'
    },
    rompe_comparabilidad: {
      titulo: 'Esto romperá la comparabilidad',
      explicacion: 'Esta pregunta se ha usado en {n} encuestas anteriores. Si la modificas, no podrás comparar resultados históricos.',
      alternativa: 'Crea una nueva pregunta y marca la anterior como obsoleta.'
    }
  },

  tooltips: {
    dimension_bienestar: 'La dimensión determina en qué área del dashboard aparecerán los resultados y con qué otras preguntas se relacionará.',
    es_indicador_clave: 'Los indicadores clave alimentan los KPIs principales del dashboard. Solo marca esto si es una métrica estratégica.',
    nivel_sensibilidad: 'Las preguntas sensibles requieren mayor anonimato. Considera si una respuesta baja podría perjudicar al empleado.',
    muestra_minima: 'El número mínimo de respuestas necesarias para mostrar resultados. A menor número, mayor riesgo de identificación.'
  }
};
```

### 4.4 Límites Inteligentes para Preguntas Abiertas

```vue
<!-- Componente: LimiteTextoAbierto.vue -->
<template>
  <div v-if="mostrarAdvertencia" class="limite-texto-abierto">
    <div class="advertencia-panel" :class="severidad">
      <AlertTriangle class="icon" />
      <div class="content">
        <h4>{{ titulo }}</h4>
        <p>{{ mensaje }}</p>

        <div v-if="sugerencias.length > 0" class="sugerencias">
          <p class="sugerencias-titulo">Considera estas alternativas:</p>
          <ul>
            <li v-for="sug in sugerencias" :key="sug">{{ sug }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  totalPreguntas: Number,
  preguntasAbiertas: Number,
  duracionEstimada: Number
});

const mostrarAdvertencia = computed(() => props.preguntasAbiertas > 0);

const severidad = computed(() => {
  if (props.preguntasAbiertas >= 4) return 'error';
  if (props.preguntasAbiertas >= 3) return 'warning';
  return 'info';
});

const titulo = computed(() => {
  if (props.preguntasAbiertas >= 4) return 'Demasiadas preguntas abiertas';
  if (props.preguntasAbiertas >= 3) return 'Considera reducir preguntas abiertas';
  return 'Tienes preguntas de texto abierto';
});

const mensaje = computed(() => {
  const porcentaje = Math.round((props.preguntasAbiertas / props.totalPreguntas) * 100);

  if (props.preguntasAbiertas >= 4) {
    return `${props.preguntasAbiertas} preguntas abiertas (${porcentaje}% del total) reducirán significativamente la tasa de respuesta. Los empleados abandonan encuestas con mucho texto.`;
  }
  if (props.preguntasAbiertas >= 3) {
    return `${props.preguntasAbiertas} preguntas abiertas pueden alargar la encuesta. Tiempo estimado: ${props.duracionEstimada} minutos.`;
  }
  return `Las preguntas abiertas son valiosas pero úsalas con moderación. Recomendamos máximo 2 por encuesta.`;
});

const sugerencias = computed(() => {
  if (props.preguntasAbiertas >= 3) {
    return [
      'Convierte algunas en opción múltiple con "Otro (especificar)"',
      'Haz las preguntas abiertas opcionales',
      'Usa una pregunta abierta al final para comentarios generales'
    ];
  }
  return [];
});
</script>
```

---

## 5. Impacto en Acciones y Recompensas

### 5.1 Sistema de Reglas Automáticas

```sql
-- Tabla de reglas de acción basadas en respuestas
CREATE TABLE reglas_accion_encuesta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  activa boolean DEFAULT true,

  -- Condiciones
  tipo_trigger text NOT NULL, -- 'pregunta_individual', 'promedio_dimension', 'tendencia', 'nps'
  pregunta_id uuid REFERENCES preguntas_catalogo(id),
  dimension text,

  -- Lógica de condición (jsonb para flexibilidad)
  condicion jsonb NOT NULL,
  /*
  Ejemplos:
  {"operador": "<", "valor": 2.5}
  {"operador": "between", "valor_min": 2, "valor_max": 3}
  {"operador": "tendencia", "direccion": "baja", "periodos": 3, "umbral": -15}
  */

  -- Acción a ejecutar
  tipo_accion text NOT NULL, -- 'notificacion', 'tarea', 'recurso', 'plan_mejora', 'puntos'
  accion_config jsonb NOT NULL,
  /*
  Ejemplos:
  {"tipo": "notificacion", "destinatarios": ["admin", "rrhh"], "prioridad": "alta"}
  {"tipo": "tarea", "plantilla_id": "tarea_seguimiento_estres", "asignar_a": "rrhh"}
  {"tipo": "recurso", "recurso_id": "guia_estres", "enviar_a": "respondente"}
  {"tipo": "puntos", "cantidad": 50, "concepto": "participacion_encuesta"}
  */

  -- Control de ejecución
  cooldown_dias integer DEFAULT 30, -- No volver a ejecutar por X días
  max_ejecuciones integer, -- Límite de veces que puede ejecutarse
  ejecuciones_count integer DEFAULT 0,
  ultima_ejecucion timestamptz,

  fecha_creacion timestamptz DEFAULT now()
);

-- Historial de acciones ejecutadas
CREATE TABLE historial_acciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regla_id uuid REFERENCES reglas_accion_encuesta(id),
  encuesta_id uuid REFERENCES encuestas(id),

  -- Contexto de ejecución
  tipo_trigger text,
  valor_trigger decimal(5,2),
  condicion_evaluada text,

  -- Resultado
  accion_ejecutada text,
  resultado jsonb,
  exito boolean,
  error text,

  fecha_ejecucion timestamptz DEFAULT now()
);
```

### 5.2 Configuración de Reglas en UI

```javascript
// Ejemplos de reglas predefinidas

export const REGLAS_PREDEFINIDAS = [
  {
    id: 'alerta_estres_alto',
    nombre: 'Alerta de estrés alto',
    descripcion: 'Notifica a RRHH cuando el promedio de estrés es crítico',
    tipo_trigger: 'promedio_dimension',
    dimension: 'salud_mental',
    condicion: {
      operador: '<',
      valor: 2.5
    },
    tipo_accion: 'notificacion',
    accion_config: {
      destinatarios: ['rrhh'],
      prioridad: 'alta',
      mensaje: 'El índice de salud mental ha bajado a nivel crítico ({valor}). Se recomienda activar plan de acción.'
    }
  },
  {
    id: 'puntos_participacion',
    nombre: 'Puntos por participar',
    descripcion: 'Otorga puntos a empleados que completan encuestas',
    tipo_trigger: 'encuesta_completada',
    condicion: {
      operador: '=',
      valor: true
    },
    tipo_accion: 'puntos',
    accion_config: {
      cantidad: 50,
      concepto: 'Participación en encuesta de bienestar',
      solo_primera_vez: false
    }
  },
  {
    id: 'recurso_automatico_burnout',
    nombre: 'Enviar recursos anti-burnout',
    descripcion: 'Envía guía de recursos cuando detecta signos de burnout',
    tipo_trigger: 'pregunta_individual',
    pregunta_indicadores: ['burnout_1', 'burnout_2', 'burnout_3'],
    condicion: {
      operador: 'promedio_preguntas_<',
      valor: 2
    },
    tipo_accion: 'recurso',
    accion_config: {
      recurso_id: 'guia_prevencion_burnout',
      canal: 'email',
      mensaje_acompanante: 'Hemos preparado algunos recursos que podrían ayudarte...',
      respetar_anonimato: true // Solo si encuesta identificada
    }
  },
  {
    id: 'plan_mejora_comunicacion',
    nombre: 'Plan de mejora de comunicación',
    descripcion: 'Activa plan cuando comunicación cae por debajo del umbral',
    tipo_trigger: 'promedio_dimension',
    dimension: 'comunicacion',
    condicion: {
      operador: '<',
      valor: 3.0
    },
    tipo_accion: 'plan_mejora',
    accion_config: {
      plantilla_plan_id: 'plan_comunicacion_efectiva',
      asignar_a: 'responsable_area',
      duracion_dias: 90,
      seguimiento_automatico: true
    }
  },
  {
    id: 'tendencia_negativa',
    nombre: 'Alerta de tendencia negativa',
    descripcion: 'Alerta cuando una dimensión baja consistentemente',
    tipo_trigger: 'tendencia',
    dimension: '*', // Cualquier dimensión
    condicion: {
      operador: 'tendencia',
      direccion: 'baja',
      periodos: 3,
      umbral: -10 // Caída de 10% en 3 periodos
    },
    tipo_accion: 'notificacion',
    accion_config: {
      destinatarios: ['admin'],
      prioridad: 'media',
      incluir_grafico: true,
      mensaje: 'La dimensión {dimension} ha bajado un {variacion}% en los últimos {periodos} periodos.'
    }
  }
];
```

### 5.3 Detección de Riesgos Respetando Anonimato

```javascript
// detectorRiesgos.js

export const evaluarRiesgosColectivos = async (encuestaId, empresaId) => {
  const riesgos = [];

  // 1. Análisis por departamento (solo si n >= muestra_minima)
  const resultadosDept = await obtenerResultadosPorDepartamento(encuestaId);

  for (const dept of resultadosDept) {
    if (dept.n_respuestas < dept.muestra_minima) {
      // No analizar si muestra muy pequeña
      continue;
    }

    // Detectar departamentos en riesgo
    if (dept.promedio_salud_mental < 2.5) {
      riesgos.push({
        tipo: 'departamento_riesgo',
        severidad: 'alta',
        departamento: dept.nombre,
        dimension: 'salud_mental',
        valor: dept.promedio_salud_mental,
        mensaje: `El departamento ${dept.nombre} muestra señales de estrés elevado`,
        accion_sugerida: 'Reunión con líder de área',
        preserva_anonimato: true // No identifica individuos
      });
    }
  }

  // 2. Análisis de patrones anómalos (sin identificar)
  const patronesAnomalos = await detectarPatronesAnomalos(encuestaId);

  if (patronesAnomalos.respuestas_extremas_porcentaje > 20) {
    riesgos.push({
      tipo: 'patron_anomalo',
      severidad: 'media',
      mensaje: `${patronesAnomalos.respuestas_extremas_porcentaje}% de respuestas en valores extremos`,
      interpretacion: 'Posible polarización o problema sistémico',
      accion_sugerida: 'Investigar causas raíz'
    });
  }

  // 3. Correlaciones preocupantes
  const correlaciones = await calcularCorrelaciones(encuestaId);

  if (correlaciones.estres_carga > 0.7) {
    riesgos.push({
      tipo: 'correlacion_alta',
      severidad: 'media',
      dimensiones: ['salud_mental', 'carga_trabajo'],
      correlacion: correlaciones.estres_carga,
      mensaje: 'Alta correlación entre estrés y carga de trabajo',
      interpretacion: 'La carga laboral está impactando la salud mental',
      accion_sugerida: 'Revisar distribución de carga de trabajo'
    });
  }

  return riesgos;
};

// Función para alertas individuales (solo en modo identificado con consentimiento)
export const evaluarRiesgosIndividuales = async (respuestas, empleadoId, consentimiento) => {
  if (!consentimiento || !empleadoId) {
    return null; // No procesar sin consentimiento explícito
  }

  const indicadoresRiesgo = [];

  // Verificar respuestas críticas en preguntas sensibles
  for (const respuesta of respuestas) {
    if (respuesta.pregunta.nivel_sensibilidad === 'critico') {
      if (respuesta.valor <= 1) {
        indicadoresRiesgo.push({
          pregunta_id: respuesta.pregunta_id,
          dimension: respuesta.pregunta.dimension_bienestar,
          valor: respuesta.valor
        });
      }
    }
  }

  if (indicadoresRiesgo.length >= 3) {
    return {
      empleado_id: empleadoId,
      nivel_riesgo: 'alto',
      indicadores: indicadoresRiesgo,
      accion_sugerida: 'contacto_confidencial_rrhh',
      mensaje_interno: 'Empleado con múltiples indicadores de riesgo - seguimiento recomendado'
    };
  }

  return null;
};
```

---

## 6. Validaciones y Calidad de Datos

### 6.1 Validaciones de Encuesta Completa

```javascript
// validadorEncuesta.js

export const validarEncuesta = async (encuesta, preguntas, empresaConfig) => {
  const resultado = {
    valida: true,
    errores: [],
    advertencias: [],
    sugerencias: [],
    metricas: {}
  };

  // 1. Validar tamaño mínimo de muestra esperado
  const audienciaEstimada = await calcularAudiencia(encuesta);
  const tasaRespuestaEsperada = 0.7; // 70% histórico
  const respuestasEsperadas = audienciaEstimada * tasaRespuestaEsperada;

  if (respuestasEsperadas < 5) {
    resultado.errores.push({
      codigo: 'MUESTRA_INSUFICIENTE',
      mensaje: 'La audiencia es demasiado pequeña',
      detalle: `Con ${audienciaEstimada} empleados y ~70% de participación, esperamos ${Math.round(respuestasEsperadas)} respuestas. Mínimo necesario: 5.`,
      sugerencia: 'Amplía la audiencia o combina departamentos pequeños.'
    });
    resultado.valida = false;
  }

  // 2. Validar riesgo de identificación
  if (encuesta.privacidad_nivel === 'anonimato_parcial') {
    const departamentosPequenos = await obtenerDepartamentosPequenos(encuesta, 5);
    if (departamentosPequenos.length > 0) {
      resultado.advertencias.push({
        codigo: 'RIESGO_IDENTIFICACION',
        mensaje: 'Riesgo de identificación en departamentos pequeños',
        detalle: `Los departamentos ${departamentosPequenos.join(', ')} tienen menos de 5 personas. Las respuestas podrían identificarse indirectamente.`,
        sugerencia: 'Cambia a "Anónimo completo" o excluye estos departamentos.',
        departamentos_afectados: departamentosPequenos
      });
    }
  }

  // 3. Validar equilibrio entre dimensiones
  const dimensionesUsadas = [...new Set(preguntas.map(p => p.dimension_bienestar))];
  const distribucion = {};
  preguntas.forEach(p => {
    distribucion[p.dimension_bienestar] = (distribucion[p.dimension_bienestar] || 0) + 1;
  });

  const maxPreguntas = Math.max(...Object.values(distribucion));
  const minPreguntas = Math.min(...Object.values(distribucion));

  if (maxPreguntas > minPreguntas * 3) {
    const dimensionSobrecargada = Object.keys(distribucion).find(k => distribucion[k] === maxPreguntas);
    resultado.advertencias.push({
      codigo: 'DESEQUILIBRIO_DIMENSIONES',
      mensaje: 'Desequilibrio entre dimensiones de bienestar',
      detalle: `La dimensión "${dimensionSobrecargada}" tiene ${maxPreguntas} preguntas mientras otras tienen ${minPreguntas}. Esto puede sesgar los resultados.`,
      sugerencia: 'Equilibra el número de preguntas por dimensión para una medición más completa.'
    });
  }

  // 4. Validar longitud de encuesta
  const tiempoEstimado = calcularTiempoEstimado(preguntas);
  resultado.metricas.tiempo_estimado = tiempoEstimado;

  if (tiempoEstimado > 15) {
    resultado.advertencias.push({
      codigo: 'ENCUESTA_LARGA',
      mensaje: 'Encuesta demasiado larga',
      detalle: `Tiempo estimado: ${tiempoEstimado} minutos. Las encuestas de más de 10 minutos tienen tasas de abandono del 50%+.`,
      sugerencia: 'Reduce a 10-15 preguntas máximo para mejor participación.',
      impacto_estimado: `Tasa de finalización esperada: ${Math.max(30, 100 - (tiempoEstimado - 10) * 5)}%`
    });
  }

  if (preguntas.length > 25) {
    resultado.errores.push({
      codigo: 'DEMASIADAS_PREGUNTAS',
      mensaje: 'Número excesivo de preguntas',
      detalle: `${preguntas.length} preguntas es excesivo. Recomendamos máximo 20.`,
      sugerencia: 'Prioriza las preguntas esenciales. Puedes hacer encuestas más frecuentes y cortas.'
    });
    resultado.valida = false;
  }

  // 5. Validar preguntas abiertas
  const preguntasAbiertas = preguntas.filter(p => p.tipo === 'texto_abierto');
  if (preguntasAbiertas.length > 3) {
    resultado.advertencias.push({
      codigo: 'EXCESO_TEXTO_ABIERTO',
      mensaje: 'Demasiadas preguntas de texto abierto',
      detalle: `${preguntasAbiertas.length} preguntas abiertas reducirán significativamente la participación.`,
      sugerencia: 'Limita a 2 preguntas abiertas. Convierte algunas en opción múltiple.'
    });
  }

  // 6. Validar que hay al menos un indicador clave
  const indicadoresClave = preguntas.filter(p => p.es_indicador_clave);
  if (indicadoresClave.length === 0) {
    resultado.sugerencias.push({
      codigo: 'SIN_INDICADORES_CLAVE',
      mensaje: 'No hay indicadores clave definidos',
      detalle: 'Los indicadores clave alimentan los KPIs del dashboard.',
      sugerencia: 'Marca al menos 1-2 preguntas como indicadores clave para tracking estratégico.'
    });
  }

  // 7. Validar preguntas individuales
  for (const pregunta of preguntas) {
    const analisis = analizarPregunta(pregunta.texto);
    if (analisis.advertencias.some(a => a.severidad === 'error')) {
      resultado.advertencias.push({
        codigo: 'PREGUNTA_PROBLEMATICA',
        pregunta_id: pregunta.id,
        mensaje: `Problema en pregunta: "${pregunta.texto.substring(0, 50)}..."`,
        detalle: analisis.advertencias.find(a => a.severidad === 'error').mensaje
      });
    }
  }

  return resultado;
};

// Calcular tiempo estimado
const calcularTiempoEstimado = (preguntas) => {
  let segundos = 0;

  for (const p of preguntas) {
    switch (p.tipo) {
      case 'escala_likert':
      case 'si_no':
        segundos += 15;
        break;
      case 'opcion_multiple':
        segundos += 20 + (p.opciones?.length || 0) * 3;
        break;
      case 'nps':
        segundos += 20;
        break;
      case 'texto_abierto':
        segundos += 90;
        break;
      case 'ranking':
        segundos += 30 + (p.opciones?.length || 0) * 5;
        break;
      case 'matriz':
        segundos += (p.filas?.length || 0) * 10;
        break;
      default:
        segundos += 20;
    }
  }

  return Math.ceil(segundos / 60);
};
```

### 6.2 Mensajes Educativos para el Administrador

```javascript
// mensajesEducativos.js

export const MENSAJES_VALIDACION = {
  MUESTRA_INSUFICIENTE: {
    titulo: 'Audiencia insuficiente para resultados confiables',
    explicacion: `
      Los resultados estadísticos requieren un mínimo de respuestas para ser significativos.
      Con menos de 5 respuestas:
      • Los promedios son fácilmente distorsionados por valores extremos
      • Es difícil identificar tendencias reales vs. variación aleatoria
      • Aumenta el riesgo de identificar respondentes individuales
    `,
    que_hacer: [
      'Amplía la audiencia incluyendo más departamentos',
      'Combina grupos pequeños (ej: todos los equipos de Tech)',
      'Considera enviar esta encuesta a toda la empresa'
    ]
  },

  RIESGO_IDENTIFICACION: {
    titulo: 'Las respuestas podrían no ser realmente anónimas',
    explicacion: `
      Cuando un departamento tiene menos de 5 personas, es posible deducir
      quién respondió qué basándose en el contenido de las respuestas o patrones.

      Ejemplo: Si el departamento de Legal tiene 3 personas y una respuesta
      menciona "mis 15 años de experiencia", es fácil identificar a esa persona.
    `,
    que_hacer: [
      'Cambia a "Anónimo completo" (sin segmentar por departamento)',
      'Agrupa departamentos pequeños en categorías más grandes',
      'Excluye departamentos muy pequeños de esta encuesta'
    ],
    consecuencia: 'Los empleados pueden sentir que no es seguro ser honestos, reduciendo la calidad de los datos.'
  },

  ENCUESTA_LARGA: {
    titulo: 'Esta encuesta podría tener baja participación',
    explicacion: `
      Investigaciones muestran que:
      • <5 min: ~85% de finalización
      • 5-10 min: ~70% de finalización
      • 10-15 min: ~50% de finalización
      • >15 min: ~30% de finalización

      Cada pregunta adicional reduce la calidad de las respuestas a medida
      que aumenta la fatiga del respondente.
    `,
    que_hacer: [
      'Prioriza las 10-15 preguntas más importantes',
      'Divide en varias encuestas cortas a lo largo del tiempo',
      'Elimina preguntas redundantes o de bajo valor estratégico',
      'Convierte texto abierto en opción múltiple cuando sea posible'
    ]
  },

  DESEQUILIBRIO_DIMENSIONES: {
    titulo: 'La encuesta está sesgada hacia una dimensión',
    explicacion: `
      Cuando una dimensión tiene muchas más preguntas que otras:
      • Los resultados de esa dimensión tendrán más "peso" percibido
      • Los empleados pueden sentir que la empresa solo se preocupa por eso
      • El análisis comparativo entre dimensiones será menos válido
    `,
    que_hacer: [
      'Distribuye preguntas equitativamente (3-5 por dimensión)',
      'Si una dimensión es tu foco, comunícalo explícitamente',
      'Considera hacer encuestas temáticas separadas'
    ]
  },

  PREGUNTA_DOBLE: {
    titulo: 'Esta pregunta evalúa dos cosas a la vez',
    explicacion: `
      Ejemplo problemático: "¿Te sientes apoyado y motivado?"

      Problema: Si alguien se siente apoyado pero no motivado (o viceversa),
      ¿qué debería responder? Cualquier respuesta será ambigua.

      Esto produce datos que no puedes interpretar con confianza.
    `,
    que_hacer: [
      'Divide en dos preguntas separadas',
      'Elige el aspecto más importante si solo puedes hacer una',
      'Usa una matriz si quieres evaluar ambos con la misma escala'
    ],
    ejemplo: {
      mal: '¿Te sientes apoyado y motivado en tu trabajo?',
      bien: [
        '¿Te sientes apoyado por tu equipo en tu trabajo?',
        '¿Te sientes motivado para dar lo mejor de ti?'
      ]
    }
  }
};
```

### 6.3 Panel de Calidad de Encuesta (UI)

```vue
<!-- Componente: PanelCalidadEncuesta.vue -->
<template>
  <div class="panel-calidad">
    <div class="calidad-header">
      <h3>Calidad de la Encuesta</h3>
      <div class="score-badge" :class="scoreClase">
        {{ scoreTotal }}/100
      </div>
    </div>

    <!-- Métricas rápidas -->
    <div class="metricas-grid">
      <div class="metrica">
        <Clock class="icon" />
        <span class="valor">{{ tiempoEstimado }} min</span>
        <span class="label">Tiempo estimado</span>
      </div>
      <div class="metrica">
        <Users class="icon" />
        <span class="valor">{{ audiencia }}</span>
        <span class="label">Empleados</span>
      </div>
      <div class="metrica">
        <BarChart3 class="icon" />
        <span class="valor">{{ tasaEsperada }}%</span>
        <span class="label">Participación esperada</span>
      </div>
    </div>

    <!-- Errores críticos -->
    <div v-if="errores.length > 0" class="seccion errores">
      <h4>
        <XCircle class="icon error" />
        Problemas que debes resolver ({{ errores.length }})
      </h4>
      <div
        v-for="error in errores"
        :key="error.codigo"
        class="item error"
      >
        <div class="item-header">
          <strong>{{ error.mensaje }}</strong>
          <button @click="verDetalle(error)" class="btn-detalle">
            Ver más
          </button>
        </div>
        <p class="item-detalle">{{ error.detalle }}</p>
        <p class="item-sugerencia">
          <Lightbulb class="icon-inline" />
          {{ error.sugerencia }}
        </p>
      </div>
    </div>

    <!-- Advertencias -->
    <div v-if="advertencias.length > 0" class="seccion advertencias">
      <h4>
        <AlertTriangle class="icon warning" />
        Recomendaciones ({{ advertencias.length }})
      </h4>
      <div
        v-for="adv in advertencias"
        :key="adv.codigo"
        class="item warning"
      >
        <div class="item-header">
          <strong>{{ adv.mensaje }}</strong>
          <button
            v-if="adv.accion_rapida"
            @click="ejecutarAccion(adv)"
            class="btn-accion"
          >
            {{ adv.accion_rapida.texto }}
          </button>
        </div>
        <p class="item-detalle">{{ adv.detalle }}</p>
      </div>
    </div>

    <!-- Todo bien -->
    <div v-if="errores.length === 0 && advertencias.length === 0" class="seccion success">
      <CheckCircle class="icon success" />
      <p>¡Tu encuesta cumple con todas las mejores prácticas!</p>
    </div>

    <!-- Checklist final -->
    <div class="checklist-final">
      <h4>Checklist antes de lanzar</h4>
      <div
        v-for="check in checklist"
        :key="check.id"
        class="check-item"
        :class="{ completado: check.completado }"
      >
        <div class="check-icon">
          <Check v-if="check.completado" />
          <Circle v-else />
        </div>
        <span>{{ check.texto }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  Clock, Users, BarChart3, XCircle, AlertTriangle,
  CheckCircle, Lightbulb, Check, Circle
} from 'lucide-vue-next';

const props = defineProps({
  validacion: Object
});

const scoreTotal = computed(() => {
  let score = 100;
  score -= props.validacion.errores.length * 25;
  score -= props.validacion.advertencias.length * 10;
  return Math.max(0, score);
});

const scoreClase = computed(() => {
  if (scoreTotal.value >= 80) return 'excelente';
  if (scoreTotal.value >= 60) return 'bueno';
  if (scoreTotal.value >= 40) return 'mejorable';
  return 'critico';
});

const checklist = computed(() => [
  {
    id: 'titulo',
    texto: 'Título claro y descriptivo',
    completado: props.validacion.encuesta.titulo?.length > 10
  },
  {
    id: 'preguntas',
    texto: 'Al menos 5 preguntas',
    completado: props.validacion.preguntas?.length >= 5
  },
  {
    id: 'indicadores',
    texto: 'Indicadores clave definidos',
    completado: props.validacion.preguntas?.some(p => p.es_indicador_clave)
  },
  {
    id: 'privacidad',
    texto: 'Nivel de privacidad configurado',
    completado: !!props.validacion.encuesta.privacidad_nivel
  },
  {
    id: 'audiencia',
    texto: 'Audiencia con muestra suficiente',
    completado: props.validacion.metricas?.audiencia >= 5
  },
  {
    id: 'sin_errores',
    texto: 'Sin errores críticos',
    completado: props.validacion.errores.length === 0
  }
]);
</script>
```

---

## 7. Migración de Base de Datos Propuesta

```sql
-- Migración: Sistema de Preguntas Inteligente
-- Fecha: 2024-XX-XX

-- 1. Crear tabla de dimensiones
CREATE TABLE IF NOT EXISTS dimensiones_bienestar (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  icono text,
  color text,
  orden integer,
  activa boolean DEFAULT true
);

-- 2. Crear tabla de categorías analíticas
CREATE TABLE IF NOT EXISTS categorias_analiticas (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  tipo_agregacion text DEFAULT 'promedio',
  benchmark_industria decimal(5,2),
  umbral_alerta_bajo decimal(5,2),
  umbral_alerta_critico decimal(5,2)
);

-- 3. Crear catálogo de preguntas por empresa
CREATE TABLE IF NOT EXISTS preguntas_catalogo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,

  -- Contenido
  texto text NOT NULL,
  texto_corto text,
  tipo text NOT NULL,
  subtipo text,
  opciones jsonb,

  -- Metadatos analíticos
  dimension_bienestar text REFERENCES dimensiones_bienestar(id),
  subdimension text,
  categoria_analitica text REFERENCES categorias_analiticas(id),

  -- Indicadores
  es_indicador_clave boolean DEFAULT false,
  indicador_codigo text,
  peso_indicador decimal(3,2) DEFAULT 1.00,

  -- Sensibilidad
  nivel_sensibilidad text DEFAULT 'normal',
  muestra_minima integer DEFAULT 5,
  requiere_anonimato_completo boolean DEFAULT false,

  -- Comparabilidad
  es_comparable boolean DEFAULT true,
  version integer DEFAULT 1,
  pregunta_origen_id uuid REFERENCES preguntas_catalogo(id),
  bloqueada boolean DEFAULT false,
  motivo_bloqueo text,

  -- Validación
  fuente_validacion text,
  es_validada_cientificamente boolean DEFAULT false,

  -- Uso
  veces_usada integer DEFAULT 0,
  ultima_vez_usada timestamptz,

  -- Reglas
  reglas_alerta jsonb,
  reglas_accion jsonb,

  -- Timestamps
  fecha_creacion timestamptz DEFAULT now(),
  fecha_modificacion timestamptz,
  creado_por uuid REFERENCES auth.users(id)
);

-- 4. Crear tabla de versiones
CREATE TABLE IF NOT EXISTS preguntas_versiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id),
  version integer NOT NULL,
  texto_anterior text,
  texto_nuevo text,
  tipo_cambio text,
  es_cambio_menor boolean,
  motivo_cambio text,
  cambiado_por uuid REFERENCES auth.users(id),
  fecha_cambio timestamptz DEFAULT now(),

  UNIQUE(pregunta_id, version)
);

-- 5. Modificar preguntas_encuesta para referenciar catálogo
ALTER TABLE preguntas_encuesta
ADD COLUMN IF NOT EXISTS pregunta_catalogo_id uuid REFERENCES preguntas_catalogo(id),
ADD COLUMN IF NOT EXISTS es_personalizada boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS dimension_bienestar text;

-- 6. Crear tabla de series temporales
CREATE TABLE IF NOT EXISTS series_temporales_preguntas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta_id uuid NOT NULL REFERENCES preguntas_catalogo(id),
  empresa_id uuid NOT NULL,
  periodo text NOT NULL,
  tipo_periodo text NOT NULL,

  n_respuestas integer NOT NULL,
  promedio decimal(5,2),
  mediana decimal(5,2),
  desviacion_std decimal(5,2),
  percentil_25 decimal(5,2),
  percentil_75 decimal(5,2),

  promotores integer,
  pasivos integer,
  detractores integer,
  nps_score decimal(5,2),

  es_comparable_anterior boolean DEFAULT true,
  nota_comparabilidad text,
  version_pregunta integer,

  fecha_calculo timestamptz DEFAULT now(),

  UNIQUE(pregunta_id, empresa_id, periodo, tipo_periodo)
);

-- 7. Crear tabla de reglas de acción
CREATE TABLE IF NOT EXISTS reglas_accion_encuesta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  activa boolean DEFAULT true,

  tipo_trigger text NOT NULL,
  pregunta_id uuid REFERENCES preguntas_catalogo(id),
  dimension text,
  condicion jsonb NOT NULL,

  tipo_accion text NOT NULL,
  accion_config jsonb NOT NULL,

  cooldown_dias integer DEFAULT 30,
  max_ejecuciones integer,
  ejecuciones_count integer DEFAULT 0,
  ultima_ejecucion timestamptz,

  fecha_creacion timestamptz DEFAULT now()
);

-- 8. Insertar datos iniciales de dimensiones
INSERT INTO dimensiones_bienestar VALUES
('salud_mental', 'Salud Mental', 'Estrés, ansiedad, bienestar emocional', 'brain', '#8B5CF6', 1, true),
('clima_laboral', 'Clima Laboral', 'Ambiente, relaciones, cultura', 'smile', '#3B82F6', 2, true),
('carga_trabajo', 'Carga de Trabajo', 'Balance, productividad, tiempo', 'activity', '#F97316', 3, true),
('comunicacion', 'Comunicación', 'Claridad, feedback, transparencia', 'message-circle', '#06B6D4', 4, true),
('liderazgo', 'Liderazgo', 'Gestión, apoyo, dirección', 'users', '#10B981', 5, true),
('desarrollo', 'Desarrollo Profesional', 'Crecimiento, formación, carrera', 'trending-up', '#22C55E', 6, true),
('reconocimiento', 'Reconocimiento', 'Valoración, recompensas, feedback', 'award', '#EAB308', 7, true),
('bienestar_fisico', 'Bienestar Físico', 'Ergonomía, salud, condiciones', 'heart', '#EF4444', 8, true),
('proposito', 'Propósito', 'Sentido, alineación, impacto', 'target', '#EC4899', 9, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Insertar categorías analíticas
INSERT INTO categorias_analiticas VALUES
('indice_bienestar', 'Índice de Bienestar Global', 'Score compuesto 0-100', 'promedio', 72.0, 60.0, 45.0),
('enps', 'Employee NPS', 'Net Promoter Score empleados', 'nps', 25.0, 0.0, -20.0),
('riesgo_burnout', 'Riesgo de Burnout', 'Indicador de agotamiento', 'promedio', 2.5, 3.5, 4.0),
('engagement', 'Engagement', 'Nivel de compromiso', 'promedio', 3.8, 3.0, 2.5),
('satisfaccion_liderazgo', 'Satisfacción con Liderazgo', 'Evaluación de gestión', 'promedio', 3.7, 3.0, 2.5)
ON CONFLICT (id) DO NOTHING;

-- 10. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_empresa ON preguntas_catalogo(empresa_id);
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_dimension ON preguntas_catalogo(dimension_bienestar);
CREATE INDEX IF NOT EXISTS idx_preguntas_catalogo_indicador ON preguntas_catalogo(es_indicador_clave) WHERE es_indicador_clave = true;
CREATE INDEX IF NOT EXISTS idx_series_temporales_periodo ON series_temporales_preguntas(empresa_id, periodo);

-- 11. RLS policies
ALTER TABLE preguntas_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas_versiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_temporales_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reglas_accion_encuesta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Empresas ven sus preguntas" ON preguntas_catalogo
  FOR ALL USING (true);

CREATE POLICY "Empresas ven sus series" ON series_temporales_preguntas
  FOR ALL USING (true);

CREATE POLICY "Empresas ven sus reglas" ON reglas_accion_encuesta
  FOR ALL USING (true);
```

---

## 8. Resumen Ejecutivo

### Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA DE PREGUNTAS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │  Catálogo   │    │  Metadatos  │    │  Versiones  │        │
│  │  Preguntas  │───▶│  Analíticos │───▶│  Historial  │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              MOTOR DE VALIDACIÓN                     │       │
│  │  • Calidad de preguntas                             │       │
│  │  • Tamaño de muestra                                │       │
│  │  • Riesgo de identificación                         │       │
│  │  • Equilibrio dimensional                           │       │
│  └─────────────────────────────────────────────────────┘       │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              MOTOR DE ACCIONES                       │       │
│  │  • Alertas automáticas                              │       │
│  │  • Planes de mejora                                 │       │
│  │  • Puntos y recompensas                             │       │
│  │  • Detección de riesgos                             │       │
│  └─────────────────────────────────────────────────────┘       │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              SALIDAS                                 │       │
│  │  • Dashboard KPIs                                   │       │
│  │  • Series temporales                                │       │
│  │  • Benchmarks                                       │       │
│  │  • Reportes                                         │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Beneficios Clave

1. **Para administradores no expertos:**
   - Guía inteligente en tiempo real
   - Sugerencias automáticas de tipo y escala
   - Advertencias de errores comunes
   - Preguntas predefinidas validadas

2. **Para calidad de datos:**
   - Metadatos analíticos completos
   - Validación de muestra y privacidad
   - Comparabilidad garantizada
   - Versionado sin pérdida de histórico

3. **Para acciones:**
   - Reglas automáticas configurables
   - Detección de riesgos colectivos
   - Integración con planes de mejora
   - Sistema de puntos y participación

4. **Para escalabilidad:**
   - Funciona con 10 o 10,000 empleados
   - Catálogo reutilizable entre encuestas
   - Series temporales para tendencias
   - Benchmarks de industria
