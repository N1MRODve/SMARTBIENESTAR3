/*
  # Agregar columna de onboarding a empresas

  1. Cambios
    - Agregar columna onboarding_completado a tabla empresas
    - Por defecto FALSE para empresas nuevas
    - TRUE para empresas existentes (retrocompatibilidad)

  2. Propósito
    - Mostrar flujo de onboarding solo a empresas nuevas
    - Guiar a administradores en configuración inicial
    - Mejorar experiencia de usuario
*/

-- Agregar columna onboarding_completado
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS onboarding_completado boolean DEFAULT false;

-- Marcar empresas existentes como onboarding completado (retrocompatibilidad)
UPDATE empresas 
SET onboarding_completado = true 
WHERE onboarding_completado IS NULL;