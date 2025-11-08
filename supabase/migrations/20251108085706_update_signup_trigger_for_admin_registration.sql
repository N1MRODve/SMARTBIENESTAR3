/*
  # Actualizar trigger de signup para manejar registro de admin

  1. Modificar función de auto-asignación
    - Detectar si es el primer usuario de una empresa (admin)
    - Marcar como admin si es el primer usuario
    - Mantener lógica existente para empleados subsecuentes

  2. Verificar metadata del usuario
    - Leer datos adicionales del usuario (nombre, es_admin)
    - Aplicar correctamente al crear el empleado

  3. Notas importantes
    - El trigger se ejecuta DESPUÉS de crear el usuario
    - Si la empresa ya existe, el usuario NO es admin automáticamente
    - Solo el primer usuario es admin por defecto
*/

-- Función mejorada de auto-asignación
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
    v_empresa_id := obtener_o_crear_empresa(NEW.email);
  END IF;

  -- Crear departamentos iniciales si es una empresa nueva
  IF v_es_primera_empresa THEN
    PERFORM crear_departamentos_iniciales(v_empresa_id);
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

  RETURN NEW;
END;
$$;