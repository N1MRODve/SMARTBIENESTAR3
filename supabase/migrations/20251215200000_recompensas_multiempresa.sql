/*
  # Migración: Soporte Multiempresa para Recompensas

  ## Cambios:
  1. Añadir empresa_id a tabla recompensas
  2. Crear tabla actividades_puntos para configurar cómo ganar puntos por empresa
  3. Actualizar políticas RLS para filtrado por empresa
  4. Crear funciones helper para consultas de empleados

  ## Seguridad:
  - Empleados solo ven recompensas de su empresa
  - Puntos y canjes filtrados por empresa
*/

-- ============================================
-- 1. Añadir empresa_id a recompensas
-- ============================================

ALTER TABLE recompensas
ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;

-- Índice para búsquedas por empresa
CREATE INDEX IF NOT EXISTS idx_recompensas_empresa ON recompensas(empresa_id);

-- ============================================
-- 2. Tabla de configuración de actividades de puntos por empresa
-- ============================================

CREATE TABLE IF NOT EXISTS actividades_puntos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  codigo text NOT NULL,
  nombre text NOT NULL,
  descripcion text,
  puntos integer NOT NULL DEFAULT 0,
  icono text DEFAULT '⭐',
  activa boolean DEFAULT true,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(empresa_id, codigo)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_actividades_puntos_empresa ON actividades_puntos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_actividades_puntos_codigo ON actividades_puntos(codigo);

-- RLS
ALTER TABLE actividades_puntos ENABLE ROW LEVEL SECURITY;

-- Empleados ven actividades de su empresa o globales (empresa_id = null)
CREATE POLICY "Ver actividades de puntos de mi empresa"
  ON actividades_puntos FOR SELECT
  TO authenticated
  USING (
    empresa_id IS NULL
    OR empresa_id IN (
      SELECT empresa_id FROM empleados WHERE auth_user_id = auth.uid()
    )
  );

-- Admins pueden gestionar
CREATE POLICY "Admins gestionan actividades de puntos"
  ON actividades_puntos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
    )
  );

-- ============================================
-- 3. Insertar actividades de puntos globales (para todas las empresas)
-- ============================================

INSERT INTO actividades_puntos (empresa_id, codigo, nombre, descripcion, puntos, icono, orden)
VALUES
  (NULL, 'ENCUESTA_COMPLETADA', 'Encuesta completada', 'Responde una encuesta de bienestar', 50, '📋', 1),
  (NULL, 'RESPUESTA_RAPIDA', 'Respuesta rápida', 'Responde dentro de las primeras 24 horas', 25, '⚡', 2),
  (NULL, 'RESERVAR_SESION', 'Reservar sesión', 'Reserva una sesión de bienestar', 30, '📅', 3),
  (NULL, 'ASISTIR_SESION', 'Asistencia a sesión', 'Asiste a una sesión reservada', 100, '✅', 4),
  (NULL, 'PARTICIPACION_MENSUAL', 'Participación mensual', 'Participa activamente durante el mes', 200, '🏆', 5),
  (NULL, 'SUGERENCIA_IMPLEMENTADA', 'Sugerencia implementada', 'Tu sugerencia fue implementada', 300, '💡', 6),
  (NULL, 'PRIMERA_SESION_APOYO', 'Primera sesión de apoyo', 'Completa tu primera sesión de apoyo personal', 75, '❤️', 7),
  (NULL, 'COMPLETAR_PERFIL', 'Completar perfil', 'Completa tu información de perfil', 25, '👤', 8)
ON CONFLICT (empresa_id, codigo) DO NOTHING;

-- ============================================
-- 4. Actualizar RLS de recompensas para multiempresa
-- ============================================

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer recompensas activas" ON recompensas;

-- Nueva política: empleados ven recompensas de su empresa o globales
CREATE POLICY "Ver recompensas de mi empresa"
  ON recompensas FOR SELECT
  TO authenticated
  USING (
    activa = true
    AND (
      empresa_id IS NULL
      OR empresa_id IN (
        SELECT empresa_id FROM empleados WHERE auth_user_id = auth.uid()
      )
    )
  );

-- ============================================
-- 5. Función RPC: Obtener datos completos de recompensas para empleado
-- ============================================

CREATE OR REPLACE FUNCTION get_empleado_recompensas_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id uuid;
  v_empresa_id uuid;
  v_puntos integer;
  v_result JSON;
BEGIN
  -- Obtener datos del empleado actual
  SELECT id, empresa_id, puntos INTO v_empleado_id, v_empresa_id, v_puntos
  FROM empleados
  WHERE auth_user_id = auth.uid();

  IF v_empleado_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Empleado no encontrado'
    );
  END IF;

  -- Construir respuesta completa
  SELECT json_build_object(
    'success', true,
    'empleado', json_build_object(
      'id', v_empleado_id,
      'puntos', COALESCE(v_puntos, 0)
    ),
    'actividades_puntos', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'codigo', codigo,
          'nombre', nombre,
          'descripcion', descripcion,
          'puntos', puntos,
          'icono', icono
        ) ORDER BY orden
      ), '[]'::json)
      FROM actividades_puntos
      WHERE activa = true
      AND (empresa_id IS NULL OR empresa_id = v_empresa_id)
    ),
    'recompensas', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', r.id,
          'nombre', r.nombre,
          'descripcion', r.descripcion,
          'categoria', r.categoria,
          'costo_puntos', r.costo_puntos,
          'stock', r.stock,
          'imagen_url', r.imagen_url,
          'disponible', CASE
            WHEN r.stock = -1 THEN true
            WHEN r.stock > 0 THEN true
            ELSE false
          END,
          'puede_canjear', CASE
            WHEN r.stock = 0 THEN false
            WHEN COALESCE(v_puntos, 0) >= r.costo_puntos THEN true
            ELSE false
          END
        ) ORDER BY r.costo_puntos
      ), '[]'::json)
      FROM recompensas r
      WHERE r.activa = true
      AND (r.empresa_id IS NULL OR r.empresa_id = v_empresa_id)
    ),
    'historial_canjes', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', c.id,
          'recompensa_nombre', r.nombre,
          'recompensa_categoria', r.categoria,
          'puntos_gastados', c.puntos_gastados,
          'estado', c.estado,
          'fecha_canje', c.fecha_canje
        ) ORDER BY c.fecha_canje DESC
      ), '[]'::json)
      FROM canjes_recompensas c
      JOIN recompensas r ON r.id = c.recompensa_id
      WHERE c.empleado_id = v_empleado_id
      LIMIT 20
    ),
    'historial_puntos', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', t.id,
          'cantidad', t.cantidad,
          'tipo', t.tipo,
          'motivo', t.motivo,
          'fecha', t.created_at
        ) ORDER BY t.created_at DESC
      ), '[]'::json)
      FROM transacciones_puntos t
      WHERE t.empleado_id = v_empleado_id
      LIMIT 30
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================
-- 6. Función RPC: Canjear recompensa (con validaciones)
-- ============================================

CREATE OR REPLACE FUNCTION canjear_recompensa(p_recompensa_id uuid)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id uuid;
  v_empresa_id uuid;
  v_puntos integer;
  v_recompensa RECORD;
  v_canje_id uuid;
BEGIN
  -- Obtener empleado actual
  SELECT id, empresa_id, puntos INTO v_empleado_id, v_empresa_id, v_puntos
  FROM empleados
  WHERE auth_user_id = auth.uid();

  IF v_empleado_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Empleado no encontrado');
  END IF;

  -- Obtener recompensa
  SELECT * INTO v_recompensa
  FROM recompensas
  WHERE id = p_recompensa_id
  AND activa = true
  AND (empresa_id IS NULL OR empresa_id = v_empresa_id);

  IF v_recompensa IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Recompensa no encontrada o no disponible');
  END IF;

  -- Verificar stock
  IF v_recompensa.stock = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Esta recompensa no tiene stock disponible');
  END IF;

  -- Verificar puntos suficientes
  IF COALESCE(v_puntos, 0) < v_recompensa.costo_puntos THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No tienes suficientes puntos',
      'puntos_actuales', COALESCE(v_puntos, 0),
      'puntos_requeridos', v_recompensa.costo_puntos
    );
  END IF;

  -- Crear canje
  INSERT INTO canjes_recompensas (empleado_id, recompensa_id, puntos_gastados, estado)
  VALUES (v_empleado_id, p_recompensa_id, v_recompensa.costo_puntos, 'pendiente')
  RETURNING id INTO v_canje_id;

  -- Crear transacción de puntos (negativa)
  INSERT INTO transacciones_puntos (empleado_id, cantidad, tipo, motivo, referencia_id, referencia_tipo)
  VALUES (
    v_empleado_id,
    -v_recompensa.costo_puntos,
    'gastados',
    'Canje de recompensa: ' || v_recompensa.nombre,
    v_canje_id,
    'canje'
  );

  -- Actualizar stock si no es ilimitado
  IF v_recompensa.stock > 0 THEN
    UPDATE recompensas
    SET stock = stock - 1
    WHERE id = p_recompensa_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'canje_id', v_canje_id,
    'recompensa', v_recompensa.nombre,
    'puntos_gastados', v_recompensa.costo_puntos,
    'puntos_restantes', COALESCE(v_puntos, 0) - v_recompensa.costo_puntos
  );
END;
$$;

-- ============================================
-- 7. Grant permisos a las funciones RPC
-- ============================================

GRANT EXECUTE ON FUNCTION get_empleado_recompensas_data() TO authenticated;
GRANT EXECUTE ON FUNCTION canjear_recompensa(uuid) TO authenticated;
