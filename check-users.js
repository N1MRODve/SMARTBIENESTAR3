// Script para verificar usuarios en Supabase Cloud
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vrmxccuklpnysvtnmfja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybXhjY3VrbHBueXN2dG5tZmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzIwMTQsImV4cCI6MjA2MzI0ODAxNH0.e2J2o2o0Cv0-gJpTzt27pXThEg0jMSZWKOfdrCGpe2k'
);

async function checkUsers() {
  console.log('🔍 Verificando usuarios en auth.users...\n');

  // Check auth users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    console.error('❌ Error al obtener usuarios de auth:', authError);
  } else {
    console.log(`📧 Total de usuarios en auth: ${authUsers.users.length}\n`);
    authUsers.users.forEach((user, index) => {
      console.log(`Usuario ${index + 1}:`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Confirmado: ${user.email_confirmed_at ? 'Sí' : 'No'}`);
      console.log(`  - Creado: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });
  }

  console.log('\n👤 Verificando empleados...\n');

  // Check empleados table
  const { data: empleados, error: empError } = await supabase
    .from('empleados')
    .select('id, email, nombre, es_admin, auth_user_id, estado')
    .order('created_at', { ascending: false });

  if (empError) {
    console.error('❌ Error al obtener empleados:', empError);
  } else {
    console.log(`👥 Total de empleados: ${empleados.length}\n`);
    empleados.forEach((emp, index) => {
      console.log(`Empleado ${index + 1}:`);
      console.log(`  - Nombre: ${emp.nombre}`);
      console.log(`  - Email: ${emp.email}`);
      console.log(`  - Es Admin: ${emp.es_admin ? 'SÍ ✅' : 'No'}`);
      console.log(`  - Auth User ID: ${emp.auth_user_id || 'NO VINCULADO ⚠️'}`);
      console.log(`  - Estado: ${emp.estado}`);
      console.log('');
    });
  }

  // Check for mismatches
  console.log('\n🔗 Verificando vinculación...\n');
  const authUserIds = new Set(authUsers.users.map(u => u.id));
  const empleadoAuthIds = new Set(empleados.map(e => e.auth_user_id).filter(Boolean));

  const unlinkedAuth = authUsers.users.filter(u => !empleadoAuthIds.has(u.id));
  const unlinkedEmpleados = empleados.filter(e => !e.auth_user_id || !authUserIds.has(e.auth_user_id));

  if (unlinkedAuth.length > 0) {
    console.log('⚠️  Usuarios en auth.users SIN empleado vinculado:');
    unlinkedAuth.forEach(u => console.log(`  - ${u.email} (${u.id})`));
    console.log('');
  }

  if (unlinkedEmpleados.length > 0) {
    console.log('⚠️  Empleados SIN auth_user_id vinculado:');
    unlinkedEmpleados.forEach(e => console.log(`  - ${e.email} (${e.nombre})`));
    console.log('');
  }

  if (unlinkedAuth.length === 0 && unlinkedEmpleados.length === 0) {
    console.log('✅ Todos los usuarios están correctamente vinculados');
  }
}

checkUsers().catch(console.error);
