#!/usr/bin/env node
/**
 * Script de Verificación de Configuración de Supabase
 *
 * Este script verifica que:
 * 1. Las credenciales estén correctas en todos los archivos
 * 2. La URL de Supabase sea accesible
 * 3. El build incluya las credenciales correctas
 */

const fs = require('fs');
const https = require('https');

const EXPECTED_URL = 'vrmxccuklpnysvtnmfja.supabase.co';
const FULL_URL = `https://${EXPECTED_URL}`;

console.log('🔍 Verificando configuración de Supabase...\n');

// Verificar archivos .env
function checkEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filePath} no existe`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const hasCorrectUrl = content.includes(EXPECTED_URL);

  if (hasCorrectUrl) {
    console.log(`✅ ${filePath} tiene la URL correcta`);
    return true;
  } else {
    console.log(`❌ ${filePath} tiene una URL incorrecta`);
    return false;
  }
}

// Verificar archivo supabase.js
function checkSupabaseJs() {
  const filePath = './src/lib/supabase.js';

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} no existe`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const hasCorrectUrl = content.includes(EXPECTED_URL);

  if (hasCorrectUrl) {
    console.log(`✅ ${filePath} tiene la URL correcta`);
    return true;
  } else {
    console.log(`❌ ${filePath} tiene una URL incorrecta`);
    return false;
  }
}

// Verificar build
function checkBuild() {
  const distDir = './dist/assets';

  if (!fs.existsSync(distDir)) {
    console.log(`⚠️  Carpeta dist no existe. Ejecuta: npm run build`);
    return false;
  }

  const files = fs.readdirSync(distDir);
  const jsFiles = files.filter(f => f.startsWith('index-') && f.endsWith('.js'));

  if (jsFiles.length === 0) {
    console.log(`⚠️  No se encontró el bundle principal en dist/assets/`);
    return false;
  }

  const mainBundle = jsFiles[0];
  const content = fs.readFileSync(`${distDir}/${mainBundle}`, 'utf-8');
  const hasCorrectUrl = content.includes(EXPECTED_URL);

  if (hasCorrectUrl) {
    console.log(`✅ Build (${mainBundle}) incluye la URL correcta`);
    return true;
  } else {
    console.log(`❌ Build (${mainBundle}) NO incluye la URL correcta`);
    console.log(`   Ejecuta: npm run build`);
    return false;
  }
}

// Verificar conectividad
function checkConnectivity() {
  return new Promise((resolve) => {
    console.log(`🌐 Verificando conectividad a ${FULL_URL}...`);

    const req = https.get(`${FULL_URL}/auth/v1/health`, { timeout: 5000 }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 404 || res.statusCode === 401) {
        console.log(`✅ Servidor Supabase responde (HTTP ${res.statusCode})`);
        resolve(true);
      } else {
        console.log(`⚠️  Servidor responde con código ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`❌ Error de conexión: ${err.message}`);
      console.log(`   Verifica tu conexión a internet o DNS`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ Timeout al conectar a Supabase`);
      req.destroy();
      resolve(false);
    });
  });
}

// Ejecutar todas las verificaciones
async function main() {
  let allOk = true;

  console.log('📝 Verificando archivos de configuración:\n');
  allOk = checkEnvFile('./.env') && allOk;
  allOk = checkEnvFile('./.env.production') && allOk;
  allOk = checkSupabaseJs() && allOk;

  console.log('\n📦 Verificando build:\n');
  allOk = checkBuild() && allOk;

  console.log('\n🌐 Verificando conectividad:\n');
  const connectivity = await checkConnectivity();
  allOk = connectivity && allOk;

  console.log('\n' + '='.repeat(50));

  if (allOk) {
    console.log('\n✅ TODO CORRECTO');
    console.log('\nPasos siguientes:');
    console.log('1. Despliega la carpeta dist/ a tu hosting');
    console.log('2. Limpia la caché del navegador (Ctrl+Shift+Delete)');
    console.log('3. Abre tu sitio en modo incógnito');
    console.log('4. Verifica que el login funcione');
    process.exit(0);
  } else {
    console.log('\n❌ HAY PROBLEMAS');
    console.log('\nAcciones recomendadas:');
    console.log('1. Ejecuta: npm run build');
    console.log('2. Verifica tu conexión a internet');
    console.log('3. Revisa el archivo SOLUCION_FINAL.md');
    process.exit(1);
  }
}

main().catch(console.error);
