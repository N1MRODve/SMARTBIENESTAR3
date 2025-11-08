/*
  # Permitir que usuarios recién registrados creen su propio empleado

  1. Problema
    - Durante el registro, el usuario intenta crear su empleado
    - La política actual usa obtener_empresa_id_usuario() que retorna NULL
    - El empleado no existe todavía, así que la función falla

  2. Solución
    - Agregar política que permite crear empleado si auth_user_id = auth.uid()
    - Esto permite que el usuario cree SU PROPIO registro de empleado
    - Después, las políticas normales funcionan

  3. Seguridad
    - El usuario solo puede crear UN empleado con su propio auth_user_id
    - No puede crear empleados para otros usuarios
    - La restricción UNIQUE en auth_user_id previene duplicados
*/

-- Eliminar política restrictiva actual de INSERT
DROP POLICY IF EXISTS "Usuarios pueden crear empleados en su empresa" ON empleados;

-- Crear política que permite crear propio empleado (primera vez)
CREATE POLICY "Usuarios pueden crear su propio empleado"
  ON empleados FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Crear política que permite crear otros empleados si ya eres empleado de la empresa
CREATE POLICY "Admins pueden crear empleados en su empresa"
  ON empleados FOR INSERT
  TO authenticated
  WITH CHECK (
    empresa_id IN (
      SELECT empresa_id 
      FROM empleados 
      WHERE auth_user_id = auth.uid() 
        AND es_admin = true
    )
  );