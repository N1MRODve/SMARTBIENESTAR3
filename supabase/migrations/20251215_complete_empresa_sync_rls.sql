/*
  # Sistema Completo de Sincronización de Usuarios y RLS por Empresa

  Este archivo ÚNICO contiene todo lo necesario para:
  1. Auto-crear empleados cuando se registran usuarios
  2. Asociarlos automáticamente a su empresa por dominio de email
  3. Aplicar RLS para que solo vean datos de su empresa

  INSTRUCCIONES:
  - Ejecutar este archivo completo en Supabase SQL Editor
  - Asegúrate de tener al menos una empresa creada con dominio_email
*/

-- ============================================
-- PASO 1: Crear tabla servicios_contratados si no existe
-- ============================================

CREATE TABLE IF NOT EXISTS servicios_contratados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_servicio text NOT NULL,
  fecha_inicio timestamptz DEFAULT now(),
  fecha_fin timestamptz,
  activo boolean DEFAULT true,
  creado_por uuid REFERENCES auth.users(id),
  notas text,
  fecha_creacion timestamptz DEFAULT now()
);

ALTER TABLE servicios_contratados ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: Agregar columnas empresa_id y es_admin a empleados
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE empleados ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'empleados' AND column_name = 'es_admin'
  ) THEN
    ALTER TABLE empleados ADD COLUMN es_admin boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_empleados_empresa ON empleados(empresa_id);

-- ============================================
-- PASO 3: Agregar empresa_id a otras tablas
-- ============================================

-- Comunicados
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'comunicados' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE comunicados ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Recompensas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recompensas' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE recompensas ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Departamentos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'departamentos' AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE departamentos ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Sesiones (si existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sesiones') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'sesiones' AND column_name = 'empresa_id'
    ) THEN
      ALTER TABLE sesiones ADD COLUMN empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_comunicados_empresa ON comunicados(empresa_id);
CREATE INDEX IF NOT EXISTS idx_recompensas_empresa ON recompensas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_departamentos_empresa ON departamentos(empresa_id);

-- ============================================
-- PASO 4: Funciones Helper (CREAR PRIMERO)
-- ============================================

-- Función para obtener empresa por dominio de email
-- Busca en columna 'dominio' (nombre actual en tu esquema)
CREATE OR REPLACE FUNCTION get_empresa_by_email_domain(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_domain text;
  empresa_uuid uuid;
BEGIN
  email_domain := lower(split_part(user_email, '@', 2));

  -- Buscar por dominio
  SELECT id INTO empresa_uuid
  FROM empresas
  WHERE dominio = email_domain
    AND activa = true
  LIMIT 1;

  RETURN empresa_uuid;
END;
$$;

-- Función para obtener empresa_id del usuario actual
CREATE OR REPLACE FUNCTION get_my_empresa_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  emp_empresa_id uuid;
BEGIN
  SELECT empresa_id INTO emp_empresa_id
  FROM empleados
  WHERE auth_user_id = auth.uid()
  LIMIT 1;

  RETURN emp_empresa_id;
END;
$$;

-- Función para verificar si es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM empleados
    WHERE auth_user_id = auth.uid()
      AND es_admin = true
  );
END;
$$;

-- ============================================
-- PASO 5: Trigger para auto-crear empleados
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  empresa_uuid uuid;
  user_nombre text;
  email_local text;
BEGIN
  -- Obtener empresa por dominio de email
  empresa_uuid := get_empresa_by_email_domain(NEW.email);

  -- Si no hay empresa, no crear empleado automáticamente
  IF empresa_uuid IS NULL THEN
    RETURN NEW;
  END IF;

  -- Extraer nombre del email
  email_local := split_part(NEW.email, '@', 1);
  user_nombre := initcap(replace(replace(email_local, '.', ' '), '-', ' '));

  -- Verificar si ya existe empleado con este email
  IF NOT EXISTS (SELECT 1 FROM empleados WHERE email = NEW.email) THEN
    INSERT INTO empleados (
      auth_user_id,
      email,
      nombre,
      empresa_id,
      estado,
      puntos,
      es_admin
    ) VALUES (
      NEW.id,
      NEW.email,
      user_nombre,
      empresa_uuid,
      'Activo',
      0,
      false
    );
  ELSE
    -- Si existe (fue invitado), vincular con auth_user_id
    UPDATE empleados
    SET
      auth_user_id = NEW.id,
      empresa_id = COALESCE(empresa_id, empresa_uuid),
      estado = 'Activo',
      updated_at = now()
    WHERE email = NEW.email
      AND auth_user_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PASO 6: Actualizar empleados existentes sin empresa_id
-- ============================================

UPDATE empleados e
SET empresa_id = get_empresa_by_email_domain(e.email)
WHERE e.empresa_id IS NULL
  AND e.email IS NOT NULL;

-- ============================================
-- PASO 7: LIMPIAR TODAS LAS POLÍTICAS ANTERIORES
-- ============================================

-- Empleados
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer empleados" ON empleados;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON empleados;
DROP POLICY IF EXISTS "Cualquier usuario autenticado puede crear empleados" ON empleados;
DROP POLICY IF EXISTS "Cualquier usuario autenticado puede eliminar empleados" ON empleados;
DROP POLICY IF EXISTS "Usuarios pueden crear su propio empleado" ON empleados;
DROP POLICY IF EXISTS "Usuarios pueden crear empleados en su empresa" ON empleados;
DROP POLICY IF EXISTS "empleados_select_same_empresa" ON empleados;
DROP POLICY IF EXISTS "empleados_update_own" ON empleados;
DROP POLICY IF EXISTS "empleados_insert_admin" ON empleados;
DROP POLICY IF EXISTS "empleados_delete_admin" ON empleados;

-- Empresas
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON empresas;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON empresas;
DROP POLICY IF EXISTS "empresas_select_own" ON empresas;
DROP POLICY IF EXISTS "empresas_update_admin" ON empresas;

-- Departamentos
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer departamentos" ON departamentos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear departamentos" ON departamentos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar departamentos" ON departamentos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar departamentos" ON departamentos;
DROP POLICY IF EXISTS "departamentos_select_empresa" ON departamentos;
DROP POLICY IF EXISTS "departamentos_insert_admin" ON departamentos;
DROP POLICY IF EXISTS "departamentos_update_admin" ON departamentos;
DROP POLICY IF EXISTS "departamentos_delete_admin" ON departamentos;

-- Encuestas
DROP POLICY IF EXISTS "Users can view all surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can create surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can update their own surveys" ON encuestas;
DROP POLICY IF EXISTS "Users can delete their own surveys" ON encuestas;
DROP POLICY IF EXISTS "encuestas_select_empresa" ON encuestas;
DROP POLICY IF EXISTS "encuestas_insert_admin" ON encuestas;
DROP POLICY IF EXISTS "encuestas_update_admin" ON encuestas;
DROP POLICY IF EXISTS "encuestas_delete_admin" ON encuestas;

-- Preguntas
DROP POLICY IF EXISTS "Users can view all questions" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can create questions for their surveys" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can update questions for their surveys" ON preguntas_encuesta;
DROP POLICY IF EXISTS "Users can delete questions for their surveys" ON preguntas_encuesta;
DROP POLICY IF EXISTS "preguntas_select_empresa" ON preguntas_encuesta;
DROP POLICY IF EXISTS "preguntas_insert_admin" ON preguntas_encuesta;
DROP POLICY IF EXISTS "preguntas_update_admin" ON preguntas_encuesta;
DROP POLICY IF EXISTS "preguntas_delete_admin" ON preguntas_encuesta;

-- Respuestas
DROP POLICY IF EXISTS "Users can view responses for their surveys" ON respuestas_encuesta;
DROP POLICY IF EXISTS "Users can submit responses to active surveys" ON respuestas_encuesta;
DROP POLICY IF EXISTS "respuestas_select" ON respuestas_encuesta;
DROP POLICY IF EXISTS "respuestas_insert_empleado" ON respuestas_encuesta;

-- Comunicados
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer comunicados enviados" ON comunicados;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear comunicados" ON comunicados;
DROP POLICY IF EXISTS "Autores pueden actualizar sus comunicados" ON comunicados;
DROP POLICY IF EXISTS "Autores pueden eliminar sus comunicados" ON comunicados;
DROP POLICY IF EXISTS "comunicados_select_empresa" ON comunicados;
DROP POLICY IF EXISTS "comunicados_insert_admin" ON comunicados;
DROP POLICY IF EXISTS "comunicados_update_admin" ON comunicados;
DROP POLICY IF EXISTS "comunicados_delete_admin" ON comunicados;

-- Comunicados lecturas
DROP POLICY IF EXISTS "Usuarios pueden leer sus propias lecturas" ON comunicados_lecturas;
DROP POLICY IF EXISTS "Usuarios pueden registrar sus lecturas" ON comunicados_lecturas;
DROP POLICY IF EXISTS "lecturas_select_empresa" ON comunicados_lecturas;
DROP POLICY IF EXISTS "lecturas_insert_empleado" ON comunicados_lecturas;

-- Comunicados destinatarios
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer destinatarios" ON comunicados_destinatarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear destinatarios" ON comunicados_destinatarios;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar destinatarios" ON comunicados_destinatarios;
DROP POLICY IF EXISTS "destinatarios_select_empresa" ON comunicados_destinatarios;
DROP POLICY IF EXISTS "destinatarios_insert_admin" ON comunicados_destinatarios;
DROP POLICY IF EXISTS "destinatarios_delete_admin" ON comunicados_destinatarios;

-- Recompensas
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer recompensas activas" ON recompensas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear recompensas" ON recompensas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar recompensas" ON recompensas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar recompensas" ON recompensas;
DROP POLICY IF EXISTS "recompensas_select_empresa" ON recompensas;
DROP POLICY IF EXISTS "recompensas_insert_admin" ON recompensas;
DROP POLICY IF EXISTS "recompensas_update_admin" ON recompensas;
DROP POLICY IF EXISTS "recompensas_delete_admin" ON recompensas;

-- Canjes
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios canjes" ON canjes_recompensas;
DROP POLICY IF EXISTS "Administradores pueden ver todos los canjes" ON canjes_recompensas;
DROP POLICY IF EXISTS "Usuarios pueden crear canjes" ON canjes_recompensas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar canjes" ON canjes_recompensas;
DROP POLICY IF EXISTS "canjes_select_empresa" ON canjes_recompensas;
DROP POLICY IF EXISTS "canjes_insert_empleado" ON canjes_recompensas;
DROP POLICY IF EXISTS "canjes_update_admin" ON canjes_recompensas;

-- Servicios contratados
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON servicios_contratados;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON servicios_contratados;
DROP POLICY IF EXISTS "servicios_select_empresa" ON servicios_contratados;
DROP POLICY IF EXISTS "servicios_insert_admin" ON servicios_contratados;

-- ============================================
-- PASO 8: CREAR NUEVAS POLÍTICAS RLS POR EMPRESA
-- ============================================

-- === EMPLEADOS ===
CREATE POLICY "empleados_select_same_empresa"
  ON empleados FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id());

CREATE POLICY "empleados_update_own"
  ON empleados FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "empleados_insert_admin"
  ON empleados FOR INSERT TO authenticated
  WITH CHECK (
    (empresa_id = get_my_empresa_id() AND is_admin())
    OR auth_user_id = auth.uid()
  );

CREATE POLICY "empleados_delete_admin"
  ON empleados FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

-- === EMPRESAS ===
CREATE POLICY "empresas_select_own"
  ON empresas FOR SELECT TO authenticated
  USING (id = get_my_empresa_id());

CREATE POLICY "empresas_update_admin"
  ON empresas FOR UPDATE TO authenticated
  USING (id = get_my_empresa_id() AND is_admin())
  WITH CHECK (id = get_my_empresa_id() AND is_admin());

-- === DEPARTAMENTOS ===
CREATE POLICY "departamentos_select_empresa"
  ON departamentos FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id() OR empresa_id IS NULL);

CREATE POLICY "departamentos_insert_admin"
  ON departamentos FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "departamentos_update_admin"
  ON departamentos FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "departamentos_delete_admin"
  ON departamentos FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

-- === ENCUESTAS ===
CREATE POLICY "encuestas_select_empresa"
  ON encuestas FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id());

CREATE POLICY "encuestas_insert_admin"
  ON encuestas FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "encuestas_update_admin"
  ON encuestas FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin())
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "encuestas_delete_admin"
  ON encuestas FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

-- === PREGUNTAS_ENCUESTA ===
CREATE POLICY "preguntas_select_empresa"
  ON preguntas_encuesta FOR SELECT TO authenticated
  USING (encuesta_id IN (SELECT id FROM encuestas WHERE empresa_id = get_my_empresa_id()));

CREATE POLICY "preguntas_insert_admin"
  ON preguntas_encuesta FOR INSERT TO authenticated
  WITH CHECK (
    encuesta_id IN (SELECT id FROM encuestas WHERE empresa_id = get_my_empresa_id())
    AND is_admin()
  );

CREATE POLICY "preguntas_update_admin"
  ON preguntas_encuesta FOR UPDATE TO authenticated
  USING (encuesta_id IN (SELECT id FROM encuestas WHERE empresa_id = get_my_empresa_id()) AND is_admin());

CREATE POLICY "preguntas_delete_admin"
  ON preguntas_encuesta FOR DELETE TO authenticated
  USING (encuesta_id IN (SELECT id FROM encuestas WHERE empresa_id = get_my_empresa_id()) AND is_admin());

-- === RESPUESTAS_ENCUESTA ===
CREATE POLICY "respuestas_select"
  ON respuestas_encuesta FOR SELECT TO authenticated
  USING (
    encuesta_id IN (SELECT id FROM encuestas WHERE empresa_id = get_my_empresa_id())
    AND (is_admin() OR empleado_id = auth.uid())
  );

CREATE POLICY "respuestas_insert_empleado"
  ON respuestas_encuesta FOR INSERT TO authenticated
  WITH CHECK (
    encuesta_id IN (
      SELECT id FROM encuestas
      WHERE empresa_id = get_my_empresa_id() AND estado = 'activa'
    )
  );

-- === COMUNICADOS ===
CREATE POLICY "comunicados_select_empresa"
  ON comunicados FOR SELECT TO authenticated
  USING (
    empresa_id = get_my_empresa_id()
    AND (estado IN ('enviado', 'programado') OR is_admin())
  );

CREATE POLICY "comunicados_insert_admin"
  ON comunicados FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "comunicados_update_admin"
  ON comunicados FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin())
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "comunicados_delete_admin"
  ON comunicados FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

-- === COMUNICADOS_LECTURAS ===
CREATE POLICY "lecturas_select_empresa"
  ON comunicados_lecturas FOR SELECT TO authenticated
  USING (
    comunicado_id IN (SELECT id FROM comunicados WHERE empresa_id = get_my_empresa_id())
    AND (
      empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
      OR is_admin()
    )
  );

CREATE POLICY "lecturas_insert_empleado"
  ON comunicados_lecturas FOR INSERT TO authenticated
  WITH CHECK (
    empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
    AND comunicado_id IN (SELECT id FROM comunicados WHERE empresa_id = get_my_empresa_id())
  );

-- === COMUNICADOS_DESTINATARIOS ===
CREATE POLICY "destinatarios_select_empresa"
  ON comunicados_destinatarios FOR SELECT TO authenticated
  USING (comunicado_id IN (SELECT id FROM comunicados WHERE empresa_id = get_my_empresa_id()));

CREATE POLICY "destinatarios_insert_admin"
  ON comunicados_destinatarios FOR INSERT TO authenticated
  WITH CHECK (
    comunicado_id IN (SELECT id FROM comunicados WHERE empresa_id = get_my_empresa_id())
    AND is_admin()
  );

CREATE POLICY "destinatarios_delete_admin"
  ON comunicados_destinatarios FOR DELETE TO authenticated
  USING (
    comunicado_id IN (SELECT id FROM comunicados WHERE empresa_id = get_my_empresa_id())
    AND is_admin()
  );

-- === RECOMPENSAS ===
CREATE POLICY "recompensas_select_empresa"
  ON recompensas FOR SELECT TO authenticated
  USING (
    activa = true
    AND (empresa_id = get_my_empresa_id() OR empresa_id IS NULL)
  );

CREATE POLICY "recompensas_insert_admin"
  ON recompensas FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "recompensas_update_admin"
  ON recompensas FOR UPDATE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin())
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

CREATE POLICY "recompensas_delete_admin"
  ON recompensas FOR DELETE TO authenticated
  USING (empresa_id = get_my_empresa_id() AND is_admin());

-- === CANJES_RECOMPENSAS ===
CREATE POLICY "canjes_select_empresa"
  ON canjes_recompensas FOR SELECT TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE empresa_id = get_my_empresa_id())
    AND (
      empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid())
      OR is_admin()
    )
  );

CREATE POLICY "canjes_insert_empleado"
  ON canjes_recompensas FOR INSERT TO authenticated
  WITH CHECK (empleado_id IN (SELECT id FROM empleados WHERE auth_user_id = auth.uid()));

CREATE POLICY "canjes_update_admin"
  ON canjes_recompensas FOR UPDATE TO authenticated
  USING (
    empleado_id IN (SELECT id FROM empleados WHERE empresa_id = get_my_empresa_id())
    AND is_admin()
  );

-- === SERVICIOS_CONTRATADOS ===
CREATE POLICY "servicios_select_empresa"
  ON servicios_contratados FOR SELECT TO authenticated
  USING (empresa_id = get_my_empresa_id());

CREATE POLICY "servicios_insert_admin"
  ON servicios_contratados FOR INSERT TO authenticated
  WITH CHECK (empresa_id = get_my_empresa_id() AND is_admin());

-- ============================================
-- PASO 9: Actualizar datos existentes
-- ============================================

-- Actualizar comunicados sin empresa_id
UPDATE comunicados c
SET empresa_id = (SELECT empresa_id FROM empleados e WHERE e.id = c.autor_id)
WHERE c.empresa_id IS NULL AND c.autor_id IS NOT NULL;

-- Actualizar encuestas sin empresa_id
UPDATE encuestas e
SET empresa_id = (SELECT emp.empresa_id FROM empleados emp WHERE emp.auth_user_id = e.creado_por)
WHERE e.empresa_id IS NULL AND e.creado_por IS NOT NULL;

-- ============================================
-- PASO 10: Vista del perfil del usuario actual
-- ============================================

DROP VIEW IF EXISTS mi_perfil;
CREATE VIEW mi_perfil AS
SELECT
  e.id,
  e.nombre,
  e.email,
  e.cargo,
  e.estado,
  e.puntos,
  e.es_admin,
  e.avatar_url,
  e.empresa_id,
  emp.nombre as empresa_nombre,
  emp.logo_url as empresa_logo,
  emp.dominio as empresa_dominio,
  d.nombre as departamento_nombre
FROM empleados e
LEFT JOIN empresas emp ON e.empresa_id = emp.id
LEFT JOIN departamentos d ON e.departamento_id = d.id
WHERE e.auth_user_id = auth.uid();

-- ============================================
-- PASO 11: Función para obtener empleados de mi empresa
-- ============================================

CREATE OR REPLACE FUNCTION get_empleados_mi_empresa()
RETURNS SETOF empleados
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM empleados WHERE empresa_id = get_my_empresa_id();
$$;

-- ============================================
-- LISTO! Verificar con esta consulta:
-- ============================================
-- SELECT * FROM mi_perfil;
-- SELECT * FROM get_empleados_mi_empresa();
