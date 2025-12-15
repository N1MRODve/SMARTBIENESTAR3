// Script para vincular usuario existente como administrador
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vrmxccuklpnysvtnmfja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXhjY3VrbHBueXN2dG5tZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzIwMTQsImV4cCI6MjA2MzI0ODAxNH0.e2J2o2o0Cv0-gJpTzt27pXThEg0jMSZWKOfdrCGpe2k'
);

const AUTH_USER_ID = '2c74677c-46ce-427f-8182-d4d292188357';

async function vincularAdmin() {
  console.log('🔗 Vinculando usuario como administrador...\n');
  console.log('Auth User ID:', AUTH_USER_ID);
  console.log('');

  try {
    // 1. Verificar si ya existe empleado con este auth_user_id
    const { data: empleadoExistente } = await supabase
      .from('empleados')
      .select('*')
      .eq('auth_user_id', AUTH_USER_ID)
      .maybeSingle();

    if (empleadoExistente) {
      console.log('✅ Ya existe un empleado vinculado a este usuario');
      console.log('   Nombre:', empleadoExistente.nombre);
      console.log('   Email:', empleadoExistente.email);
      console.log('   Es Admin:', empleadoExistente.es_admin);

      if (!empleadoExistente.es_admin) {
        console.log('\n🔄 Actualizando a administrador...');
        const { error: updateError } = await supabase
          .from('empleados')
          .update({ es_admin: true, estado: 'Activo' })
          .eq('id', empleadoExistente.id);

        if (updateError) throw updateError;
        console.log('✅ Usuario actualizado a administrador');
      } else {
        console.log('✅ El usuario ya es administrador');
      }

      console.log('\n🎉 ¡Listo! Puedes iniciar sesión.');
      return;
    }

    // 2. No existe empleado, vamos a crearlo
    console.log('📝 Creando registro de empleado...\n');

    // Primero necesitamos empresa y departamento
    let empresaId, departamentoId;

    // Verificar si existe alguna empresa
    const { data: empresas } = await supabase
      .from('empresas')
      .select('id, nombre')
      .limit(1);

    if (empresas && empresas.length > 0) {
      empresaId = empresas[0].id;
      console.log('✅ Usando empresa existente:', empresas[0].nombre);
    } else {
      // Crear empresa - solo con nombre requerido
      const { data: nuevaEmpresa, error: empresaError } = await supabase
        .from('empresas')
        .insert([{
          nombre: 'Smart Bienestar'
        }])
        .select()
        .single();

      if (empresaError) throw empresaError;
      empresaId = nuevaEmpresa.id;
      console.log('✅ Empresa creada: Smart Bienestar');
    }

    // Verificar si existe departamento para esta empresa
    const { data: departamentos } = await supabase
      .from('departamentos')
      .select('id, nombre')
      .eq('empresa_id', empresaId)
      .limit(1);

    if (departamentos && departamentos.length > 0) {
      departamentoId = departamentos[0].id;
      console.log('✅ Usando departamento existente:', departamentos[0].nombre);
    } else {
      // Crear departamento
      const { data: nuevoDepto, error: deptoError } = await supabase
        .from('departamentos')
        .insert([{
          empresa_id: empresaId,
          nombre: 'Administración',
          descripcion: 'Departamento de administración'
        }])
        .select()
        .single();

      if (deptoError) throw deptoError;
      departamentoId = nuevoDepto.id;
      console.log('✅ Departamento creado: Administración');
    }

    // 3. Crear el empleado administrador
    const { data: nuevoEmpleado, error: empleadoError } = await supabase
      .from('empleados')
      .insert([{
        auth_user_id: AUTH_USER_ID,
        empresa_id: empresaId,
        departamento_id: departamentoId,
        email: 'admin@smartbienestar.com', // Puedes cambiarlo
        nombre: 'Administrador', // Puedes cambiarlo
        cargo: 'Administrador',
        es_admin: true,
        estado: 'Activo',
        puntos_totales: 0
      }])
      .select()
      .single();

    if (empleadoError) throw empleadoError;

    console.log('✅ Empleado administrador creado');
    console.log('   ID:', nuevoEmpleado.id);
    console.log('   Nombre:', nuevoEmpleado.nombre);
    console.log('   Email:', nuevoEmpleado.email);
    console.log('   Es Admin: ✅ SÍ');

    console.log('\n🎉 ¡Todo listo! Ahora puedes iniciar sesión en la aplicación.');
    console.log('   URL: http://localhost:5173/login');
    console.log('   Usa tu email y contraseña de Supabase Auth\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.details) console.error('Detalles:', error.details);
    if (error.hint) console.error('Sugerencia:', error.hint);
  }
}

vincularAdmin();
