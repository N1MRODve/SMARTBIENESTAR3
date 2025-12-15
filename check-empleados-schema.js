import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('🔍 Verificando esquema de empleados...\n');

  // Intentar obtener un empleado para ver las columnas
  const { data, error } = await supabase
    .from('empleados')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ Columnas actuales:', Object.keys(data[0]));
  } else {
    console.log('ℹ️  No hay datos, insertando registro de prueba...');

    // Insertar un registro de prueba para ver qué columnas acepta
    const { error: insertError } = await supabase
      .from('empleados')
      .insert({
        nombre: 'Test',
        email: 'test@test.com',
        empresa_id: '00000000-0000-0000-0000-000000000000'
      });

    if (insertError) {
      console.log('📋 Columnas sugeridas por el error:', insertError.message);
    }
  }

  // Verificar columnas que necesitamos agregar
  console.log('\n📝 Columnas necesarias para las mejoras:');
  console.log('  - ultimo_acceso (timestamp)');
  console.log('  - participacion_nivel (text)');
  console.log('  - invitacion_enviada_at (timestamp)');
}

checkSchema();
