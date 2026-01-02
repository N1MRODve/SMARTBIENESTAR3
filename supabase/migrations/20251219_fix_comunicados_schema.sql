-- =====================================================
-- MIGRACIÓN: Actualizar esquema de comunicados
-- =====================================================
-- El código frontend usa campos adicionales que no existen
-- en la tabla original. Esta migración los añade.
-- =====================================================

-- Paso 1: Eliminar constraints restrictivos de tipo y estado
DO $$
BEGIN
  -- Eliminar constraint de tipo si existe
  ALTER TABLE comunicados DROP CONSTRAINT IF EXISTS comunicados_tipo_check;

  -- Eliminar constraint de estado si existe
  ALTER TABLE comunicados DROP CONSTRAINT IF EXISTS comunicados_estado_check;

  RAISE NOTICE 'Constraints eliminados';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error eliminando constraints: %', SQLERRM;
END $$;

-- Paso 2: Añadir columnas faltantes
DO $$
BEGIN
  -- empresa_id (ya debería existir por migración anterior, pero por si acaso)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
    RAISE NOTICE 'Columna empresa_id añadida';
  END IF;

  -- destinatarios (array de nombres de departamentos)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'destinatarios'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN destinatarios text[] DEFAULT '{}';
    RAISE NOTICE 'Columna destinatarios añadida';
  END IF;

  -- roles (array de roles)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'roles'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN roles text[] DEFAULT '{}';
    RAISE NOTICE 'Columna roles añadida';
  END IF;

  -- hora_envio
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'hora_envio'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN hora_envio text DEFAULT '09:00';
    RAISE NOTICE 'Columna hora_envio añadida';
  END IF;

  -- interacciones (porcentaje de lectura)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'interacciones'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN interacciones integer DEFAULT 0;
    RAISE NOTICE 'Columna interacciones añadida';
  END IF;

  -- alcance_estimado (número de destinatarios al momento de envío)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'alcance_estimado'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN alcance_estimado integer DEFAULT 0;
    RAISE NOTICE 'Columna alcance_estimado añadida';
  END IF;
END $$;

-- Paso 3: Crear índice para empresa_id si no existe
CREATE INDEX IF NOT EXISTS idx_comunicados_empresa ON comunicados(empresa_id);

-- Paso 4: Mostrar estructura actualizada
DO $$
DECLARE
  v_columnas text;
BEGIN
  SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
  INTO v_columnas
  FROM information_schema.columns
  WHERE table_name = 'comunicados';

  RAISE NOTICE '=== COLUMNAS DE COMUNICADOS ===';
  RAISE NOTICE '%', v_columnas;
END $$;
