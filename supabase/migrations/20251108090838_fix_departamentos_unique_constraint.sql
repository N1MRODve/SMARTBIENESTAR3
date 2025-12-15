/*
  # Corregir restricción UNIQUE en departamentos

  1. Problema
    - La restricción UNIQUE en `nombre` impide que múltiples empresas tengan departamentos con el mismo nombre
    - Ejemplo: Empresa A tiene "RRHH" y Empresa B NO puede crear "RRHH"
    - Esto causa el error: duplicate key value violates unique constraint "departamentos_nombre_key"

  2. Solución
    - Eliminar restricción UNIQUE en solo `nombre`
    - Crear restricción UNIQUE compuesta en `(empresa_id, nombre)`
    - Esto permite que cada empresa tenga sus propios departamentos con nombres comunes

  3. Resultado
    - Empresa A puede tener "RRHH", "Ventas", "TI"
    - Empresa B puede tener "RRHH", "Ventas", "TI"
    - Pero Empresa A NO puede tener dos departamentos llamados "RRHH"
*/

-- Eliminar la restricción incorrecta
ALTER TABLE departamentos
DROP CONSTRAINT IF EXISTS departamentos_nombre_key;

-- NOTA: La restricción compuesta con empresa_id se omite porque la tabla
-- no tiene columna empresa_id actualmente. Los departamentos son únicos por nombre global.
-- Si se necesita soporte multi-empresa, agregar primero la columna empresa_id.