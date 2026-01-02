#!/usr/bin/env node
/**
 * =====================================================
 * Script de Verificación de Analítica
 * =====================================================
 * Compara los datos de las RPCs de analítica con
 * queries directas a la base de datos para verificar
 * consistencia.
 *
 * Uso: npm run analytics:check
 * =====================================================
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Variables de entorno VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bold');
  console.log('='.repeat(60));
}

async function getDirectCounts(empresaId) {
  log('\nObteniendo counts directos de BD...', 'cyan');

  const counts = {};

  // Empleados
  const { count: empleadosTotal } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId);
  counts.empleados_total = empleadosTotal || 0;

  const { count: empleadosActivos } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .ilike('estado', 'activo');
  counts.empleados_activos = empleadosActivos || 0;

  // Departamentos
  const { count: departamentos } = await supabase
    .from('departamentos')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId);
  counts.departamentos = departamentos || 0;

  // Encuestas
  const { count: encuestasTotal } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId);
  counts.encuestas_total = encuestasTotal || 0;

  const { count: encuestasActivas } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .ilike('estado', 'activa');
  counts.encuestas_activas = encuestasActivas || 0;

  const { count: encuestasCerradas } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .ilike('estado', 'cerrada');
  counts.encuestas_cerradas = encuestasCerradas || 0;

  // Respuestas (necesitamos IDs de encuestas)
  const { data: encuestas } = await supabase
    .from('encuestas')
    .select('id')
    .eq('empresa_id', empresaId);

  if (encuestas && encuestas.length > 0) {
    const encuestaIds = encuestas.map(e => e.id);
    const { count: respuestas } = await supabase
      .from('respuestas_encuesta')
      .select('*', { count: 'exact', head: true })
      .in('encuesta_id', encuestaIds);
    counts.respuestas_total = respuestas || 0;
  } else {
    counts.respuestas_total = 0;
  }

  // Comunicados
  const { count: comunicadosTotal } = await supabase
    .from('comunicados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', empresaId);
  counts.comunicados_total = comunicadosTotal || 0;

  const { data: comunicadosEnviados } = await supabase
    .from('comunicados')
    .select('id')
    .eq('empresa_id', empresaId)
    .or('estado.ilike.enviado,estado.ilike.publicado');
  counts.comunicados_enviados = comunicadosEnviados?.length || 0;

  // Lecturas
  if (comunicadosEnviados && comunicadosEnviados.length > 0) {
    const comIds = comunicadosEnviados.map(c => c.id);
    const { count: lecturas } = await supabase
      .from('comunicados_lecturas')
      .select('*', { count: 'exact', head: true })
      .in('comunicado_id', comIds);
    counts.lecturas_total = lecturas || 0;
  } else {
    counts.lecturas_total = 0;
  }

  return counts;
}

async function getRPCData() {
  log('\nLlamando a RPC analytics_debug...', 'cyan');

  const { data, error } = await supabase.rpc('analytics_debug');

  if (error) {
    log(`Error en RPC: ${error.message}`, 'red');
    return null;
  }

  return data;
}

function compareResults(direct, rpc) {
  logSection('COMPARACIÓN DE RESULTADOS');

  const rpcCounts = rpc?.raw_counts || {};
  let allMatch = true;

  const comparisons = [
    ['Empleados Total', direct.empleados_total, rpcCounts.empleados_total],
    ['Empleados Activos', direct.empleados_activos, rpcCounts.empleados_activos],
    ['Departamentos', direct.departamentos, rpcCounts.departamentos],
    ['Encuestas Total', direct.encuestas_total, rpcCounts.encuestas_total],
    ['Encuestas Activas', direct.encuestas_activas, rpcCounts.encuestas_activas],
    ['Encuestas Cerradas', direct.encuestas_cerradas, rpcCounts.encuestas_cerradas],
    ['Respuestas Total', direct.respuestas_total, rpcCounts.respuestas_total],
    ['Comunicados Total', direct.comunicados_total, rpcCounts.comunicados_total],
    ['Comunicados Enviados', direct.comunicados_enviados, rpcCounts.comunicados_enviados],
    ['Lecturas Total', direct.lecturas_total, rpcCounts.lecturas_total]
  ];

  console.log('\n' + '-'.repeat(50));
  console.log(
    'Métrica'.padEnd(25) +
    'Directo'.padStart(10) +
    'RPC'.padStart(10) +
    'Estado'.padStart(10)
  );
  console.log('-'.repeat(50));

  for (const [name, directVal, rpcVal] of comparisons) {
    const match = directVal === rpcVal;
    if (!match) allMatch = false;

    const status = match ? colors.green + 'OK' : colors.red + 'DIFF';
    console.log(
      name.padEnd(25) +
      String(directVal ?? '-').padStart(10) +
      String(rpcVal ?? '-').padStart(10) +
      status.padStart(20) + colors.reset
    );
  }

  console.log('-'.repeat(50));

  return allMatch;
}

async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('   VERIFICACIÓN DE ANALÍTICA - SMARTBIENESTAR', 'bold');
  log('='.repeat(60), 'blue');

  // Obtener empresas
  log('\nBuscando empresas en el sistema...', 'cyan');
  const { data: empresas, error: empError } = await supabase
    .from('empresas')
    .select('id, nombre')
    .limit(5);

  if (empError || !empresas || empresas.length === 0) {
    log('No se encontraron empresas en el sistema', 'red');
    process.exit(1);
  }

  log(`Encontradas ${empresas.length} empresa(s)`, 'green');

  for (const empresa of empresas) {
    logSection(`EMPRESA: ${empresa.nombre}`);
    log(`ID: ${empresa.id}`, 'cyan');

    // Counts directos
    const directCounts = await getDirectCounts(empresa.id);

    // Datos de RPC
    const rpcData = await getRPCData();

    if (!rpcData) {
      log('No se pudieron obtener datos de RPC', 'yellow');
      log('Las RPCs podrían no estar instaladas. Ejecute la migración:', 'yellow');
      log('  npx supabase db push', 'cyan');
      continue;
    }

    // Mostrar counts directos
    logSection('COUNTS DIRECTOS (Queries)');
    console.log(JSON.stringify(directCounts, null, 2));

    // Mostrar counts RPC
    logSection('COUNTS RPC (analytics_debug)');
    console.log(JSON.stringify(rpcData?.raw_counts, null, 2));

    // Comparar
    const allMatch = compareResults(directCounts, rpcData);

    if (allMatch) {
      log('\n VERIFICACIÓN EXITOSA: Todos los valores coinciden', 'green');
    } else {
      log('\n ADVERTENCIA: Hay diferencias entre queries directas y RPC', 'yellow');
      log('Revise las definiciones de las RPCs en la migración', 'yellow');
    }
  }

  logSection('VERIFICACIÓN COMPLETADA');
  log('Para más detalles, revise el panel Debug en /admin/analitica', 'cyan');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
