// Script para crear usuario administrador
import { createClient } from '@supabase/supabase-js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const supabase = createClient(
  'https://vrmxccuklpnysvtnmfja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXhjY3VrbHBueXN2dG5tZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzIwMTQsImV4cCI6MjA2MzI0ODAxNH0.e2J2o2o0Cv0-gJpTzt27pXThEg0jMSZWKOfdrCGpe2k'
);

const rl = readline.createInterface({ input, output });

async function createAdmin() {
  console.log('📝 Creación de Usuario Administrador\n');
  console.log('IMPORTANTE: Este script te ayudará a crear un usuario administrador desde cero.\n');

  try {
    // Preguntar datos
    const email = await rl.question('Email del administrador: ');
    const password = await rl.question('Contraseña (mínimo 6 caracteres): ');
    const nombreEmpresa = await rl.question('Nombre de la empresa: ');
    const nombreAdmin = await rl.question('Tu nombre completo: ');

    console.log('\n🔄 Creando cuenta...\n');

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  Este email ya está registrado.');
        console.log('Intentando vincular con empleado...\n');

        // Intentar login para obtener el user_id
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (loginError) {
          throw new Error('No se pudo iniciar sesión. Verifica tu contraseña.');
        }

        authData.user = loginData.user;
      } else {
        throw authError;
      }
    }

    const userId = authData.user.id;
    console.log('✅ Usuario Auth creado/encontrado:', email);
    console.log('   ID:', userId);

    // 2. Verificar si existe la empresa
    let empresaId;
    const { data: empresaExistente } = await supabase
      .from('empresas')
      .select('id')
      .eq('nombre', nombreEmpresa)
      .maybeSingle();

    if (empresaExistente) {
      empresaId = empresaExistente.id;
      console.log('✅ Empresa encontrada:', nombreEmpresa);
    } else {
      // Crear empresa
      const emailDomain = email.split('@')[1];
      const { data: nuevaEmpresa, error: empresaError } = await supabase
        .from('empresas')
        .insert([{
          nombre: nombreEmpresa,
          dominio_email: emailDomain,
          direccion: '',
          telefono: ''
        }])
        .select()
        .single();

      if (empresaError) throw empresaError;

      empresaId = nuevaEmpresa.id;
      console.log('✅ Empresa creada:', nombreEmpresa);
    }

    // 3. Crear o verificar departamento
    let departamentoId;
    const { data: deptoExistente } = await supabase
      .from('departamentos')
      .select('id')
      .eq('empresa_id', empresaId)
      .maybeSingle();

    if (deptoExistente) {
      departamentoId = deptoExistente.id;
      console.log('✅ Departamento encontrado');
    } else {
      const { data: nuevoDepto, error: deptoError } = await supabase
        .from('departamentos')
        .insert([{
          empresa_id: empresaId,
          nombre: 'Administración',
          descripcion: 'Departamento de administración general'
        }])
        .select()
        .single();

      if (deptoError) throw deptoError;

      departamentoId = nuevoDepto.id;
      console.log('✅ Departamento creado');
    }

    // 4. Crear empleado admin
    const { data: empleado, error: empleadoError } = await supabase
      .from('empleados')
      .insert([{
        auth_user_id: userId,
        empresa_id: empresaId,
        departamento_id: departamentoId,
        email: email,
        nombre: nombreAdmin,
        cargo: 'Administrador',
        es_admin: true,
        estado: 'Activo',
        puntos_totales: 0
      }])
      .select()
      .single();

    if (empleadoError) {
      if (empleadoError.code === '23505') {
        console.log('⚠️  Ya existe un empleado con este auth_user_id');

        // Actualizar para asegurar que es admin
        const { error: updateError } = await supabase
          .from('empleados')
          .update({ es_admin: true, estado: 'Activo' })
          .eq('auth_user_id', userId);

        if (updateError) throw updateError;
        console.log('✅ Empleado actualizado a administrador');
      } else {
        throw empleadoError;
      }
    } else {
      console.log('✅ Empleado administrador creado');
    }

    console.log('\n🎉 ¡Listo! Tu usuario administrador está configurado.\n');
    console.log('Puedes iniciar sesión con:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: [la que ingresaste]`);
    console.log('\n👉 Accede a: http://localhost:5173/login\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Detalles:', error);
  } finally {
    rl.close();
  }
}

createAdmin();
