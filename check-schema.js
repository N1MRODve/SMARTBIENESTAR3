// Script para verificar el esquema de la BD
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vrmxccuklpnysvtnmfja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXhjY3VrbHBueXN2dG5tZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzIwMTQsImV4cCI6MjA2MzI0ODAxNH0.e2J2o2o0Cv0-gJpTzt27pXThEg0jMSZWKOfdrCGpe2k'
);

async function checkSchema() {
  console.log('🔍 Verificando esquema de tablas...\n');

  // Check empresas
  const { data: empresas, error: empError } = await supabase
    .from('empresas')
    .select('*')
    .limit(1);

  if (empError) {
    console.log('❌ Error en empresas:', empError.message);
  } else {
    console.log('✅ Tabla empresas:');
    if (empresas && empresas.length > 0) {
      console.log('   Columnas:', Object.keys(empresas[0]));
      console.log('   Ejemplo:', empresas[0]);
    } else {
      console.log('   (vacía - intenta insertar para ver columnas requeridas)');
    }
  }

  console.log('\n');

  // Check departamentos
  const { data: deptos, error: deptoError } = await supabase
    .from('departamentos')
    .select('*')
    .limit(1);

  if (deptoError) {
    console.log('❌ Error en departamentos:', deptoError.message);
  } else {
    console.log('✅ Tabla departamentos:');
    if (deptos && deptos.length > 0) {
      console.log('   Columnas:', Object.keys(deptos[0]));
    } else {
      console.log('   (vacía)');
    }
  }

  console.log('\n');

  // Check empleados
  const { data: empleados, error: empError2 } = await supabase
    .from('empleados')
    .select('*')
    .limit(1);

  if (empError2) {
    console.log('❌ Error en empleados:', empError2.message);
  } else {
    console.log('✅ Tabla empleados:');
    if (empleados && empleados.length > 0) {
      console.log('   Columnas:', Object.keys(empleados[0]));
    } else {
      console.log('   (vacía)');
    }
  }
}

checkSchema();
