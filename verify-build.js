#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('\n🔍 Verificando build de la aplicación...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function pass(message) {
  console.log('✓', message);
  checks.passed++;
}

function fail(message) {
  console.log('✗', message);
  checks.failed++;
}

function warn(message) {
  console.log('⚠', message);
  checks.warnings++;
}

// 1. Verificar que existe dist/
if (existsSync('dist')) {
  pass('Carpeta dist/ existe');
} else {
  fail('Carpeta dist/ no existe - ejecuta npm run build');
  process.exit(1);
}

// 2. Verificar index.html
if (existsSync('dist/index.html')) {
  pass('Archivo dist/index.html existe');

  const html = readFileSync('dist/index.html', 'utf-8');

  // Verificar que tiene scripts con hash
  if (html.includes('.js') && html.includes('-')) {
    pass('Scripts incluyen hash para cache busting');
  } else {
    warn('Scripts pueden no tener hash para cache busting');
  }

  // Verificar que tiene CSS
  if (html.includes('.css')) {
    pass('CSS está enlazado en HTML');
  } else {
    warn('No se encontró enlace a CSS');
  }
} else {
  fail('Archivo dist/index.html no existe');
}

// 3. Verificar assets/
if (existsSync('dist/assets')) {
  pass('Carpeta dist/assets/ existe');

  const assets = readdirSync('dist/assets');
  const jsFiles = assets.filter(f => f.endsWith('.js'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));

  console.log(`  → ${jsFiles.length} archivos JavaScript`);
  console.log(`  → ${cssFiles.length} archivos CSS`);

  if (jsFiles.length > 0) {
    pass('Se generaron archivos JavaScript');
  } else {
    fail('No se generaron archivos JavaScript');
  }

  if (cssFiles.length > 0) {
    pass('Se generaron archivos CSS');
  } else {
    fail('No se generaron archivos CSS');
  }

  // Verificar chunks principales
  const hasVueVendor = jsFiles.some(f => f.includes('vue-vendor'));
  const hasSupabase = jsFiles.some(f => f.includes('supabase'));
  const hasCharts = jsFiles.some(f => f.includes('charts'));

  if (hasVueVendor) {
    pass('Chunk vue-vendor generado');
  } else {
    warn('Chunk vue-vendor no encontrado');
  }

  if (hasSupabase) {
    pass('Chunk supabase generado');
  } else {
    warn('Chunk supabase no encontrado');
  }

  if (hasCharts) {
    pass('Chunk charts generado');
  } else {
    warn('Chunk charts no encontrado');
  }

  // Verificar tamaños
  let totalSize = 0;
  for (const file of assets) {
    const filePath = join('dist/assets', file);
    const stats = statSync(filePath);
    totalSize += stats.size;
  }

  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`  → Tamaño total de assets: ${totalMB} MB`);

  if (totalMB < 10) {
    pass('Tamaño de assets es razonable');
  } else {
    warn('Assets son muy grandes (>10MB)');
  }
} else {
  fail('Carpeta dist/assets/ no existe');
}

// 4. Verificar archivos de configuración
if (existsSync('.env')) {
  pass('Archivo .env existe');
} else {
  warn('Archivo .env no existe - necesario para producción');
}

if (existsSync('vite.config.js')) {
  pass('Archivo vite.config.js existe');
} else {
  fail('Archivo vite.config.js no existe');
}

if (existsSync('package.json')) {
  pass('Archivo package.json existe');

  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  if (pkg.scripts && pkg.scripts.build) {
    pass('Script de build está configurado');
  } else {
    fail('Script de build no está configurado');
  }
} else {
  fail('Archivo package.json no existe');
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 Resumen:');
console.log('='.repeat(50));
console.log(`✓ Verificaciones pasadas: ${checks.passed}`);
if (checks.warnings > 0) {
  console.log(`⚠ Advertencias: ${checks.warnings}`);
}
if (checks.failed > 0) {
  console.log(`✗ Verificaciones fallidas: ${checks.failed}`);
}
console.log('='.repeat(50) + '\n');

if (checks.failed > 0) {
  console.log('❌ La verificación del build falló.');
  console.log('   Ejecuta: npm run build\n');
  process.exit(1);
} else if (checks.warnings > 0) {
  console.log('⚠️  La verificación del build completó con advertencias.\n');
  process.exit(0);
} else {
  console.log('✅ ¡El build está correcto y listo para usar!\n');
  process.exit(0);
}
