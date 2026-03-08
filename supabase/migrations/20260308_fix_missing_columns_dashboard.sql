-- Migración para corregir columnas faltantes que causan errores 400 en el Dashboard
-- Fecha: 2026-03-08

-- ============================================================================
-- 1. Añadir columna 'categoria' a preguntas_encuesta
-- ============================================================================
-- Esta columna es necesaria para calcular métricas de bienestar por categoría

ALTER TABLE preguntas_encuesta
ADD COLUMN IF NOT EXISTS categoria TEXT;

-- Añadir comentario explicativo
COMMENT ON COLUMN preguntas_encuesta.categoria IS 'Categoría de bienestar: salud_mental, clima_laboral, balance_vida_trabajo, satisfaccion_laboral, ambiente_laboral, etc.';

-- ============================================================================
-- 2. Añadir columna 'empresa_id' a solicitudes_servicios
-- ============================================================================
-- Esta columna es necesaria para filtrar solicitudes por empresa

ALTER TABLE solicitudes_servicios
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE;

-- Crear índice para mejorar rendimiento de consultas por empresa
CREATE INDEX IF NOT EXISTS idx_solicitudes_servicios_empresa_id
ON solicitudes_servicios(empresa_id);

-- Poblar empresa_id desde el empleado relacionado para registros existentes
UPDATE solicitudes_servicios ss
SET empresa_id = e.empresa_id
FROM empleados e
WHERE ss.empleado_id = e.id
AND ss.empresa_id IS NULL;

-- ============================================================================
-- 3. Añadir columna 'fecha_cierre' a encuestas (alias de fecha_fin)
-- ============================================================================
-- El código usa 'fecha_cierre' pero la tabla tiene 'fecha_fin'
-- Creamos una vista o añadimos la columna para compatibilidad

-- Opción: Crear columna calculada virtual no es posible en PostgreSQL
-- Usaremos un trigger para mantener sincronizado fecha_cierre = fecha_fin

ALTER TABLE encuestas
ADD COLUMN IF NOT EXISTS fecha_cierre TIMESTAMP WITH TIME ZONE;

-- Sincronizar valores existentes
UPDATE encuestas
SET fecha_cierre = fecha_fin
WHERE fecha_cierre IS NULL AND fecha_fin IS NOT NULL;

-- Crear función para sincronizar fecha_cierre con fecha_fin
CREATE OR REPLACE FUNCTION sync_fecha_cierre()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_cierre := NEW.fecha_fin;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para mantener sincronización
DROP TRIGGER IF EXISTS trg_sync_fecha_cierre ON encuestas;
CREATE TRIGGER trg_sync_fecha_cierre
BEFORE INSERT OR UPDATE OF fecha_fin ON encuestas
FOR EACH ROW
EXECUTE FUNCTION sync_fecha_cierre();

-- ============================================================================
-- 4. Actualizar políticas RLS para solicitudes_servicios con empresa_id
-- ============================================================================

-- Política para que admins de empresa puedan ver solicitudes de su empresa
DROP POLICY IF EXISTS "Admins pueden ver solicitudes de su empresa" ON solicitudes_servicios;
CREATE POLICY "Admins pueden ver solicitudes de su empresa"
ON solicitudes_servicios
FOR SELECT
USING (
  empresa_id IN (
    SELECT empresa_id FROM empleados
    WHERE auth_user_id = auth.uid() AND es_admin = true
  )
  OR
  empleado_id IN (
    SELECT id FROM empleados WHERE auth_user_id = auth.uid()
  )
);

-- Política para que admins puedan actualizar solicitudes de su empresa
DROP POLICY IF EXISTS "Admins pueden actualizar solicitudes de su empresa" ON solicitudes_servicios;
CREATE POLICY "Admins pueden actualizar solicitudes de su empresa"
ON solicitudes_servicios
FOR UPDATE
USING (
  empresa_id IN (
    SELECT empresa_id FROM empleados
    WHERE auth_user_id = auth.uid() AND es_admin = true
  )
);

-- ============================================================================
-- 5. Crear trigger para auto-poblar empresa_id en nuevas solicitudes
-- ============================================================================

CREATE OR REPLACE FUNCTION set_solicitud_empresa_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.empresa_id IS NULL AND NEW.empleado_id IS NOT NULL THEN
    SELECT empresa_id INTO NEW.empresa_id
    FROM empleados
    WHERE id = NEW.empleado_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_solicitud_empresa_id ON solicitudes_servicios;
CREATE TRIGGER trg_set_solicitud_empresa_id
BEFORE INSERT ON solicitudes_servicios
FOR EACH ROW
EXECUTE FUNCTION set_solicitud_empresa_id();
