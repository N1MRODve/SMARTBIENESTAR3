# Guía de Despliegue - SMART Bienestar

## Problemas Comunes y Soluciones

### 1. Pantalla en Blanco o Error 404 en Rutas

**Síntoma:** La aplicación se carga correctamente en la ruta raíz (`/`) pero muestra error 404 o pantalla en blanco al navegar a otras rutas.

**Causa:** El servidor no está configurado para redirigir todas las peticiones a `index.html` (requerido para SPAs con Vue Router en modo history).

**Solución por plataforma:**

#### Netlify
- El archivo `public/_redirects` ya está incluido
- Se copiará automáticamente a `dist/_redirects` durante el build
- No necesitas hacer nada adicional

#### Vercel
- El archivo `vercel.json` ya está incluido en la raíz del proyecto
- Vercel lo detectará automáticamente
- No necesitas hacer nada adicional

#### Apache (cPanel, hosting compartido)
- El archivo `public/.htaccess` ya está incluido
- Se copiará automáticamente a `dist/.htaccess` durante el build
- Asegúrate de que `mod_rewrite` esté habilitado en tu servidor

#### Cloudflare Pages
- Ve a Settings > Builds & deployments
- Añade esta regla de rewrite:
  - Source: `/*`
  - Destination: `/index.html`
  - Status: `200`

### 2. Variables de Entorno No Disponibles

**Síntoma:** Error de conexión a Supabase, console.log muestra `undefined` para las variables de entorno.

**Solución:**

1. En tu plataforma de hosting, configura estas variables de entorno:
   ```
   VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
   ```

2. **Importante:** Las variables deben empezar con `VITE_` para que Vite las incluya en el build.

3. Después de configurar las variables, **reconstruye la aplicación** (las variables se incluyen en tiempo de build, no en runtime).

### 3. Errores de CORS

**Síntoma:** Error en consola: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Causa:** Problema de configuración en Supabase o intentando acceder a recursos externos.

**Solución:**
1. Verifica que tu dominio esté en la lista blanca de Supabase:
   - Ve a Dashboard de Supabase > Settings > API
   - Añade tu dominio en "Site URL"
2. Asegúrate de usar HTTPS en producción

### 4. Archivos Estáticos No se Cargan

**Síntoma:** Iconos, imágenes o fuentes no se cargan correctamente.

**Solución:**
- Verifica que todos los archivos estáticos estén en la carpeta `public/`
- Las rutas deben empezar con `/` (ej: `/favicon.svg`)
- Los archivos en `public/` se copian automáticamente a `dist/`

## Configuración por Plataforma

### Netlify

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 o superior

2. **Variables de Entorno:**
   - Site settings > Build & deploy > Environment
   - Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

3. **Deploy:**
   ```bash
   # Opción 1: CLI
   npm install -g netlify-cli
   netlify deploy --prod

   # Opción 2: Git
   # Conecta tu repositorio en Netlify dashboard
   ```

### Vercel

1. **Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Variables de Entorno:**
   - Settings > Environment Variables
   - Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
   - Aplica a: Production, Preview, Development

3. **Deploy:**
   ```bash
   # Opción 1: CLI
   npm install -g vercel
   vercel --prod

   # Opción 2: Git
   # Conecta tu repositorio en Vercel dashboard
   ```

### Cloudflare Pages

1. **Build Settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18

2. **Variables de Entorno:**
   - Settings > Environment variables
   - Añade las variables con el prefijo `VITE_`

3. **Rewrites:**
   - Settings > Pages > Functions
   - Añade la regla de rewrite mencionada arriba

### Apache/cPanel

1. **Build Local:**
   ```bash
   npm run build
   ```

2. **Upload:**
   - Sube todo el contenido de la carpeta `dist/` a tu directorio web
   - Asegúrate de que `.htaccess` esté incluido

3. **Variables de Entorno:**
   - Reemplaza las variables en el código antes del build
   - O usa un archivo de configuración que no esté en git

## Verificación Post-Despliegue

1. **Verifica que el sitio carga:**
   - Visita tu dominio
   - La landing page debe mostrarse

2. **Verifica las rutas:**
   - Navega a `/login`, `/register`
   - Recarga la página en cada ruta
   - No debe mostrar 404

3. **Verifica la consola del navegador:**
   - Abre DevTools (F12)
   - No debe haber errores de CORS o variables undefined
   - Verifica que las llamadas a Supabase funcionen

4. **Prueba el login:**
   - Intenta iniciar sesión
   - Verifica que la autenticación funcione

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Limpiar y rebuild
npm run clean && npm run build

# Verificar build
npm run verify
```

## Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router - Server Configuration](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)
- [Supabase - Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#use-environment-variables)
