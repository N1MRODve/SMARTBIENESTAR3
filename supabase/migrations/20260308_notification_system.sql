-- Sistema de notificaciones por email
-- Tabla para tracking de notificaciones enviadas

CREATE TABLE IF NOT EXISTS notificaciones_email (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('nueva_encuesta', 'recordatorio_encuesta', 'nuevo_comunicado', 'encuesta_cerrada')),
  referencia_id UUID, -- ID de la encuesta o comunicado
  destinatarios_count INTEGER DEFAULT 0,
  enviados_count INTEGER DEFAULT 0,
  fallidos_count INTEGER DEFAULT 0,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviando', 'completado', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_empresa ON notificaciones_email(empresa_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_tipo ON notificaciones_email(tipo);
CREATE INDEX IF NOT EXISTS idx_notificaciones_email_referencia ON notificaciones_email(referencia_id);

-- RLS para notificaciones
ALTER TABLE notificaciones_email ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden ver notificaciones de su empresa"
ON notificaciones_email
FOR SELECT
USING (
  empresa_id IN (
    SELECT empresa_id FROM empleados
    WHERE auth_user_id = auth.uid() AND es_admin = true
  )
);

-- Tabla de preferencias de notificación por colaborador
CREATE TABLE IF NOT EXISTS preferencias_notificacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id UUID REFERENCES empleados(id) ON DELETE CASCADE UNIQUE,
  recibir_encuestas BOOLEAN DEFAULT true,
  recibir_recordatorios BOOLEAN DEFAULT true,
  recibir_comunicados BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preferencias_empleado ON preferencias_notificacion(empleado_id);

ALTER TABLE preferencias_notificacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Colaboradores pueden ver sus preferencias"
ON preferencias_notificacion
FOR SELECT
USING (
  empleado_id IN (
    SELECT id FROM empleados WHERE auth_user_id = auth.uid()
  )
);

CREATE POLICY "Colaboradores pueden actualizar sus preferencias"
ON preferencias_notificacion
FOR UPDATE
USING (
  empleado_id IN (
    SELECT id FROM empleados WHERE auth_user_id = auth.uid()
  )
);

CREATE POLICY "Crear preferencias para nuevos colaboradores"
ON preferencias_notificacion
FOR INSERT
WITH CHECK (
  empleado_id IN (
    SELECT id FROM empleados WHERE auth_user_id = auth.uid()
  )
);

-- Función para registrar notificación enviada
CREATE OR REPLACE FUNCTION registrar_notificacion(
  p_empresa_id UUID,
  p_tipo TEXT,
  p_referencia_id UUID,
  p_destinatarios INTEGER,
  p_enviados INTEGER,
  p_fallidos INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO notificaciones_email (
    empresa_id, tipo, referencia_id,
    destinatarios_count, enviados_count, fallidos_count,
    estado, completed_at
  ) VALUES (
    p_empresa_id, p_tipo, p_referencia_id,
    p_destinatarios, p_enviados, p_fallidos,
    'completado', NOW()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

COMMENT ON TABLE notificaciones_email IS 'Registro de notificaciones por email enviadas';
COMMENT ON TABLE preferencias_notificacion IS 'Preferencias de notificación por colaborador';
