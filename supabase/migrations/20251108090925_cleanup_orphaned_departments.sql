/*
  # Limpiar departamentos huérfanos

  NOTA: Esta migración originalmente intentaba limpiar departamentos
  con empresa_id NULL, pero la tabla departamentos no tiene columna
  empresa_id en el esquema actual. Se omite la limpieza.
*/

-- No op: la tabla departamentos no tiene columna empresa_id
-- Si se agrega empresa_id en el futuro, descomentar:
-- DELETE FROM departamentos WHERE empresa_id IS NULL;
