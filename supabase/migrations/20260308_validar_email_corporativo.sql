/*
  # Validación de email corporativo en backend

  1. Problema
    - La validación de email corporativo solo existe en frontend
    - Un atacante podría enviar requests directamente al RPC
    - Necesitamos validación en backend para seguridad

  2. Solución
    - Agregar validación de dominios públicos en crear_empresa_completa
    - Lanzar excepción si se intenta registrar con email no corporativo
    - Mantener lista de dominios públicos actualizada

  3. Seguridad
    - Esta validación complementa la del frontend
    - Protege contra bypass de validación del cliente
*/

-- Reemplazar la función crear_empresa_completa con validación de email corporativo
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
  v_dominios_publicos text[] := ARRAY[
    'gmail.com', 'yahoo.com', 'yahoo.es', 'hotmail.com', 'hotmail.es',
    'outlook.com', 'outlook.es', 'icloud.com', 'live.com', 'live.es',
    'msn.com', 'aol.com', 'mail.com', 'inbox.com', 'protonmail.com',
    'zoho.com', 'yandex.com', 'gmx.com', 'gmx.es', 'fastmail.com',
    'tutanota.com', 'pm.me', 'hey.com', 'mail.ru', 'qq.com',
    '163.com', '126.com', 'sina.com', 'yeah.net'
  ];
BEGIN
  -- Limpiar y normalizar dominio
  v_dominio_limpio := lower(trim(p_dominio));

  -- VALIDACIÓN DE SEGURIDAD: Rechazar dominios públicos
  IF v_dominio_limpio = ANY(v_dominios_publicos) THEN
    RAISE EXCEPTION 'Solo se permiten correos corporativos. Los dominios como Gmail, Yahoo, Hotmail no están permitidos.';
  END IF;

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

-- Actualizar función obtener_o_crear_empresa para rechazar emails públicos
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
    'gmail.com', 'yahoo.com', 'yahoo.es', 'hotmail.com', 'hotmail.es',
    'outlook.com', 'outlook.es', 'icloud.com', 'live.com', 'live.es',
    'msn.com', 'aol.com', 'mail.com', 'inbox.com', 'protonmail.com',
    'zoho.com', 'yandex.com', 'gmx.com', 'gmx.es', 'fastmail.com',
    'tutanota.com', 'pm.me', 'hey.com', 'mail.ru', 'qq.com',
    '163.com', '126.com', 'sina.com', 'yeah.net'
  ];
BEGIN
  -- Validar formato básico de email
  IF p_email IS NULL OR p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Formato de email inválido: %', p_email;
  END IF;

  -- Extraer dominio
  v_dominio := lower(substring(p_email from '@(.*)$'));

  -- VALIDACIÓN DE SEGURIDAD: Rechazar dominios públicos
  IF v_dominio = ANY(v_dominios_publicos) THEN
    RAISE EXCEPTION 'Solo se permiten correos corporativos. Los dominios como Gmail, Yahoo, Hotmail no están permitidos.';
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

COMMENT ON FUNCTION crear_empresa_completa IS 'Crea una empresa con validación de email corporativo. Rechaza dominios públicos como Gmail, Yahoo, etc.';
COMMENT ON FUNCTION obtener_o_crear_empresa IS 'Obtiene o crea una empresa basándose en el dominio del email. Rechaza dominios públicos.';
