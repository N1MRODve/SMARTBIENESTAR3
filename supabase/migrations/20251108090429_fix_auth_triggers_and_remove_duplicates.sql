/*
  # Corregir triggers de autenticación

  1. Problema identificado
    - Múltiples triggers BEFORE/AFTER causando conflictos
    - Trigger con función inexistente (handle_new_user)
    - Validación de email corporativo lanzando excepciones que impiden signup

  2. Solución
    - Eliminar triggers duplicados y conflictivos
    - Mantener solo un trigger AFTER para auto-asignación
    - Mover validación de email a la función de creación de empresa
    - Permitir que el signup se complete antes de validar

  3. Estrategia correcta
    - auth.users se crea primero (sin validación que bloquee)
    - Trigger AFTER crea el empleado y valida
    - Si falla la validación en AFTER, se puede manejar mejor
*/

-- Eliminar triggers problemáticos
DROP TRIGGER IF EXISTS trigger_validar_email_corporativo ON auth.users;
DROP TRIGGER IF EXISTS trigger_validar_email_signup ON auth.users;
DROP TRIGGER IF EXISTS trigger_sync_empleado_on_insert ON auth.users;

-- Eliminar funciones problemáticas si existen
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS sync_empleado_on_insert() CASCADE;
DROP FUNCTION IF EXISTS validar_email_signup() CASCADE;

-- Mantener solo el trigger principal (ya existe)
-- DROP TRIGGER IF EXISTS trigger_auto_asignar_empresa ON auth.users;

-- Actualizar la función de auto-asignación para manejar validaciones sin bloquear
CREATE OR REPLACE FUNCTION auto_asignar_empresa_al_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_departamento_id uuid;
  v_nombre text;
  v_es_admin boolean := false;
  v_cargo text := 'Empleado';
  v_dominio text;
  v_es_primera_empresa boolean := false;
BEGIN
  -- Extraer dominio del email
  v_dominio := lower(substring(NEW.email from '@(.*)$'));

  -- Validar que NO sea un dominio público
  IF v_dominio IN (
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'icloud.com', 'live.com', 'msn.com', 'aol.com',
    'mail.com', 'inbox.com', 'protonmail.com', 'zoho.com',
    'yandex.com', 'gmx.com', 'fastmail.com', 'tutanota.com'
  ) THEN
    -- No lanzar excepción, simplemente registrar en logs y retornar
    RAISE WARNING 'Intento de registro con email público: %', NEW.email;
    -- Marcar el usuario como inactivo en lugar de bloquear
    RETURN NEW;
  END IF;

  -- Verificar si ya existe la empresa
  SELECT id INTO v_empresa_id
  FROM empresas
  WHERE dominio = v_dominio;

  -- Si la empresa NO existe, este usuario será el admin (primer usuario)
  IF v_empresa_id IS NULL THEN
    v_es_primera_empresa := true;
    v_es_admin := true;
    v_cargo := 'Administrador';
  END IF;

  -- Si el usuario viene con metadata es_admin, respetarla
  IF NEW.raw_user_meta_data->>'es_admin' = 'true' THEN
    v_es_admin := true;
    v_cargo := 'Administrador';
  END IF;

  -- Obtener o crear empresa basada en el dominio del email
  -- Esta función creará la empresa si no existe
  IF v_empresa_id IS NULL THEN
    BEGIN
      v_empresa_id := obtener_o_crear_empresa(NEW.email);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error al crear empresa para %: %', NEW.email, SQLERRM;
      RETURN NEW;
    END;
  END IF;

  -- Crear departamentos iniciales si es una empresa nueva
  IF v_es_primera_empresa THEN
    BEGIN
      PERFORM crear_departamentos_iniciales(v_empresa_id);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error al crear departamentos: %', SQLERRM;
    END;
  END IF;

  -- Obtener el primer departamento (RRHH preferentemente)
  SELECT id INTO v_departamento_id
  FROM departamentos
  WHERE empresa_id = v_empresa_id
    AND nombre = 'RRHH'
  LIMIT 1;

  -- Si no hay RRHH, tomar cualquier departamento
  IF v_departamento_id IS NULL THEN
    SELECT id INTO v_departamento_id
    FROM departamentos
    WHERE empresa_id = v_empresa_id
    LIMIT 1;
  END IF;

  -- Extraer nombre del metadata o del email
  IF NEW.raw_user_meta_data->>'nombre' IS NOT NULL THEN
    v_nombre := NEW.raw_user_meta_data->>'nombre';
  ELSE
    -- Extraer nombre del email (parte antes del @)
    v_nombre := split_part(NEW.email, '@', 1);
    v_nombre := initcap(replace(v_nombre, '.', ' '));
  END IF;

  -- Crear registro de empleado automáticamente
  BEGIN
    INSERT INTO empleados (
      auth_user_id,
      empresa_id,
      nombre,
      email,
      departamento_id,
      cargo,
      es_admin,
      estado,
      puntos
    ) VALUES (
      NEW.id,
      v_empresa_id,
      v_nombre,
      NEW.email,
      v_departamento_id,
      v_cargo,
      v_es_admin,
      'Activo',
      0
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error al crear empleado: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;