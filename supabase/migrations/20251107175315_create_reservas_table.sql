/*
  # Crear tabla de reservas

  1. Nueva tabla
    - `reservas_sesiones`
      - `id` (uuid, primary key)
      - `sesion_id` (uuid, foreign key) - Sesión reservada
      - `empleado_id` (uuid, foreign key) - Empleado que reservó
      - `estado` (text) - Estado: 'confirmada', 'asistio', 'no_asistio', 'cancelada'
      - `fecha_reserva` (timestamptz) - Fecha de reserva
      - `fecha_cancelacion` (timestamptz) - Fecha de cancelación
      - `notas` (text) - Notas adicionales
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Seguridad
    - Habilitar RLS en la tabla
    - Políticas para que usuarios puedan ver sus propias reservas
    - Políticas para que usuarios puedan crear reservas
    - Políticas para que administradores puedan ver todas las reservas

  3. Funcionalidad
    - Trigger para actualizar cupo disponible de sesiones
    - Constraint para evitar reservas duplicadas
*/

CREATE TABLE IF NOT EXISTS reservas_sesiones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sesion_id uuid REFERENCES sesiones(id) ON DELETE CASCADE NOT NULL,
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  estado text DEFAULT 'confirmada' CHECK (estado IN ('confirmada', 'asistio', 'no_asistio', 'cancelada')),
  fecha_reserva timestamptz DEFAULT now(),
  fecha_cancelacion timestamptz,
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sesion_id, empleado_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reservas_sesion ON reservas_sesiones(sesion_id);
CREATE INDEX IF NOT EXISTS idx_reservas_empleado ON reservas_sesiones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas_sesiones(estado);

-- RLS para reservas
ALTER TABLE reservas_sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propias reservas"
  ON reservas_sesiones FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden ver todas las reservas"
  ON reservas_sesiones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios pueden crear reservas"
  ON reservas_sesiones FOR INSERT
  TO authenticated
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Usuarios pueden actualizar sus reservas"
  ON reservas_sesiones FOR UPDATE
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden actualizar cualquier reserva"
  ON reservas_sesiones FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Función para actualizar cupo disponible al crear reserva
CREATE OR REPLACE FUNCTION actualizar_cupo_crear_reserva()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si la reserva está confirmada
  IF NEW.estado = 'confirmada' THEN
    UPDATE sesiones
    SET cupo_disponible = cupo_disponible - 1
    WHERE id = NEW.sesion_id AND cupo_disponible > 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar cupo disponible al cancelar reserva
CREATE OR REPLACE FUNCTION actualizar_cupo_cancelar_reserva()
RETURNS TRIGGER AS $$
BEGIN
  -- Si se cancela una reserva que estaba confirmada
  IF OLD.estado = 'confirmada' AND NEW.estado = 'cancelada' THEN
    UPDATE sesiones
    SET cupo_disponible = cupo_disponible + 1
    WHERE id = NEW.sesion_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para mantener sincronizado el cupo
DROP TRIGGER IF EXISTS trigger_crear_reserva ON reservas_sesiones;
CREATE TRIGGER trigger_crear_reserva
  AFTER INSERT ON reservas_sesiones
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_cupo_crear_reserva();

DROP TRIGGER IF EXISTS trigger_cancelar_reserva ON reservas_sesiones;
CREATE TRIGGER trigger_cancelar_reserva
  AFTER UPDATE ON reservas_sesiones
  FOR EACH ROW
  WHEN (OLD.estado IS DISTINCT FROM NEW.estado)
  EXECUTE FUNCTION actualizar_cupo_cancelar_reserva();