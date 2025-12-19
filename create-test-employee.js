/**
 * Script para crear un empleado de prueba
 *
 * Ejecutar con: node create-test-employee.js
 *
 * IMPORTANTE: Necesitas el Service Role Key de Supabase para crear usuarios
 */

import { createClient } from '@supabase/supabase-js';

// Configuración - USA TU SERVICE_ROLE_KEY (no la anon key)
const SUPABASE_URL = 'https://vrmxccuklpnysvtnmfja.supabase.co';
// ⚠️ REEMPLAZA ESTO con tu Service Role Key de Supabase Dashboard > Settings > API
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'TU_SERVICE_ROLE_KEY_AQUI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestEmployee() {
  const email = 'empleado@smartbienestar.com';
  const password = 'demo123';

  console.log('🚀 Creando empleado de prueba...\n');

  try {
    // 1. Verificar/crear empresa smartbienestar.com
    console.log('1️⃣ Verificando empresa smartbienestar.com...');

    let { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('dominio', 'smartbienestar.com')
      .single();

    if (!empresa) {
      console.log('   → Empresa no existe, creándola...');
      const { data: newEmpresa, error: createError } = await supabase
        .from('empresas')
        .insert({
          nombre: 'SMART Bienestar',
          dominio: 'smartbienestar.com',
          activo: true,
          activa: true
        })
        .select()
        .single();

      if (createError) {
        console.error('   ❌ Error creando empresa:', createError.message);
        return;
      }
      empresa = newEmpresa;
      console.log('   ✅ Empresa creada:', empresa.nombre);
    } else {
      console.log('   ✅ Empresa encontrada:', empresa.nombre);
    }

    // 2. Crear usuario en auth.users
    console.log('\n2️⃣ Creando usuario en Authentication...');

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: {
        nombre: 'Empleado Demo'
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('   ⚠️ Usuario ya existe en Auth, buscándolo...');

        // Buscar usuario existente
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        const existingUser = users?.find(u => u.email === email);

        if (existingUser) {
          console.log('   ✅ Usuario encontrado en Auth:', existingUser.id);

          // Verificar si ya existe el empleado
          const { data: existingEmpleado } = await supabase
            .from('empleados')
            .select('*')
            .eq('email', email)
            .single();

          if (existingEmpleado) {
            console.log('   ✅ Empleado ya existe:', existingEmpleado.nombre);
            console.log('\n✨ LISTO! Puedes iniciar sesión con:');
            console.log(`   📧 Email: ${email}`);
            console.log(`   🔑 Password: ${password}`);
            return;
          }
        }
      } else {
        console.error('   ❌ Error creando usuario:', authError.message);
        return;
      }
    } else {
      console.log('   ✅ Usuario creado en Auth:', authUser.user.id);
    }

    const userId = authUser?.user?.id;

    // 3. Crear/actualizar empleado en tabla empleados
    console.log('\n3️⃣ Creando registro de empleado...');

    // Verificar si ya existe el empleado
    const { data: existingEmpleado } = await supabase
      .from('empleados')
      .select('*')
      .eq('email', email)
      .single();

    if (existingEmpleado) {
      // Actualizar con auth_user_id
      const { error: updateError } = await supabase
        .from('empleados')
        .update({
          auth_user_id: userId,
          empresa_id: empresa.id,
          estado: 'Activo'
        })
        .eq('email', email);

      if (updateError) {
        console.error('   ❌ Error actualizando empleado:', updateError.message);
      } else {
        console.log('   ✅ Empleado actualizado');
      }
    } else {
      // Crear nuevo empleado
      const { error: insertError } = await supabase
        .from('empleados')
        .insert({
          auth_user_id: userId,
          email: email,
          nombre: 'Empleado Demo',
          empresa_id: empresa.id,
          estado: 'Activo',
          cargo: 'Empleado',
          puntos: 150,
          es_admin: false
        });

      if (insertError) {
        console.error('   ❌ Error creando empleado:', insertError.message);
        return;
      }
      console.log('   ✅ Empleado creado con 150 puntos iniciales');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✨ EMPLEADO DE PRUEBA CREADO EXITOSAMENTE!');
    console.log('='.repeat(50));
    console.log(`\n📧 Email:    ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🏢 Empresa:  ${empresa.nombre}`);
    console.log('\n➡️  Ahora ve a la app y haz login con estas credenciales');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Verificar que tenemos el service role key
if (SERVICE_ROLE_KEY === 'TU_SERVICE_ROLE_KEY_AQUI') {
  console.log('⚠️  IMPORTANTE: Necesitas configurar el Service Role Key\n');
  console.log('1. Ve a Supabase Dashboard > Settings > API');
  console.log('2. Copia el "service_role" key (NO la anon key)');
  console.log('3. Ejecuta así:');
  console.log('\n   SUPABASE_SERVICE_ROLE_KEY="tu-key-aqui" node create-test-employee.js\n');
  console.log('O edita este archivo y reemplaza TU_SERVICE_ROLE_KEY_AQUI');
  process.exit(1);
}

createTestEmployee();
