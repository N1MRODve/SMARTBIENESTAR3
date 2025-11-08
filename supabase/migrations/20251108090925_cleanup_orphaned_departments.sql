/*
  # Limpiar departamentos huérfanos

  1. Problema
    - Existen departamentos con empresa_id = NULL de registros fallidos
    - Estos causan conflictos con la restricción UNIQUE (empresa_id, nombre)
    - NULL en empresa_id impide el correcto funcionamiento

  2. Solución
    - Eliminar todos los departamentos huérfanos
    - Agregar restricción NOT NULL en empresa_id para prevenir futuros problemas

  3. Seguridad
    - Solo elimina departamentos sin empresa asociada
    - No afecta datos válidos
*/

-- Eliminar departamentos huérfanos
DELETE FROM departamentos
WHERE empresa_id IS NULL;

-- Asegurar que empresa_id sea NOT NULL (si no lo es ya)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'departamentos' 
      AND column_name = 'empresa_id' 
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE departamentos 
    ALTER COLUMN empresa_id SET NOT NULL;
  END IF;
END $$;