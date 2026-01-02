-- =====================================================
-- DIAGNÓSTICO: Verificar empleados sin departamento_id
-- =====================================================
-- Este script NO modifica datos, solo muestra diagnóstico
-- Ejecutar en Supabase SQL Editor para verificar estado
-- =====================================================

-- 1. Contar empleados totales vs con departamento asignado
DO $$
DECLARE
  v_total_empleados integer;
  v_con_departamento integer;
  v_sin_departamento integer;
  v_total_departamentos integer;
BEGIN
  SELECT COUNT(*) INTO v_total_empleados FROM empleados WHERE estado = 'Activo';
  SELECT COUNT(*) INTO v_con_departamento FROM empleados WHERE estado = 'Activo' AND departamento_id IS NOT NULL;
  SELECT COUNT(*) INTO v_sin_departamento FROM empleados WHERE estado = 'Activo' AND departamento_id IS NULL;
  SELECT COUNT(*) INTO v_total_departamentos FROM departamentos;

  RAISE NOTICE '=== DIAGNÓSTICO DE DEPARTAMENTOS ===';
  RAISE NOTICE 'Total departamentos en BD: %', v_total_departamentos;
  RAISE NOTICE 'Total empleados activos: %', v_total_empleados;
  RAISE NOTICE 'Empleados CON departamento_id: %', v_con_departamento;
  RAISE NOTICE 'Empleados SIN departamento_id: %', v_sin_departamento;
  RAISE NOTICE '------------------------------------';

  IF v_sin_departamento > 0 THEN
    RAISE NOTICE '⚠️  Hay % empleados sin departamento asignado.', v_sin_departamento;
    RAISE NOTICE 'El admin debe editarlos y asignarles un departamento';
    RAISE NOTICE 'para que aparezcan en el conteo de comunicados.';
  ELSE
    RAISE NOTICE '✅ Todos los empleados tienen departamento asignado.';
  END IF;
END $$;

-- 2. Mostrar detalle de empleados sin departamento (primeros 20)
SELECT
  e.id,
  e.nombre,
  e.email,
  e.estado,
  e.departamento_id,
  emp.nombre as empresa
FROM empleados e
LEFT JOIN empresas emp ON e.empresa_id = emp.id
WHERE e.departamento_id IS NULL
  AND e.estado = 'Activo'
ORDER BY e.created_at DESC
LIMIT 20;

-- 3. Mostrar conteo de empleados por departamento
SELECT
  d.nombre as departamento,
  COUNT(e.id) as empleados_activos
FROM departamentos d
LEFT JOIN empleados e ON e.departamento_id = d.id AND e.estado = 'Activo'
GROUP BY d.id, d.nombre
ORDER BY d.nombre;
