/**
 * Script de diagnóstico para el bug de encuestas pendientes
 *
 * Ejecutar en la consola del navegador (DevTools) cuando estés logueado como empleado:
 *
 * 1. Abre la consola del navegador (F12 → Console)
 * 2. Copia y pega todo este código
 * 3. Ejecuta: diagnosticoEncuestas()
 */

async function diagnosticoEncuestas() {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');

  // Usar las variables de entorno del app (o reemplaza con tus valores)
  const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || window.__SUPABASE_URL__;
  const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || window.__SUPABASE_KEY__;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ No se encontraron las credenciales de Supabase');
    console.log('Por favor, define window.__SUPABASE_URL__ y window.__SUPABASE_KEY__');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 === DIAGNÓSTICO DE ENCUESTAS PENDIENTES ===\n');

  // 1. Obtener usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('❌ No estás autenticado. Por favor inicia sesión primero.');
    return;
  }

  console.log('✅ Usuario autenticado:');
  console.log('   auth.user.id (UUID de auth.users):', user.id);
  console.log('   email:', user.email);

  // 2. Obtener empleado
  const { data: empleado, error: empError } = await supabase
    .from('empleados')
    .select('id, empresa_id, nombre, puntos')
    .eq('auth_user_id', user.id)
    .single();

  if (empError || !empleado) {
    console.error('❌ No se encontró el empleado para este usuario');
    console.error('   Error:', empError);
    return;
  }

  console.log('\n✅ Empleado encontrado:');
  console.log('   empleados.id (UUID de empleados):', empleado.id);
  console.log('   empresa_id:', empleado.empresa_id);
  console.log('   nombre:', empleado.nombre);
  console.log('   puntos:', empleado.puntos);

  console.log('\n⚠️  IMPORTANTE: Estos dos IDs son DIFERENTES:');
  console.log('   - auth.user.id:', user.id);
  console.log('   - empleados.id:', empleado.id);
  console.log('   Las respuestas DEBEN guardarse con empleados.id');

  // 3. Buscar respuestas con AMBOS IDs
  console.log('\n🔍 Buscando respuestas en BD...\n');

  // Respuestas con empleado.id (CORRECTO)
  const { data: respConEmpleadoId, error: err1 } = await supabase
    .from('respuestas_encuesta')
    .select('id, encuesta_id, empleado_id, fecha_respuesta')
    .eq('empleado_id', empleado.id);

  console.log('📋 Respuestas con empleados.id (CORRECTO):');
  console.log('   Encontradas:', respConEmpleadoId?.length || 0);
  if (respConEmpleadoId?.length > 0) {
    respConEmpleadoId.forEach(r => {
      console.log(`   - encuesta_id: ${r.encuesta_id}, fecha: ${r.fecha_respuesta}`);
    });
  }

  // Respuestas con user.id (INCORRECTO - legacy)
  const { data: respConUserId, error: err2 } = await supabase
    .from('respuestas_encuesta')
    .select('id, encuesta_id, empleado_id, fecha_respuesta')
    .eq('empleado_id', user.id);

  console.log('\n📋 Respuestas con auth.user.id (INCORRECTO - legacy):');
  console.log('   Encontradas:', respConUserId?.length || 0);
  if (respConUserId?.length > 0) {
    console.log('   ⚠️  ¡PROBLEMA! Hay respuestas guardadas con el ID incorrecto:');
    respConUserId.forEach(r => {
      console.log(`   - encuesta_id: ${r.encuesta_id}, fecha: ${r.fecha_respuesta}`);
    });
    console.log('\n   🔧 SOLUCIÓN: Estas respuestas deben migrarse de user.id a empleados.id');
  }

  // 4. Encuestas activas de la empresa
  const { data: encuestasActivas } = await supabase
    .from('encuestas')
    .select('id, titulo, estado, fecha_inicio, fecha_fin')
    .eq('empresa_id', empleado.empresa_id)
    .eq('estado', 'activa');

  console.log('\n📋 Encuestas activas de la empresa:');
  console.log('   Total:', encuestasActivas?.length || 0);
  encuestasActivas?.forEach(e => {
    console.log(`   - "${e.titulo}" (${e.id})`);
    console.log(`     inicio: ${e.fecha_inicio}, fin: ${e.fecha_fin}`);
  });

  // 5. Calcular pendientes
  const idsRespondidas = new Set((respConEmpleadoId || []).map(r => r.encuesta_id));
  const pendientes = (encuestasActivas || []).filter(e => !idsRespondidas.has(e.id));

  console.log('\n📊 RESULTADO ESPERADO:');
  console.log('   Encuestas activas:', encuestasActivas?.length || 0);
  console.log('   Encuestas respondidas (con empleados.id):', respConEmpleadoId?.length || 0);
  console.log('   Encuestas PENDIENTES:', pendientes.length);

  if (pendientes.length > 0) {
    console.log('\n   Encuestas pendientes:');
    pendientes.forEach(e => console.log(`   - "${e.titulo}"`));
  } else {
    console.log('\n   ✅ No hay encuestas pendientes - el badge debería ser 0');
  }

  // 6. Verificar RPC
  console.log('\n🔧 Verificando RPC fn_get_encuestas_pendientes_empleado...');
  const { data: rpcResult, error: rpcError } = await supabase.rpc('fn_get_encuestas_pendientes_empleado');

  if (rpcError) {
    console.log('   ❌ RPC NO disponible:', rpcError.message);
    console.log('   → Se usará el fallback JavaScript');
  } else {
    console.log('   ✅ RPC disponible');
    console.log('   Resultado:', rpcResult);
  }

  // 7. Resumen
  console.log('\n' + '='.repeat(50));
  console.log('📝 RESUMEN DEL DIAGNÓSTICO');
  console.log('='.repeat(50));

  if (respConUserId?.length > 0 && respConEmpleadoId?.length === 0) {
    console.log('\n🔴 CAUSA RAÍZ IDENTIFICADA:');
    console.log('   Las respuestas se guardaron con auth.user.id en lugar de empleados.id');
    console.log('   Por eso las consultas de "pendientes" no las encuentran.\n');
    console.log('🔧 SOLUCIÓN SQL (ejecutar en Supabase Dashboard > SQL Editor):');
    console.log(`
   -- Actualizar respuestas que tienen user.id incorrecto
   UPDATE respuestas_encuesta
   SET empleado_id = e.id
   FROM empleados e
   WHERE respuestas_encuesta.empleado_id = e.auth_user_id
     AND e.auth_user_id = '${user.id}';
    `);
  } else if (pendientes.length === 0) {
    console.log('\n✅ Los datos están correctos. No debería haber encuestas pendientes.');
    console.log('   Si el UI muestra pendientes, puede ser un problema de caché o refresh.');
  } else {
    console.log('\n📋 Hay', pendientes.length, 'encuesta(s) realmente pendiente(s).');
    console.log('   El badge debería mostrar ese número.');
  }

  return {
    user_id: user.id,
    empleado_id: empleado.id,
    respuestas_con_empleado_id: respConEmpleadoId?.length || 0,
    respuestas_con_user_id: respConUserId?.length || 0,
    encuestas_activas: encuestasActivas?.length || 0,
    pendientes: pendientes.length,
    rpc_disponible: !rpcError
  };
}

// Exportar para uso
window.diagnosticoEncuestas = diagnosticoEncuestas;
console.log('✅ Script cargado. Ejecuta: diagnosticoEncuestas()');
