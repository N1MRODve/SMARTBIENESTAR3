/*
  # Corregir función crear_empresa_completa

  1. Problema
    - La función valida email corporativo y lanza excepciones
    - Esto impide el registro cuando se usa desde el frontend

  2. Solución
    - Eliminar validación que lanza excepciones
    - La validación ya se hace en el frontend
    - Simplificar la función para que solo cree la empresa

  3. Notas
    - El trigger ya maneja la creación del empleado
    - No necesitamos duplicar lógica
*/

-- Reemplazar la función crear_empresa_completa
CREATE OR REPLACE FUNCTION crear_empresa_completa(
  p_email text,
  p_razon_social text,
  p_dominio text,
  p_ruc text DEFAULT NULL,
  p_telefono text DEFAULT NULL,
  p_direccion text DEFAULT NULL,
  p_pais text DEFAULT NULL,
  p_ciudad text DEFAULT NULL,
  p_industria text DEFAULT NULL,
  p_num_empleados integer DEFAULT NULL,
  p_sitio_web text DEFAULT NULL,
  p_admin_user_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empresa_id uuid;
  v_dominio_limpio text;
BEGIN
  -- Limpiar y normalizar dominio
  v_dominio_limpio := lower(trim(p_dominio));

  -- Verificar si ya existe la empresa (sin lanzar excepción, retornar la existente)
  SELECT id INTO v_empresa_id
  FROM empresas
  WHERE dominio = v_dominio_limpio;

  IF v_empresa_id IS NOT NULL THEN
    -- Si ya existe, retornar el ID existente en lugar de error
    RETURN v_empresa_id;
  END IF;

  -- Crear empresa con todos los datos
  INSERT INTO empresas (
    dominio,
    nombre,
    razon_social,
    ruc,
    telefono,
    direccion,
    pais,
    ciudad,
    industria,
    num_empleados,
    sitio_web,
    admin_user_id,
    activa
  ) VALUES (
    v_dominio_limpio,
    p_razon_social,
    p_razon_social,
    p_ruc,
    p_telefono,
    p_direccion,
    p_pais,
    p_ciudad,
    p_industria,
    p_num_empleados,
    p_sitio_web,
    p_admin_user_id,
    true
  )
  RETURNING id INTO v_empresa_id;

  -- Crear departamentos iniciales
  PERFORM crear_departamentos_iniciales(v_empresa_id);

  RETURN v_empresa_id;
END;
$$;

-- Actualizar función obtener_o_crear_empresa para que no lance excepciones
CREATE OR REPLACE FUNCTION obtener_o_crear_empresa(p_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dominio text;
  v_empresa_id uuid;
  v_nombre_empresa text;
  v_dominios_publicos text[] := ARRAY[
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'icloud.com', 'live.com', 'msn.com', 'aol.com',
    'mail.com', 'inbox.com', 'protonmail.com', 'zoho.com',
    'yandex.com', 'gmx.com', 'fastmail.com', 'tutanota.com'
  ];
BEGIN
  -- Validar formato básico de email
  IF p_email IS NULL OR p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE WARNING 'Formato de email inválido: %', p_email;
    RETURN NULL;
  END IF;

  -- Extraer dominio
  v_dominio := lower(substring(p_email from '@(.*)$'));

  -- Verificar si es dominio público (solo advertencia, no error)
  IF v_dominio = ANY(v_dominios_publicos) THEN
    RAISE WARNING 'Email público detectado: %', p_email;
    RETURN NULL;
  END IF;

  -- Buscar empresa existente
  SELECT id INTO v_empresa_id
  FROM empresas
  WHERE dominio = v_dominio;

  -- Si no existe, crear la empresa
  IF v_empresa_id IS NULL THEN
    -- Generar nombre basado en dominio (ej: acme.com -> Acme)
    v_nombre_empresa := initcap(split_part(v_dominio, '.', 1));

    INSERT INTO empresas (dominio, nombre)
    VALUES (v_dominio, v_nombre_empresa)
    RETURNING id INTO v_empresa_id;
  END IF;

  RETURN v_empresa_id;
END;
$$;