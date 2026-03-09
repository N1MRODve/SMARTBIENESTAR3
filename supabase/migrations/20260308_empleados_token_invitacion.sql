/*
  # Token de invitacion para empleados

  1. Cambios
    - Agregar columna token_invitacion (UUID) para identificar invitaciones
    - Agregar columna token_expira para fecha de expiracion
    - Crear indice para busquedas rapidas por token

  2. Uso
    - Cuando admin invita empleado, se genera token unico
    - Empleado recibe email con link que incluye token
    - Al registrarse, se valida token y se actualiza estado a 'Activo'
*/

-- Agregar columnas de invitacion
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS token_invitacion UUID;
ALTER TABLE empleados ADD COLUMN IF NOT EXISTS token_expira TIMESTAMPTZ;

-- Indice para busquedas por token (solo tokens no nulos)
CREATE INDEX IF NOT EXISTS idx_empleados_token_invitacion
ON empleados(token_invitacion)
WHERE token_invitacion IS NOT NULL;

-- Funcion para validar token de invitacion
CREATE OR REPLACE FUNCTION validar_token_invitacion(p_token UUID)
RETURNS TABLE (
  empleado_id UUID,
  email TEXT,
  nombre TEXT,
  empresa_id UUID,
  empresa_nombre TEXT,
  departamento_id UUID,
  departamento_nombre TEXT,
  valido BOOLEAN,
  mensaje TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id AS empleado_id,
    e.email,
    e.nombre,
    e.empresa_id,
    emp.nombre AS empresa_nombre,
    e.departamento_id,
    d.nombre AS departamento_nombre,
    CASE
      WHEN e.id IS NULL THEN false
      WHEN e.estado != 'Invitado' THEN false
      WHEN e.token_expira IS NOT NULL AND e.token_expira < NOW() THEN false
      ELSE true
    END AS valido,
    CASE
      WHEN e.id IS NULL THEN 'Token de invitación no válido'
      WHEN e.estado != 'Invitado' THEN 'Esta invitación ya fue utilizada'
      WHEN e.token_expira IS NOT NULL AND e.token_expira < NOW() THEN 'La invitación ha expirado'
      ELSE 'Invitación válida'
    END AS mensaje
  FROM empleados e
  LEFT JOIN empresas emp ON e.empresa_id = emp.id
  LEFT JOIN departamentos d ON e.departamento_id = d.id
  WHERE e.token_invitacion = p_token;

  -- Si no encontro nada, retornar registro con error
  IF NOT FOUND THEN
    RETURN QUERY SELECT
      NULL::UUID,
      NULL::TEXT,
      NULL::TEXT,
      NULL::UUID,
      NULL::TEXT,
      NULL::UUID,
      NULL::TEXT,
      false,
      'Token de invitación no válido'::TEXT;
  END IF;
END;
$$;

-- Funcion para completar registro de empleado invitado
CREATE OR REPLACE FUNCTION completar_registro_empleado(
  p_token UUID,
  p_auth_user_id UUID,
  p_nombre TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_empleado_id UUID;
  v_estado TEXT;
  v_token_expira TIMESTAMPTZ;
BEGIN
  -- Buscar empleado por token
  SELECT id, estado, token_expira INTO v_empleado_id, v_estado, v_token_expira
  FROM empleados
  WHERE token_invitacion = p_token;

  IF v_empleado_id IS NULL THEN
    RAISE EXCEPTION 'Token de invitación no válido';
  END IF;

  IF v_estado != 'Invitado' THEN
    RAISE EXCEPTION 'Esta invitación ya fue utilizada';
  END IF;

  IF v_token_expira IS NOT NULL AND v_token_expira < NOW() THEN
    RAISE EXCEPTION 'La invitación ha expirado';
  END IF;

  -- Actualizar empleado con auth_user_id y estado activo
  UPDATE empleados
  SET
    auth_user_id = p_auth_user_id,
    estado = 'Activo',
    nombre = COALESCE(p_nombre, nombre),
    token_invitacion = NULL,  -- Invalidar token
    token_expira = NULL
  WHERE id = v_empleado_id;

  RETURN v_empleado_id;
END;
$$;

-- Funcion para buscar empresa por dominio de email
CREATE OR REPLACE FUNCTION buscar_empresa_por_email(p_email TEXT)
RETURNS TABLE (
  empresa_id UUID,
  empresa_nombre TEXT,
  dominio TEXT,
  encontrada BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dominio TEXT;
BEGIN
  -- Extraer dominio del email
  v_dominio := lower(substring(p_email from '@(.*)$'));

  RETURN QUERY
  SELECT
    e.id AS empresa_id,
    e.nombre AS empresa_nombre,
    e.dominio,
    true AS encontrada
  FROM empresas e
  WHERE e.dominio = v_dominio
  AND e.activa = true;

  -- Si no encontro, retornar registro vacio
  IF NOT FOUND THEN
    RETURN QUERY SELECT
      NULL::UUID,
      NULL::TEXT,
      v_dominio,
      false;
  END IF;
END;
$$;

COMMENT ON COLUMN empleados.token_invitacion IS 'Token UUID unico para invitacion de empleado';
COMMENT ON COLUMN empleados.token_expira IS 'Fecha de expiracion del token de invitacion';
COMMENT ON FUNCTION validar_token_invitacion IS 'Valida un token de invitacion y retorna datos del empleado';
COMMENT ON FUNCTION completar_registro_empleado IS 'Completa el registro de un empleado invitado';
COMMENT ON FUNCTION buscar_empresa_por_email IS 'Busca empresa por dominio del email para auto-registro';
