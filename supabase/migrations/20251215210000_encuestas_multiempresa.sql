/*
  # Migración: Soporte Multiempresa Completo para Encuestas

  ## Problemas identificados:
  1. Políticas RLS permisivas (USING true) que muestran TODAS las encuestas
  2. Falta función helper para obtener empresa_id del usuario
  3. No hay tabla de asignaciones/participaciones para tracking
  4. empleado_id en respuestas referencia auth.users en vez de empleados

  ## Solución:
  1. Crear función obtener_empresa_id_usuario()
  2. Corregir políticas RLS de encuestas para filtrar por empresa
  3. Crear tabla encuestas_asignaciones para tracking de a quién se envió
  4. Crear funciones RPC para consultas optimizadas del empleado

  ## Seguridad:
  - Empleados solo ven encuestas de su empresa
  - Empleados solo ven encuestas activas y vigentes
  - Historial de respuestas filtrado por empleado
*/

-- ============================================
-- 1. Función helper: obtener empresa_id del usuario actual
-- ============================================

CREATE OR REPLACE FUNCTION obtener_empresa_id_usuario()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_empresa_id uuid;
BEGIN
  SELECT empresa_id INTO v_empresa_id
  FROM empleados
  WHERE auth_user_id = auth.uid()
  LIMIT 1;

  RETURN v_empresa_id;
END;
$$;

-- ============================================
-- 2. Tabla de asignaciones de encuestas (para tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS encuestas_asignaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  encuesta_id uuid REFERENCES encuestas(id) ON DELETE CASCADE NOT NULL,
  empleado_id uuid REFERENCES empleados(id) ON DELETE CASCADE NOT NULL,
  estado text DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'expirada', 'omitida')),
  fecha_asignacion timestamptz DEFAULT now(),
  fecha_completada timestamptz,
  notificacion_enviada boolean DEFAULT false,
  recordatorios_enviados integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(encuesta_id, empleado_id)
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_asignaciones_encuesta ON encuestas_asignaciones(encuesta_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_empleado ON encuestas_asignaciones(empleado_id);
CREATE INDEX IF NOT EXISTS idx_asignaciones_estado ON encuestas_asignaciones(estado);

-- RLS para asignaciones
ALTER TABLE encuestas_asignaciones ENABLE ROW LEVEL SECURITY;

-- Empleados ven solo sus propias asignaciones
CREATE POLICY "Ver mis asignaciones de encuestas"
  ON encuestas_asignaciones FOR SELECT
  TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
  );

-- Admins pueden gestionar asignaciones de su empresa
CREATE POLICY "Admins gestionan asignaciones"
  ON encuestas_asignaciones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e
      JOIN encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = auth.uid()
      AND e.es_admin = true
      AND enc.id = encuestas_asignaciones.encuesta_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados e
      JOIN encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = auth.uid()
      AND e.es_admin = true
      AND enc.id = encuesta_id
    )
  );

-- ============================================
-- 3. Corregir políticas RLS de encuestas
-- ============================================

-- Eliminar TODAS las políticas existentes de encuestas
DROP POLICY IF EXISTS "Users can view all surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can create surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can update their own surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON encuestas;
DROP POLICY IF EXISTS "Usuarios pueden ver encuestas de su empresa" ON encuestas;
DROP POLICY IF EXISTS "Usuarios pueden crear encuestas en su empresa" ON encuestas;
DROP POLICY IF EXISTS "Usuarios pueden actualizar encuestas de su empresa" ON encuestas;
DROP POLICY IF EXISTS "Usuarios pueden eliminar encuestas de su empresa" ON encuestas;

-- Nueva política de SELECT para encuestas (filtrada por empresa)
CREATE POLICY "Ver encuestas de mi empresa"
  ON encuestas FOR SELECT
  TO authenticated
  USING (
    empresa_id = obtener_empresa_id_usuario()
    OR empresa_id IS NULL -- Encuestas globales (si las hay)
  );

-- Admins pueden crear encuestas en su empresa
CREATE POLICY "Admins crean encuestas"
  ON encuestas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
      AND empresa_id = encuestas.empresa_id
    )
  );

-- Admins pueden actualizar encuestas de su empresa
CREATE POLICY "Admins actualizan encuestas"
  ON encuestas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
      AND empresa_id = encuestas.empresa_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
      AND empresa_id = encuestas.empresa_id
    )
  );

-- Admins pueden eliminar encuestas de su empresa
CREATE POLICY "Admins eliminan encuestas"
  ON encuestas FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados
      WHERE auth_user_id = auth.uid()
      AND es_admin = true
      AND empresa_id = encuestas.empresa_id
    )
  );

-- ============================================
-- 4. Corregir políticas de preguntas_encuesta
-- ============================================

DROP POLICY IF EXISTS "Users can view all questions" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can create questions for their surveys" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can update questions for their surveys" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can delete questions for their surveys" ON preguntas_encuesta;

-- Ver preguntas de encuestas de mi empresa
CREATE POLICY "Ver preguntas de encuestas de mi empresa"
  ON preguntas_encuesta FOR SELECT
  TO authenticated
  USING (
    encuesta_id IN (
      SELECT id FROM encuestas
      WHERE empresa_id = obtener_empresa_id_usuario()
      OR empresa_id IS NULL
    )
  );

-- Admins gestionan preguntas
CREATE POLICY "Admins gestionan preguntas"
  ON preguntas_encuesta FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM empleados e
      JOIN encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = auth.uid()
      AND e.es_admin = true
      AND enc.id = preguntas_encuesta.encuesta_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM empleados e
      JOIN encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = auth.uid()
      AND e.es_admin = true
      AND enc.id = encuesta_id
    )
  );

-- ============================================
-- 5. Corregir políticas de respuestas_encuesta
-- ============================================

DROP POLICY IF EXISTS "Users can view responses for their surveys" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Users can submit responses to active surveys" ON respuestas_encuesta;

-- Empleados ven solo sus propias respuestas
CREATE POLICY "Ver mis respuestas"
  ON respuestas_encuesta FOR SELECT
  TO authenticated
  USING (
    empleado_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM empleados e
      JOIN encuestas enc ON enc.empresa_id = e.empresa_id
      WHERE e.auth_user_id = auth.uid()
      AND e.es_admin = true
      AND enc.id = respuestas_encuesta.encuesta_id
    )
  );

-- Empleados pueden enviar respuestas a encuestas activas de su empresa
CREATE POLICY "Enviar respuestas a encuestas activas"
  ON respuestas_encuesta FOR INSERT
  TO authenticated
  WITH CHECK (
    empleado_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM encuestas enc
      WHERE enc.id = encuesta_id
      AND enc.estado = 'activa'
      AND enc.empresa_id = obtener_empresa_id_usuario()
      AND (enc.fecha_fin IS NULL OR enc.fecha_fin > now())
    )
  );

-- ============================================
-- 6. Añadir columna puntos_recompensa a encuestas (si no existe)
-- ============================================

ALTER TABLE encuestas
ADD COLUMN IF NOT EXISTS puntos_recompensa integer DEFAULT 50;

ALTER TABLE encuestas
ADD COLUMN IF NOT EXISTS tipo text DEFAULT 'bienestar';

-- ============================================
-- 7. Función RPC: Obtener encuestas pendientes del empleado
-- ============================================

CREATE OR REPLACE FUNCTION get_empleado_encuestas_pendientes()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id uuid;
  v_auth_user_id uuid;
  v_empresa_id uuid;
  v_result JSON;
BEGIN
  v_auth_user_id := auth.uid();

  -- Obtener datos del empleado actual
  SELECT id, empresa_id INTO v_empleado_id, v_empresa_id
  FROM empleados
  WHERE auth_user_id = v_auth_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Empleado no encontrado'
    );
  END IF;

  -- Obtener encuestas pendientes
  SELECT json_build_object(
    'success', true,
    'empleado_id', v_empleado_id,
    'encuestas', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', e.id,
          'titulo', e.titulo,
          'descripcion', e.descripcion,
          'categoria', e.categoria,
          'tipo', COALESCE(e.tipo, 'bienestar'),
          'estado', e.estado,
          'privacidad_nivel', e.privacidad_nivel,
          'fecha_inicio', e.fecha_inicio,
          'fecha_fin', e.fecha_fin,
          'puntos_recompensa', COALESCE(e.puntos_recompensa, 50),
          'num_preguntas', (
            SELECT COUNT(*) FROM preguntas_encuesta pe WHERE pe.encuesta_id = e.id
          ),
          'tiempo_estimado', CEIL((SELECT COUNT(*) FROM preguntas_encuesta pe WHERE pe.encuesta_id = e.id) * 0.5),
          'urgencia', CASE
            WHEN e.fecha_fin IS NULL THEN 'normal'
            WHEN e.fecha_fin <= now() + interval '24 hours' THEN 'urgente'
            WHEN e.fecha_fin <= now() + interval '72 hours' THEN 'pronto'
            ELSE 'normal'
          END
        ) ORDER BY
          CASE
            WHEN e.fecha_fin <= now() + interval '24 hours' THEN 0
            WHEN e.fecha_fin <= now() + interval '72 hours' THEN 1
            ELSE 2
          END,
          e.fecha_fin ASC NULLS LAST
      )
      FROM encuestas e
      WHERE e.empresa_id = v_empresa_id
      AND e.estado = 'activa'
      AND (e.fecha_inicio IS NULL OR e.fecha_inicio <= now())
      AND (e.fecha_fin IS NULL OR e.fecha_fin > now())
      AND NOT EXISTS (
        SELECT 1 FROM respuestas_encuesta r
        WHERE r.encuesta_id = e.id
        AND r.empleado_id = v_auth_user_id
        LIMIT 1
      )
    ), '[]'::json)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================
-- 8. Función RPC: Obtener historial de encuestas completadas
-- ============================================

CREATE OR REPLACE FUNCTION get_empleado_encuestas_historial()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id uuid;
  v_auth_user_id uuid;
  v_empresa_id uuid;
  v_result JSON;
BEGIN
  v_auth_user_id := auth.uid();

  -- Obtener datos del empleado actual
  SELECT id, empresa_id INTO v_empleado_id, v_empresa_id
  FROM empleados
  WHERE auth_user_id = v_auth_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Empleado no encontrado'
    );
  END IF;

  -- Obtener historial de encuestas completadas
  SELECT json_build_object(
    'success', true,
    'empleado_id', v_empleado_id,
    'historial', COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', e.id,
          'titulo', e.titulo,
          'descripcion', e.descripcion,
          'categoria', e.categoria,
          'tipo', COALESCE(e.tipo, 'bienestar'),
          'fecha_completado', r.fecha_completado,
          'puntos_obtenidos', COALESCE(e.puntos_recompensa, 50)
        ) ORDER BY r.fecha_completado DESC
      )
      FROM (
        SELECT DISTINCT ON (encuesta_id)
          encuesta_id,
          MAX(fecha_respuesta) as fecha_completado
        FROM respuestas_encuesta
        WHERE empleado_id = v_auth_user_id
        GROUP BY encuesta_id
      ) r
      JOIN encuestas e ON e.id = r.encuesta_id
      WHERE e.empresa_id = v_empresa_id
    ), '[]'::json)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================
-- 9. Función RPC: Obtener datos completos de encuestas para empleado
-- ============================================

CREATE OR REPLACE FUNCTION get_empleado_encuestas_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id uuid;
  v_auth_user_id uuid;
  v_empresa_id uuid;
  v_puntos integer;
  v_pendientes JSON;
  v_historial JSON;
BEGIN
  v_auth_user_id := auth.uid();

  -- Obtener datos del empleado actual
  SELECT id, empresa_id, COALESCE(puntos, 0)
  INTO v_empleado_id, v_empresa_id, v_puntos
  FROM empleados
  WHERE auth_user_id = v_auth_user_id;

  IF v_empleado_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Empleado no encontrado'
    );
  END IF;

  -- Obtener encuestas pendientes
  SELECT COALESCE(json_agg(enc_data ORDER BY urgencia_orden, fecha_fin_order), '[]'::json)
  INTO v_pendientes
  FROM (
    SELECT
      json_build_object(
        'id', e.id,
        'titulo', e.titulo,
        'descripcion', e.descripcion,
        'categoria', e.categoria,
        'tipo', COALESCE(e.tipo, 'bienestar'),
        'estado', e.estado,
        'privacidad_nivel', e.privacidad_nivel,
        'fecha_inicio', e.fecha_inicio,
        'fecha_fin', e.fecha_fin,
        'puntos_recompensa', COALESCE(e.puntos_recompensa, 50),
        'num_preguntas', (SELECT COUNT(*) FROM preguntas_encuesta pe WHERE pe.encuesta_id = e.id),
        'tiempo_estimado', CEIL((SELECT COUNT(*) FROM preguntas_encuesta pe WHERE pe.encuesta_id = e.id) * 0.5),
        'urgencia', CASE
          WHEN e.fecha_fin IS NULL THEN 'normal'
          WHEN e.fecha_fin <= now() + interval '24 hours' THEN 'urgente'
          WHEN e.fecha_fin <= now() + interval '72 hours' THEN 'pronto'
          ELSE 'normal'
        END
      ) as enc_data,
      CASE
        WHEN e.fecha_fin <= now() + interval '24 hours' THEN 0
        WHEN e.fecha_fin <= now() + interval '72 hours' THEN 1
        ELSE 2
      END as urgencia_orden,
      COALESCE(e.fecha_fin, 'infinity'::timestamptz) as fecha_fin_order
    FROM encuestas e
    WHERE e.empresa_id = v_empresa_id
    AND e.estado = 'activa'
    AND (e.fecha_inicio IS NULL OR e.fecha_inicio <= now())
    AND (e.fecha_fin IS NULL OR e.fecha_fin > now())
    AND NOT EXISTS (
      SELECT 1 FROM respuestas_encuesta r
      WHERE r.encuesta_id = e.id
      AND r.empleado_id = v_auth_user_id
      LIMIT 1
    )
  ) sub;

  -- Obtener historial
  SELECT COALESCE(json_agg(hist_data ORDER BY fecha_completado DESC), '[]'::json)
  INTO v_historial
  FROM (
    SELECT
      json_build_object(
        'id', e.id,
        'titulo', e.titulo,
        'descripcion', e.descripcion,
        'categoria', e.categoria,
        'tipo', COALESCE(e.tipo, 'bienestar'),
        'fecha_completado', r.fecha_completado,
        'puntos_obtenidos', COALESCE(e.puntos_recompensa, 50)
      ) as hist_data,
      r.fecha_completado
    FROM (
      SELECT
        encuesta_id,
        MAX(fecha_respuesta) as fecha_completado
      FROM respuestas_encuesta
      WHERE empleado_id = v_auth_user_id
      GROUP BY encuesta_id
    ) r
    JOIN encuestas e ON e.id = r.encuesta_id
    WHERE e.empresa_id = v_empresa_id
  ) sub;

  RETURN json_build_object(
    'success', true,
    'empleado', json_build_object(
      'id', v_empleado_id,
      'puntos', v_puntos
    ),
    'pendientes', v_pendientes,
    'historial', v_historial,
    'stats', json_build_object(
      'total_pendientes', (SELECT json_array_length(v_pendientes)),
      'total_completadas', (SELECT json_array_length(v_historial)),
      'puntos_disponibles', (
        SELECT COALESCE(SUM(COALESCE(e.puntos_recompensa, 50)), 0)
        FROM encuestas e
        WHERE e.empresa_id = v_empresa_id
        AND e.estado = 'activa'
        AND (e.fecha_inicio IS NULL OR e.fecha_inicio <= now())
        AND (e.fecha_fin IS NULL OR e.fecha_fin > now())
        AND NOT EXISTS (
          SELECT 1 FROM respuestas_encuesta r
          WHERE r.encuesta_id = e.id
          AND r.empleado_id = v_auth_user_id
          LIMIT 1
        )
      )
    )
  );
END;
$$;

-- ============================================
-- 10. Función RPC: Obtener encuesta por ID con preguntas
-- ============================================

CREATE OR REPLACE FUNCTION get_encuesta_para_responder(p_encuesta_id uuid)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_auth_user_id uuid;
  v_empresa_id uuid;
  v_encuesta RECORD;
  v_ya_respondida boolean;
  v_result JSON;
BEGIN
  v_auth_user_id := auth.uid();

  -- Obtener empresa del usuario
  SELECT empresa_id INTO v_empresa_id
  FROM empleados
  WHERE auth_user_id = v_auth_user_id;

  IF v_empresa_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Empleado no encontrado'
    );
  END IF;

  -- Verificar que la encuesta existe y pertenece a la empresa
  SELECT * INTO v_encuesta
  FROM encuestas
  WHERE id = p_encuesta_id
  AND empresa_id = v_empresa_id;

  IF v_encuesta IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Encuesta no encontrada'
    );
  END IF;

  -- Verificar que está activa y vigente
  IF v_encuesta.estado != 'activa' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Esta encuesta no está activa'
    );
  END IF;

  IF v_encuesta.fecha_fin IS NOT NULL AND v_encuesta.fecha_fin < now() THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Esta encuesta ha expirado'
    );
  END IF;

  -- Verificar si ya respondió
  SELECT EXISTS (
    SELECT 1 FROM respuestas_encuesta
    WHERE encuesta_id = p_encuesta_id
    AND empleado_id = v_auth_user_id
    LIMIT 1
  ) INTO v_ya_respondida;

  IF v_ya_respondida THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Ya has respondido esta encuesta',
      'ya_respondida', true
    );
  END IF;

  -- Construir respuesta con preguntas
  SELECT json_build_object(
    'success', true,
    'encuesta', json_build_object(
      'id', v_encuesta.id,
      'titulo', v_encuesta.titulo,
      'descripcion', v_encuesta.descripcion,
      'categoria', v_encuesta.categoria,
      'tipo', COALESCE(v_encuesta.tipo, 'bienestar'),
      'privacidad_nivel', v_encuesta.privacidad_nivel,
      'puntos_recompensa', COALESCE(v_encuesta.puntos_recompensa, 50),
      'fecha_fin', v_encuesta.fecha_fin,
      'preguntas', (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', p.id,
            'texto', p.texto,
            'tipo', p.tipo,
            'opciones', p.opciones,
            'orden', p.orden,
            'es_anonima', p.es_anonima
          ) ORDER BY p.orden
        ), '[]'::json)
        FROM preguntas_encuesta p
        WHERE p.encuesta_id = p_encuesta_id
      )
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================
-- 11. Función para asignar encuesta a todos los empleados de la empresa
-- ============================================

CREATE OR REPLACE FUNCTION asignar_encuesta_a_empresa(p_encuesta_id uuid)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_count integer := 0;
BEGIN
  -- Obtener empresa de la encuesta
  SELECT empresa_id INTO v_empresa_id
  FROM encuestas
  WHERE id = p_encuesta_id;

  IF v_empresa_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Encuesta no encontrada');
  END IF;

  -- Insertar asignaciones para todos los empleados activos de la empresa
  INSERT INTO encuestas_asignaciones (encuesta_id, empleado_id)
  SELECT p_encuesta_id, e.id
  FROM empleados e
  WHERE e.empresa_id = v_empresa_id
  AND e.estado = 'Activo'
  ON CONFLICT (encuesta_id, empleado_id) DO NOTHING;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN json_build_object(
    'success', true,
    'asignaciones_creadas', v_count
  );
END;
$$;

-- ============================================
-- 12. Grant permisos a las funciones RPC
-- ============================================

GRANT EXECUTE ON FUNCTION obtener_empresa_id_usuario() TO authenticated;
GRANT EXECUTE ON FUNCTION get_empleado_encuestas_pendientes() TO authenticated;
GRANT EXECUTE ON FUNCTION get_empleado_encuestas_historial() TO authenticated;
GRANT EXECUTE ON FUNCTION get_empleado_encuestas_data() TO authenticated;
GRANT EXECUTE ON FUNCTION get_encuesta_para_responder(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION asignar_encuesta_a_empresa(uuid) TO authenticated;
