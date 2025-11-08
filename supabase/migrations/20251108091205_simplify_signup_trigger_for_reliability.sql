/*
  # Simplificar trigger de signup para máxima confiabilidad

  1. Problema
    - El trigger sigue causando "Database error saving new user"
    - Demasiada lógica compleja en el trigger
    - Cualquier error (incluso capturado) puede fallar el signup

  2. Solución
    - Simplificar trigger al mínimo: solo retornar NEW
    - Mover toda la lógica de creación a DESPUÉS del signup
    - El signup SIEMPRE debe tener éxito
    - Crear empleado desde el frontend después del signup

  3. Ventajas
    - Signup nunca falla por problemas de base de datos
    - Más fácil de debugear
    - Usuario se crea primero, relaciones después
*/

-- Reemplazar con versión ultra-simple que NUNCA falla
CREATE OR REPLACE FUNCTION auto_asignar_empresa_al_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simplemente retornar NEW sin hacer nada
  -- Toda la lógica se maneja desde el frontend después del signup
  RETURN NEW;
END;
$$;