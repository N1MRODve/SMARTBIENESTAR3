-- Solicitudes de servicio multi-departamento
-- Permite solicitar servicios para multiples departamentos o toda la empresa

-- Agregar columna departamento a solicitudes_servicios (texto simple para compatibilidad)
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS departamento TEXT;
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS objetivos TEXT;
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS fecha_implementacion DATE;
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS comentarios TEXT;
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS servicio_nombre TEXT;
ALTER TABLE solicitudes_servicios ADD COLUMN IF NOT EXISTS servicio_categoria TEXT;

-- Tabla de destinatarios para solicitudes multi-departamento
CREATE TABLE IF NOT EXISTS solicitudes_servicios_destinatarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id UUID REFERENCES solicitudes_servicios(id) ON DELETE CASCADE,
  departamento_id UUID REFERENCES departamentos(id) ON DELETE CASCADE,
  es_toda_empresa BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Si es_toda_empresa=true, departamento_id puede ser null
  CHECK (es_toda_empresa = true OR departamento_id IS NOT NULL)
);

-- Indices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_sol_dest_solicitud ON solicitudes_servicios_destinatarios(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_sol_dest_departamento ON solicitudes_servicios_destinatarios(departamento_id);

-- RLS para solicitudes_servicios_destinatarios
ALTER TABLE solicitudes_servicios_destinatarios ENABLE ROW LEVEL SECURITY;

-- Admins pueden ver destinatarios de solicitudes de su empresa
CREATE POLICY "Admins pueden ver destinatarios de su empresa"
ON solicitudes_servicios_destinatarios
FOR SELECT
USING (
  solicitud_id IN (
    SELECT id FROM solicitudes_servicios
    WHERE empresa_id IN (
      SELECT empresa_id FROM empleados
      WHERE auth_user_id = auth.uid() AND es_admin = true
    )
  )
);

-- Admins pueden insertar destinatarios para solicitudes de su empresa
CREATE POLICY "Admins pueden crear destinatarios"
ON solicitudes_servicios_destinatarios
FOR INSERT
WITH CHECK (
  solicitud_id IN (
    SELECT id FROM solicitudes_servicios
    WHERE empresa_id IN (
      SELECT empresa_id FROM empleados
      WHERE auth_user_id = auth.uid() AND es_admin = true
    )
  )
);

-- Admins pueden eliminar destinatarios de solicitudes de su empresa
CREATE POLICY "Admins pueden eliminar destinatarios"
ON solicitudes_servicios_destinatarios
FOR DELETE
USING (
  solicitud_id IN (
    SELECT id FROM solicitudes_servicios
    WHERE empresa_id IN (
      SELECT empresa_id FROM empleados
      WHERE auth_user_id = auth.uid() AND es_admin = true
    )
  )
);

COMMENT ON TABLE solicitudes_servicios_destinatarios IS 'Destinatarios (departamentos) de solicitudes de servicio';
COMMENT ON COLUMN solicitudes_servicios_destinatarios.es_toda_empresa IS 'Si true, la solicitud aplica a toda la empresa';
