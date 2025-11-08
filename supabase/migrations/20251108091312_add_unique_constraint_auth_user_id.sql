/*
  # Agregar restricción UNIQUE en auth_user_id

  1. Problema
    - No hay restricción UNIQUE en auth_user_id
    - Un usuario podría crear múltiples empleados accidentalmente
    - Esto causaría inconsistencias en la base de datos

  2. Solución
    - Agregar restricción UNIQUE en auth_user_id
    - Garantizar que cada usuario de auth solo tenga un empleado

  3. Seguridad
    - Previene duplicados
    - Asegura integridad referencial
    - Si ya hay duplicados, primero los elimina (guardando el más reciente)
*/

-- Primero, limpiar cualquier duplicado que pueda existir
-- Mantener solo el empleado más reciente por auth_user_id
DELETE FROM empleados
WHERE id NOT IN (
  SELECT DISTINCT ON (auth_user_id) id
  FROM empleados
  WHERE auth_user_id IS NOT NULL
  ORDER BY auth_user_id, created_at DESC
);

-- Agregar restricción UNIQUE en auth_user_id
ALTER TABLE empleados
ADD CONSTRAINT empleados_auth_user_id_key 
UNIQUE (auth_user_id);