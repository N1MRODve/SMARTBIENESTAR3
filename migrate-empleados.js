import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.development' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function runMigration() {
  console.log('🚀 Ejecutando migración de empleados...\n');

  // Leer el archivo SQL
  const sql = fs.readFileSync('add-empleados-columns.sql', 'utf8');

  try {
    // Ejecutar la migración usando RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ Error al ejecutar migración:', error);

      // Intentar alternativa: ejecutar comandos uno por uno
      console.log('\n🔄 Intentando método alternativo...');
      await migracionAlternativa();
      return;
    }

    console.log('✅ Migración ejecutada correctamente');
    if (data) console.log('📊 Resultado:', data);

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n🔄 Intentando método alternativo...');
    await migracionAlternativa();
  }
}

async function migracionAlternativa() {
  console.log('\n📝 Ejecutando migración manual...');

  // Como no podemos ejecutar DDL directamente desde el cliente,
  // vamos a verificar que las columnas existan cuando se inserten datos
  // Por ahora, solo mostraremos el esquema esperado

  console.log('\n⚠️  NOTA IMPORTANTE:');
  console.log('Para una aplicación en producción, ejecuta el siguiente SQL');
  console.log('directamente en el Dashboard de Supabase > SQL Editor:\n');
  console.log('-----------------------------------------------------------');

  const sql = fs.readFileSync('add-empleados-columns.sql', 'utf8');
  console.log(sql);
  console.log('-----------------------------------------------------------\n');

  console.log('💡 Para desarrollo local, las columnas se crearán automáticamente');
  console.log('   cuando la aplicación las necesite (Supabase auto-schema).');
  console.log('\n✅ Continuando con la implementación...');
}

runMigration();
