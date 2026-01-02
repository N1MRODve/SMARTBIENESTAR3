-- =====================================================
-- MIGRACIÓN: Corregir empleado_id en respuestas_encuesta
-- =====================================================
-- PROBLEMA: Las respuestas se guardaban con auth.user.id (auth.users UUID)
--           pero las consultas buscan por empleados.id (empleados UUID)
--           Estos son UUIDs DIFERENTES, causando que las encuestas
--           completadas sigan apareciendo como pendientes.
--
-- ADEMÁS: Existe una FK incorrecta que apunta a auth.users en lugar de empleados
--
-- SOLUCIÓN:
--   1. Eliminar FK incorrecta que apunta a auth.users
--   2. Actualizar respuestas_encuesta.empleado_id para usar empleados.id
--   3. Crear FK correcta que apunta a empleados
-- =====================================================

-- Paso 0: ELIMINAR FK INCORRECTA que apunta a auth.users
-- Esta es la causa del error: "Key (empleado_id)=(...) is not present in table users"
DO $$
DECLARE
  v_constraint_name text;
BEGIN
  -- Buscar y eliminar cualquier FK en empleado_id que apunte a auth.users
  FOR v_constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_class ref ON c.confrelid = ref.oid
    JOIN pg_namespace n ON ref.relnamespace = n.oid
    WHERE t.relname = 'respuestas_encuesta'
      AND c.contype = 'f'
      AND (ref.relname = 'users' OR (n.nspname = 'auth' AND ref.relname = 'users'))
  LOOP
    EXECUTE format('ALTER TABLE respuestas_encuesta DROP CONSTRAINT IF EXISTS %I', v_constraint_name);
    RAISE NOTICE 'FK eliminada: %', v_constraint_name;
  END LOOP;

  -- También eliminar si existe una con nombre específico
  ALTER TABLE respuestas_encuesta DROP CONSTRAINT IF EXISTS respuestas_encuesta_empleado_id_fkey;
  RAISE NOTICE 'FK respuestas_encuesta_empleado_id_fkey eliminada (si existía)';
END $$;

-- Paso 1: Ver cuántas respuestas están afectadas (diagnóstico)
DO $$
DECLARE
  v_count_incorrectas integer;
  v_count_correctas integer;
BEGIN
  -- Contar respuestas con auth_user_id (incorrecto)
  SELECT COUNT(DISTINCT re.id) INTO v_count_incorrectas
  FROM respuestas_encuesta re
  INNER JOIN empleados e ON re.empleado_id = e.auth_user_id;

  -- Contar respuestas con empleados.id (correcto)
  SELECT COUNT(DISTINCT re.id) INTO v_count_correctas
  FROM respuestas_encuesta re
  INNER JOIN empleados e ON re.empleado_id = e.id;

  RAISE NOTICE '=== DIAGNÓSTICO ===';
  RAISE NOTICE 'Respuestas con auth_user_id (INCORRECTO): %', v_count_incorrectas;
  RAISE NOTICE 'Respuestas con empleados.id (CORRECTO): %', v_count_correctas;
END $$;

-- Paso 2: Actualizar respuestas que tienen auth_user_id en lugar de empleados.id
-- Solo actualiza si el empleado_id actual corresponde a un auth_user_id
UPDATE respuestas_encuesta re
SET empleado_id = e.id
FROM empleados e
WHERE re.empleado_id = e.auth_user_id;

-- Paso 3: Verificar resultado
DO $$
DECLARE
  v_count_corregidas integer;
BEGIN
  SELECT COUNT(*) INTO v_count_corregidas
  FROM respuestas_encuesta re
  INNER JOIN empleados e ON re.empleado_id = e.id;

  RAISE NOTICE '=== RESULTADO ===';
  RAISE NOTICE 'Respuestas corregidas (ahora con empleados.id): %', v_count_corregidas;
END $$;

-- Paso 4: Agregar FK CORRECTA que apunta a empleados (no a auth.users)
DO $$
BEGIN
  -- Verificar que no exista ya
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_class ref ON c.confrelid = ref.oid
    WHERE t.relname = 'respuestas_encuesta'
      AND ref.relname = 'empleados'
      AND c.contype = 'f'
  ) THEN
    ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT respuestas_encuesta_empleado_id_fkey
    FOREIGN KEY (empleado_id) REFERENCES empleados(id)
    ON DELETE CASCADE;

    RAISE NOTICE 'FK respuestas_encuesta_empleado_id_fkey creada -> empleados(id)';
  ELSE
    RAISE NOTICE 'FK a empleados ya existe';
  END IF;
EXCEPTION
  WHEN foreign_key_violation THEN
    RAISE WARNING 'No se pudo crear FK - hay IDs huérfanos que no existen en empleados';
END $$;

-- Paso 5: Crear índice para mejorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_respuestas_encuesta_empleado_encuesta
ON respuestas_encuesta(empleado_id, encuesta_id);

-- Paso 6: Agregar constraint único para evitar respuestas duplicadas
-- (un empleado solo puede responder una encuesta una vez)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'respuestas_encuesta_empleado_encuesta_unique'
  ) THEN
    -- Primero eliminar duplicados si existen (mantener el más reciente)
    DELETE FROM respuestas_encuesta
    WHERE id NOT IN (
      SELECT DISTINCT ON (empleado_id, encuesta_id) id
      FROM respuestas_encuesta
      ORDER BY empleado_id, encuesta_id, fecha_respuesta DESC
    );

    -- Agregar constraint único
    ALTER TABLE respuestas_encuesta
    ADD CONSTRAINT respuestas_encuesta_empleado_encuesta_unique
    UNIQUE (empleado_id, encuesta_id);

    RAISE NOTICE 'Constraint único empleado_encuesta creado';
  ELSE
    RAISE NOTICE 'Constraint único ya existe';
  END IF;
EXCEPTION
  WHEN unique_violation THEN
    RAISE WARNING 'Hay duplicados. Limpiando...';
END $$;

-- Mostrar resumen final
DO $$
DECLARE
  v_total_respuestas integer;
  v_empleados_distintos integer;
  v_encuestas_distintas integer;
BEGIN
  SELECT COUNT(*), COUNT(DISTINCT empleado_id), COUNT(DISTINCT encuesta_id)
  INTO v_total_respuestas, v_empleados_distintos, v_encuestas_distintas
  FROM respuestas_encuesta;

  RAISE NOTICE '=== RESUMEN FINAL ===';
  RAISE NOTICE 'Total respuestas: %', v_total_respuestas;
  RAISE NOTICE 'Empleados distintos: %', v_empleados_distintos;
  RAISE NOTICE 'Encuestas distintas: %', v_encuestas_distintas;
END $$;
