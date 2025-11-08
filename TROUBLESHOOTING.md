# Solución de Problemas

## Error de Service Worker en WebContainer

**Error:**
```
TypeError: Cannot navigate to URL: https://...webcontainer-api.io/
```

**Causa:**
Este error es específico del entorno de desarrollo WebContainer (StackBlitz/Bolt) y **NO afecta la funcionalidad de la aplicación**. Es causado por el Service Worker del entorno de desarrollo, no por nuestro código.

**Solución:**
- **En desarrollo:** Puedes ignorar este error en la consola. La aplicación funciona correctamente.
- **En producción:** Este error no aparecerá ya que es específico del entorno WebContainer.

**Verificación:**
- ✓ La aplicación se carga correctamente
- ✓ Las rutas funcionan
- ✓ La autenticación funciona
- ✓ La base de datos se conecta

---

## Problemas de Renderizado

### La plataforma no se visualiza

**Soluciones:**

1. **Limpiar caché y reconstruir:**
   ```bash
   npm run build
   ```

2. **Forzar recarga del navegador:**
   - Chrome/Firefox: `Ctrl + Shift + R` (Windows/Linux)
   - Chrome/Firefox: `Cmd + Shift + R` (Mac)
   - Safari: `Cmd + Option + R`

3. **Limpiar caché del navegador:**
   - Abre DevTools (F12)
   - Click derecho en el botón de recargar
   - Selecciona "Vaciar caché y recargar forzado"

4. **Verificar que el build se completó:**
   - Revisa que existe `dist/index.html`
   - Verifica que los archivos en `dist/assets/` tienen hashes únicos

---

## Problemas de Conexión a Base de Datos

### Error: "No session"

**Causa:** El usuario no está autenticado.

**Solución:**
1. Navega a `/login`
2. Inicia sesión con credenciales válidas
3. Verifica que `.env` contiene las claves correctas de Supabase

### Error: "Row Level Security"

**Causa:** Las políticas RLS impiden el acceso.

**Solución:**
1. Verifica que el usuario esté autenticado
2. Revisa las políticas RLS en Supabase Dashboard
3. Asegúrate de que `empresa_id` está correctamente configurado

---

## Problemas de Estilos

### Los estilos no se aplican

**Soluciones:**

1. **Verificar que Tailwind está compilando:**
   ```bash
   npm run build
   ```

2. **Limpiar caché de PostCSS:**
   ```bash
   npm run clean
   npm run build
   ```

3. **Verificar que el CSS está importado en main.js:**
   - Debe existir: `import './styles/main.css'`

---

## Problemas de Performance

### La aplicación carga lento

**Optimizaciones aplicadas:**
- ✓ Code splitting automático
- ✓ Lazy loading de rutas
- ✓ Chunks optimizados por vendor
- ✓ Compresión gzip

**Verificación:**
```bash
npm run build
```
Revisa el tamaño de los chunks en el output.

---

## Modo Desarrollo vs Producción

### Diferencias importantes:

| Aspecto | Desarrollo | Producción |
|---------|-----------|------------|
| Source Maps | ✓ Habilitados | ✗ Deshabilitados |
| Minificación | ✗ No | ✓ Sí |
| Cache Busting | ✗ No | ✓ Sí (hashes) |
| Hot Reload | ✓ Sí | ✗ No |

### Comandos:

- **Desarrollo:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`

---

## Contacto y Soporte

Si encuentras un problema no listado aquí:

1. Revisa la consola del navegador (F12)
2. Revisa la consola del servidor
3. Verifica los logs de Supabase
4. Asegúrate de tener las últimas dependencias: `npm install`

---

## Notas Técnicas

### Stack Tecnológico:
- Vue 3 (Composition API)
- Vite (Build tool)
- Supabase (Backend)
- Tailwind CSS (Estilos)
- PrimeVue (Componentes UI)

### Estructura de Archivos:
```
src/
├── components/     # Componentes reutilizables
├── views/         # Vistas/Páginas
├── router/        # Configuración de rutas
├── stores/        # Estado global (Pinia)
├── services/      # Lógica de negocio
└── lib/           # Configuración de librerías
```

### Convenciones:
- Componentes en PascalCase
- Archivos de servicio con `.service.js`
- Archivos de store con `.store.js`
- Vistas en carpetas `admin/` y `empleado/`
