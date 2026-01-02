-- =====================================================
-- MIGRACIÓN: Corregir políticas RLS de comunicados
-- =====================================================
-- Problemas corregidos:
-- 1. Estados con mayúsculas/minúsculas inconsistentes
-- 2. Política RLS muy restrictiva
-- 3. fecha_publicacion faltante
-- =====================================================

-- Paso 1: Eliminar políticas antiguas
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer comunicados enviados" ON comunicados;
DROP POLICY IF EXISTS "Empleados pueden ver comunicados enviados" ON comunicados;

-- Paso 2: Crear política actualizada
-- Los empleados pueden ver comunicados de su empresa que estén enviados/programados
CREATE POLICY "Empleados pueden ver comunicados de su empresa"
  ON comunicados FOR SELECT
  TO authenticated
  USING (
    -- Comunicados enviados/programados de la empresa del empleado
    (
      LOWER(estado) IN ('enviado', 'programado', 'publicado')
      AND empresa_id IN (
        SELECT empresa_id FROM empleados WHERE auth_user_id = auth.uid()
      )
    )
    OR
    -- Los borradores solo los puede ver el autor
    (
      LOWER(estado) = 'borrador'
      AND autor_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
    )
  );

-- Paso 3: Normalizar estados existentes a minúsculas
UPDATE comunicados SET estado = LOWER(estado) WHERE estado <> LOWER(estado);

-- Paso 4: Establecer fecha_publicacion donde falte
UPDATE comunicados
SET fecha_publicacion = COALESCE(fecha_envio, created_at, NOW())
WHERE fecha_publicacion IS NULL
  AND LOWER(estado) IN ('enviado', 'programado', 'publicado');

-- Paso 5: Asegurar que la tabla comunicados_lecturas tenga la constraint correcta
DO $$
BEGIN
  -- Verificar si existe la constraint unique
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'comunicados_lecturas_comunicado_id_empleado_id_key'
  ) THEN
    -- Crear constraint unique si no existe
    ALTER TABLE comunicados_lecturas
    ADD CONSTRAINT comunicados_lecturas_comunicado_id_empleado_id_key
    UNIQUE (comunicado_id, empleado_id);
    RAISE NOTICE 'Constraint unique creada en comunicados_lecturas';
  ELSE
    RAISE NOTICE 'Constraint unique ya existe en comunicados_lecturas';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creando constraint: %', SQLERRM;
END $$;

-- Paso 6: Mostrar diagnóstico
DO $$
DECLARE
  v_total integer;
  v_enviados integer;
  v_con_fecha integer;
BEGIN
  SELECT COUNT(*) INTO v_total FROM comunicados;
  SELECT COUNT(*) INTO v_enviados FROM comunicados WHERE LOWER(estado) = 'enviado';
  SELECT COUNT(*) INTO v_con_fecha FROM comunicados WHERE fecha_publicacion IS NOT NULL;

  RAISE NOTICE '=== MIGRACIÓN COMPLETADA ===';
  RAISE NOTICE 'Total comunicados: %', v_total;
  RAISE NOTICE 'Comunicados enviados: %', v_enviados;
  RAISE NOTICE 'Comunicados con fecha_publicacion: %', v_con_fecha;
  RAISE NOTICE 'Política RLS actualizada correctamente';
END $$;
