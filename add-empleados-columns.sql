-- Agregar columnas necesarias para las mejoras UX en EmpleadosView
-- Se ejecuta de forma segura verificando si las columnas ya existen

-- Columna para rastrear último acceso del empleado
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'ultimo_acceso'
  ) THEN
    ALTER TABLE empleados ADD COLUMN ultimo_acceso TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN empleados.ultimo_acceso IS 'Último acceso del empleado a la plataforma';
  END IF;
END $$;

-- Columna para almacenar la fecha de envío de invitación
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'invitacion_enviada_at'
  ) THEN
    ALTER TABLE empleados ADD COLUMN invitacion_enviada_at TIMESTAMP WITH TIME ZONE;
    COMMENT ON COLUMN empleados.invitacion_enviada_at IS 'Fecha de último envío de invitación';
  END IF;
END $$;

-- Columna para nivel de participación (calculado)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'participacion_nivel'
  ) THEN
    ALTER TABLE empleados ADD COLUMN participacion_nivel TEXT DEFAULT 'nuevo';
    COMMENT ON COLUMN empleados.participacion_nivel IS 'Nivel de participación: nuevo, iniciado, activo, avanzado, experto';
  END IF;
END $$;

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_empleados_ultimo_acceso ON empleados(ultimo_acceso);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON empleados(estado);
CREATE INDEX IF NOT EXISTS idx_empleados_puntos ON empleados(puntos);

-- Actualizar nivel de participación basado en puntos existentes
UPDATE empleados
SET participacion_nivel = CASE
  WHEN puntos >= 100 THEN 'experto'
  WHEN puntos >= 50 THEN 'avanzado'
  WHEN puntos >= 10 THEN 'activo'
  WHEN puntos > 0 THEN 'iniciado'
  ELSE 'nuevo'
END
WHERE participacion_nivel IS NULL OR participacion_nivel = 'nuevo';

-- Función para actualizar automáticamente el nivel de participación cuando cambian los puntos
CREATE OR REPLACE FUNCTION actualizar_nivel_participacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.participacion_nivel := CASE
    WHEN NEW.puntos >= 100 THEN 'experto'
    WHEN NEW.puntos >= 50 THEN 'avanzado'
    WHEN NEW.puntos >= 10 THEN 'activo'
    WHEN NEW.puntos > 0 THEN 'iniciado'
    ELSE 'nuevo'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para ejecutar la función antes de insertar o actualizar
DROP TRIGGER IF EXISTS trigger_actualizar_nivel_participacion ON empleados;
CREATE TRIGGER trigger_actualizar_nivel_participacion
  BEFORE INSERT OR UPDATE OF puntos ON empleados
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_nivel_participacion();

-- Comentario final
COMMENT ON TABLE empleados IS 'Tabla de empleados con mejoras UX: último acceso, nivel de participación y control de invitaciones';
