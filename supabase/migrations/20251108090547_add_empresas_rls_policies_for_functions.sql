/*
  # Agregar políticas RLS para operaciones en empresas

  1. Problema
    - Solo existe política SELECT en empresas
    - Las funciones SECURITY DEFINER necesitan poder INSERT/UPDATE
    - Usuarios autenticados no pueden ver/actualizar empresas

  2. Solución
    - Mantener funciones como SECURITY DEFINER (bypass RLS)
    - Agregar políticas para que usuarios puedan actualizar su empresa
    - Permitir lectura de empresa propia

  3. Notas
    - SECURITY DEFINER permite que las funciones operen sin RLS
    - Pero necesitamos políticas para operaciones directas desde el frontend
*/

-- Permitir a usuarios autenticados actualizar su propia empresa
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propia empresa" ON empresas;
CREATE POLICY "Usuarios pueden actualizar su propia empresa"
  ON empresas FOR UPDATE
  TO authenticated
  USING (dominio_email = substring(auth.jwt()->>'email' from '@(.*)$'))
  WITH CHECK (dominio_email = substring(auth.jwt()->>'email' from '@(.*)$'));

-- Nota: Las funciones SECURITY DEFINER pueden insertar sin necesitar política INSERT
-- porque bypasean RLS. Esto es intencional y seguro porque la función tiene validaciones.