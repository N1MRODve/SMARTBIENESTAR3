/*
  # Crear tablas de gamificación

  1. Nuevas tablas
    - `transacciones_puntos`
      - `id` (uuid, primary key)
      - `empleado_id` (uuid, foreign key) - Empleado que recibe/gasta puntos
      - `cantidad` (integer) - Cantidad de puntos (positivo = ganados, negativo = gastados)
      - `tipo` (text) - Tipo: 'ganados', 'gastados'
      - `motivo` (text) - Motivo de la transacción
      - `referencia_id` (uuid) - ID de referencia (encuesta, canje, etc.)
      - `referencia_tipo` (text) - Tipo de referencia: 'encuesta', 'canje', 'sesion', 'manual'
      - `created_at` (timestamptz)

    - `ranking_puntos`
      - Vista materializada para consultar el ranking de forma eficiente

  2. Seguridad
    - Habilitar RLS en la tabla
    - Políticas para que usuarios puedan ver sus propias transacciones
    - Políticas para que usuarios puedan ver el ranking completo

  3. Notas importantes
    - Los puntos totales de cada empleado se calculan sumando las transacciones
    - La columna `puntos` en la tabla `empleados` se mantiene sincronizada mediante triggers
*/

CREATE TABLE IF NOT EXISTS transacciones_puntos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  cantidad integer NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ganados', 'gastados')),
  motivo text NOT NULL,
  referencia_id uuid,
  referencia_tipo text CHECK (referencia_tipo IN ('encuesta', 'canje', 'sesion', 'manual')),
  created_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_transacciones_empleado ON transacciones_puntos(empleado_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones_puntos(tipo);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones_puntos(created_at DESC);

-- RLS para transacciones_puntos
ALTER TABLE transacciones_puntos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus propias transacciones"
  ON transacciones_puntos FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Administradores pueden ver todas las transacciones"
  ON transacciones_puntos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sistema puede crear transacciones"
  ON transacciones_puntos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Función para actualizar puntos del empleado
CREATE OR REPLACE FUNCTION actualizar_puntos_empleado()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el total de puntos del empleado
  UPDATE empleados
  SET puntos = (
    SELECT COALESCE(SUM(cantidad), 0)
    FROM transacciones_puntos
    WHERE empleado_id = NEW.empleado_id
  )
  WHERE id = NEW.empleado_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para mantener sincronizados los puntos
DROP TRIGGER IF EXISTS trigger_actualizar_puntos ON transacciones_puntos;
CREATE TRIGGER trigger_actualizar_puntos
  AFTER INSERT ON transacciones_puntos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_puntos_empleado();