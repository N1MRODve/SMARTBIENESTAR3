/*
  # Expandir tabla empresas para registro completo

  1. Nuevas columnas en `empresas`
    - `razon_social` (text) - Razón social oficial de la empresa
    - `ruc` (text, unique) - RUC o identificador fiscal
    - `telefono` (text) - Teléfono de contacto
    - `direccion` (text) - Dirección física
    - `pais` (text) - País de operación
    - `ciudad` (text) - Ciudad
    - `industria` (text) - Sector o industria
    - `num_empleados` (integer) - Número aproximado de empleados
    - `sitio_web` (text) - URL del sitio web corporativo
    - `admin_user_id` (uuid) - Usuario que registró la empresa (primer admin)

  2. Nueva columna en `empleados`
    - `es_admin` (boolean) - Indica si el empleado es administrador de la empresa

  3. Índices adicionales
    - Índice en RUC para búsquedas rápidas
    - Índice en admin_user_id

  4. Notas importantes
    - El primer usuario que registra la empresa es automáticamente admin
    - Los datos adicionales permiten personalización por empresa
*/

-- Agregar nuevas columnas a empresas
DO $$
BEGIN
  -- razon_social
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'razon_social'
  ) THEN
    ALTER TABLE empresas ADD COLUMN razon_social text;
  END IF;

  -- ruc
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'ruc'
  ) THEN
    ALTER TABLE empresas ADD COLUMN ruc text UNIQUE;
  END IF;

  -- telefono
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'telefono'
  ) THEN
    ALTER TABLE empresas ADD COLUMN telefono text;
  END IF;

  -- direccion
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'direccion'
  ) THEN
    ALTER TABLE empresas ADD COLUMN direccion text;
  END IF;

  -- pais
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'pais'
  ) THEN
    ALTER TABLE empresas ADD COLUMN pais text;
  END IF;

  -- ciudad
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'ciudad'
  ) THEN
    ALTER TABLE empresas ADD COLUMN ciudad text;
  END IF;

  -- industria
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'industria'
  ) THEN
    ALTER TABLE empresas ADD COLUMN industria text;
  END IF;

  -- num_empleados
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'num_empleados'
  ) THEN
    ALTER TABLE empresas ADD COLUMN num_empleados integer;
  END IF;

  -- sitio_web
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'sitio_web'
  ) THEN
    ALTER TABLE empresas ADD COLUMN sitio_web text;
  END IF;

  -- admin_user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empresas' AND column_name = 'admin_user_id'
  ) THEN
    ALTER TABLE empresas ADD COLUMN admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Agregar es_admin a empleados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'es_admin'
  ) THEN
    ALTER TABLE empleados ADD COLUMN es_admin boolean DEFAULT false;
  END IF;
END $$;

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_empresas_ruc ON empresas(ruc);
CREATE INDEX IF NOT EXISTS idx_empresas_admin_user ON empresas(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_empleados_es_admin ON empleados(es_admin);

-- Función actualizada para crear empresa con datos completos
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
BEGIN
  -- Validar dominio corporativo
  PERFORM validar_email_corporativo(p_email);

  -- Verificar si ya existe la empresa
  SELECT id INTO v_empresa_id
  FROM empresas
  WHERE dominio = lower(p_dominio);

  IF v_empresa_id IS NOT NULL THEN
    RAISE EXCEPTION 'Ya existe una empresa registrada con este dominio';
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
    lower(p_dominio),
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