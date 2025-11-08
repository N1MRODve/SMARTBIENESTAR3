/*
  # Limpiar políticas RLS de encuestas

  1. Problema
    - Políticas duplicadas en tabla encuestas
    - Políticas permisivas con `USING (true)` que permiten acceso a TODAS las encuestas
    - Esto viola la separación por empresa

  2. Solución
    - Eliminar políticas antiguas permisivas
    - Mantener solo las políticas que filtran por empresa_id
    - Asegurar que cada empresa solo ve sus propias encuestas

  3. Seguridad
    - Las políticas correctas usan obtener_empresa_id_usuario()
    - Esto garantiza aislamiento de datos entre empresas
*/

-- Eliminar políticas antiguas permisivas
DROP POLICY IF EXISTS "Users can create surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can update their own surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can view all surveys" ON encuestas;

-- Las políticas correctas ya existen y filtran por empresa_id:
-- - "Usuarios pueden crear encuestas en su empresa"
-- - "Usuarios pueden ver encuestas de su empresa"
-- - "Usuarios pueden actualizar encuestas de su empresa"
-- - "Usuarios pueden eliminar encuestas de su empresa"