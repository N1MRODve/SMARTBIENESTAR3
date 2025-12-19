-- ============================================
-- Vincular usuario existente con empresa
-- Usuario: empleado@smartbienestar.com
-- Auth ID: 3e31f6a4-5b3b-4296-945b-b93c490602d2
-- ============================================

-- 1. Primero asegurar que existe la empresa
INSERT INTO empresas (nombre, dominio, activo, activa)
VALUES ('SMART Bienestar', 'smartbienestar.com', true, true)
ON CONFLICT (dominio) DO UPDATE SET activo = true, activa = true;

-- 2. Obtener el ID de la empresa
DO $$
DECLARE
  v_empresa_id uuid;
  v_auth_user_id uuid := '3e31f6a4-5b3b-4296-945b-b93c490602d2';
  v_email text := 'empleado@smartbienestar.com';
BEGIN
  -- Obtener empresa_id
  SELECT id INTO v_empresa_id FROM empresas WHERE dominio = 'smartbienestar.com';

  RAISE NOTICE 'Empresa ID: %', v_empresa_id;

  -- Verificar si ya existe el empleado
  IF EXISTS (SELECT 1 FROM empleados WHERE email = v_email) THEN
    -- Actualizar empleado existente
    UPDATE empleados
    SET
      auth_user_id = v_auth_user_id,
      empresa_id = v_empresa_id,
      estado = 'Activo',
      updated_at = now()
    WHERE email = v_email;

    RAISE NOTICE 'Empleado actualizado: %', v_email;
  ELSE
    -- Crear nuevo empleado
    INSERT INTO empleados (
      auth_user_id,
      email,
      nombre,
      empresa_id,
      estado,
      cargo,
      puntos,
      es_admin
    ) VALUES (
      v_auth_user_id,
      v_email,
      'Empleado Demo',
      v_empresa_id,
      'Activo',
      'Empleado',
      150,
      false
    );

    RAISE NOTICE 'Empleado creado: %', v_email;
  END IF;
END $$;

-- 3. Verificar que se creó correctamente
SELECT
  e.id,
  e.nombre,
  e.email,
  e.auth_user_id,
  e.empresa_id,
  e.estado,
  e.puntos,
  e.es_admin,
  emp.nombre as empresa_nombre,
  emp.dominio as empresa_dominio
FROM empleados e
LEFT JOIN empresas emp ON e.empresa_id = emp.id
WHERE e.email = 'empleado@smartbienestar.com';
