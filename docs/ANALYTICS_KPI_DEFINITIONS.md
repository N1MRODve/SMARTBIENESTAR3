# Definiciones de KPIs - Sistema de Analítica

Este documento define las métricas utilizadas en el dashboard de analítica ejecutiva de SmartBienestar.

## 1. Métricas de Empleados

### employees_total (Empleados Totales)
- **Definición**: Número de empleados con estado = 'Activo' en la empresa
- **Fuente**: `empleados` WHERE `estado` ILIKE 'activo' AND `empresa_id` = X
- **Período**: Snapshot actual

### employees_active (Empleados Activos)
- **Definición**: Empleados con al menos 1 actividad en el período
- **Actividad válida**:
  - Respuesta a encuesta (`respuestas_encuesta`)
  - Lectura de comunicado (`comunicados_lecturas`)
- **Fuente**: `empleados` con JOIN a tablas de actividad
- **Período**: Últimos 90 días por defecto

### participation_rate (Tasa de Participación)
- **Fórmula**: `(employees_active / employees_total) * 100`
- **Formato**: Porcentaje con 1 decimal
- **Interpretación**:
  - >= 80%: Excelente participación
  - 60-79%: Buena participación
  - 40-59%: Participación moderada
  - < 40%: Baja participación

## 2. Métricas de Encuestas

### surveys_total
- **Definición**: Total de encuestas de la empresa
- **Fuente**: `encuestas` WHERE `empresa_id` = X

### surveys_active
- **Definición**: Encuestas con estado = 'activa'
- **Fuente**: `encuestas` WHERE `estado` ILIKE 'activa'

### surveys_closed (Encuestas Cerradas/Completadas)
- **Definición**: Encuestas con estado = 'cerrada'
- **Fuente**: `encuestas` WHERE `estado` ILIKE 'cerrada'

### survey_responses (Respuestas en Período)
- **Definición**: Total de respuestas a encuestas en el período
- **Fuente**: `respuestas_encuesta` WHERE `created_at` BETWEEN date_from AND date_to
- **Período**: Últimos 90 días por defecto

## 3. Métricas de Comunicados

### communications_sent
- **Definición**: Comunicados enviados/publicados en el período
- **Fuente**: `comunicados` WHERE `estado` IN ('enviado', 'publicado')
- **Período**: Últimos 90 días por defecto

### communications_read
- **Definición**: Total de lecturas de comunicados en el período
- **Fuente**: `comunicados_lecturas` WHERE `created_at` BETWEEN date_from AND date_to
- **Nota**: Cuenta lecturas, no empleados únicos

### read_rate (Tasa de Lectura)
- **Fórmula**: `(communications_read / communications_reach) * 100`
- **communications_reach**: Suma de `alcance_estimado` de comunicados enviados
- **Formato**: Porcentaje con 1 decimal

## 4. Índice de Bienestar

### wellbeing_index (Índice Global de Bienestar)
- **Definición**: Promedio de todas las respuestas numéricas válidas (1-5)
- **Fuente**:
  ```sql
  AVG(respuesta::int)
  FROM respuestas_encuesta
  WHERE respuesta ~ '^[1-5]$'
  ```
- **Rango**: 1.0 - 5.0
- **Interpretación**:
  - >= 4.0: Excelente
  - 3.5 - 3.9: Bueno
  - 3.0 - 3.4: Regular
  - < 3.0: Crítico

### wellbeing_variation (Variación de Bienestar)
- **Fórmula**: `wellbeing_index_actual - wellbeing_index_período_anterior`
- **Período anterior**: Misma duración, inmediatamente antes del período actual
- **Ejemplo**: Si período = últimos 90 días, período anterior = días -180 a -91
- **Formato**: Diferencia con signo (+/-)

## 5. Métricas por Departamento

### department_wellbeing_score
- **Definición**: Promedio de bienestar de empleados del departamento
- **Cálculo**:
  1. Obtener empleados del departamento
  2. Obtener respuestas de esos empleados
  3. Calcular promedio de respuestas numéricas 1-5

### department_participation_rate
- **Fórmula**: `(empleados_con_actividad / empleados_totales_dept) * 100`

### department_trend
- **Valores**: 'up', 'stable', 'down'
- **Criterios**:
  - 'up': wellbeing_score >= 4.0
  - 'down': wellbeing_score < 3.0
  - 'stable': 3.0 <= wellbeing_score < 4.0

## 6. Alertas

### alertas_activas
- **Definición**: Número de departamentos con bienestar crítico
- **Criterio**: Departamentos con `wellbeing_score < 3.0`

## 7. Categorías de Bienestar

Las categorías se derivan del campo `categoria` en `preguntas_encuesta`:

| Categoría | Descripción |
|-----------|-------------|
| Físico | Salud física, ejercicio, alimentación |
| Mental | Salud mental, estrés, bienestar emocional |
| Social | Relaciones, trabajo en equipo, comunicación |
| Financiero | Estabilidad económica, beneficios |
| Profesional | Desarrollo de carrera, formación |

### category_value
- **Definición**: Promedio de respuestas de preguntas de esa categoría
- **Fuente**: `respuestas_encuesta` JOIN `preguntas_encuesta` ON categoria

### category_variation
- **Definición**: Diferencia vs período anterior
- **Cálculo**: Mismo que wellbeing_variation pero por categoría

---

## RPCs Disponibles

### analytics_overview
```sql
analytics_overview(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_department_ids uuid[] DEFAULT NULL
)
```
Retorna JSON con todas las métricas principales.

### analytics_departments_ranking
```sql
analytics_departments_ranking(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_limit int DEFAULT 10
)
```
Retorna array JSON ordenado por wellbeing_score.

### analytics_wellbeing_timeseries
```sql
analytics_wellbeing_timeseries(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL,
  p_granularity text DEFAULT 'month' -- 'week' o 'month'
)
```
Retorna serie temporal para gráficos.

### analytics_categories
```sql
analytics_categories(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
)
```
Retorna métricas por categoría de bienestar.

### analytics_debug
```sql
analytics_debug()
```
Retorna counts directos para verificación.

---

## Notas de Implementación

1. **Multi-tenant**: Todas las queries filtran por `empresa_id` del usuario autenticado
2. **Seguridad**: RPCs son SECURITY DEFINER pero validan internamente
3. **Fallback**: Si RPCs fallan, el servicio usa queries directas
4. **Caché**: Los datos se calculan en tiempo real (sin caché)
5. **Índices**: Ver migración `20251219_analytics_rpcs.sql` para índices de performance
