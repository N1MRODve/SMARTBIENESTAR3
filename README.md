# SMART Bienestar

Plataforma integral de gestión de bienestar laboral y clima organizacional.

## 🚀 Estado del Proyecto

✅ **Sistema completamente funcional** con base de datos Supabase
✅ **Diseño minimalista** en blanco y negro (en progreso)
✅ **Build optimizado** con code splitting y cache busting
✅ **Sistema de verificación** automatizado

## 📋 Funcionalidades Principales

- **Autenticación**: Sistema completo con roles (Admin/Empleado)
- **Gestión de Empleados**: Invitaciones, perfiles, departamentos
- **Sistema de Encuestas**: Clima laboral con análisis de resultados
- **Comunicación Interna**: Centro de comunicados y mensajería
- **Gamificación**: Sistema de puntos y recompensas
- **Servicios de Bienestar**: Apoyo psicológico, coaching, etc.
- **Analítica**: Dashboard con métricas y reportes

## 🎨 Diseño Actual

### Actualizado con Diseño Minimalista:
- ✅ Dashboard (Panel Principal)
- ✅ Vista de Encuestas
- 🔄 Resto de vistas (en progreso)

**Principios de diseño:**
- Sin emojis ni colores vivos
- Escala de grises (blanco, negro, grises)
- Sombras suaves y bordes sutiles
- Jerarquía visual clara
- Transiciones suaves

## 🛠️ Stack Tecnológico

- **Frontend**: Vue 3 (Composition API)
- **Build**: Vite con optimización de chunks
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth con RLS
- **Estilos**: Tailwind CSS
- **Componentes**: PrimeVue
- **Estado**: Pinia
- **Gráficos**: Chart.js + Vue-Chartjs

## 📂 Estructura del Proyecto

```
src/
├── views/              # Páginas de la aplicación
│   ├── admin/         # Vistas administrativas
│   └── empleado/      # Vistas de empleado
├── components/        # Componentes reutilizables
│   ├── admin/
│   ├── empleado/
│   └── ui/
├── stores/            # Estado global (Pinia)
├── services/          # Lógica de negocio
├── router/            # Configuración de rutas
└── lib/               # Configuración de librerías
```

## 🚦 Inicio Rápido

### La plataforma se visualiza automáticamente

El servidor de desarrollo se inicia automáticamente. Los cambios se reflejan instantáneamente gracias a Hot Module Replacement (HMR).

### Comandos disponibles:

```bash
# Desarrollo (automático)
npm run dev

# Build para producción
npm run build

# Verificar build
npm run verify

# Limpiar caché
npm run clean

# Preview de producción
npm run preview
```

### Para ver cambios:
1. Guarda tu archivo
2. El navegador se actualiza automáticamente
3. Si no se actualiza: `Ctrl + Shift + R`

## 🗄️ Base de Datos

### Tablas principales:
- `empresas`, `departamentos`, `empleados`
- `comunicados`, `comunicados_destinatarios`
- `encuestas`, `preguntas_encuesta`, `respuestas_encuesta`
- `recompensas`, `canjes_recompensas`
- `transacciones_puntos`
- `servicios`, `sesiones`, `reservas_sesiones`

### Seguridad:
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas restrictivas por defecto
- ✅ Autenticación requerida
- ✅ Verificación de empresa_id

## 🔐 Autenticación

### Registro de empresa:
1. Ir a `/register`
2. Completar formulario
3. Sistema crea automáticamente:
   - Empresa
   - Departamento por defecto
   - Usuario administrador

### Inicio de sesión:
- Admin: acceso completo
- Empleado: acceso limitado

## 📊 Build y Optimización

### Chunks generados:
- `vue-vendor` (105 KB) - Vue core
- `supabase` (109 KB) - Cliente Supabase
- `charts` (207 KB) - Gráficos
- `index` (167 KB) - Código de la app

### Características:
- ✅ Code splitting automático
- ✅ Cache busting con hashes únicos
- ✅ Compresión gzip
- ✅ Source maps deshabilitados en producción
- ✅ Limpieza automática de caché

## 🐛 Solución de Problemas

### Error de Service Worker
El error `TypeError: Cannot navigate to URL` es normal en WebContainer (entorno de desarrollo) y no afecta la funcionalidad.

### La plataforma no se actualiza
1. `Ctrl + Shift + R` para recargar sin caché
2. Verifica la consola del navegador (F12)
3. Ejecuta: `npm run clean && npm run build`

Ver `TROUBLESHOOTING.md` para más detalles.

## 📚 Documentación

- `SETUP.md` - Guía de configuración completa
- `TROUBLESHOOTING.md` - Solución de problemas
- `.build-cache-info.md` - Info sobre caché y build

## 🔗 Enlaces

- [Documentación Vue 3](https://vuejs.org/)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Vite](https://vitejs.dev/)
- [Documentación Tailwind](https://tailwindcss.com/)

## 📝 Notas

- El servidor de desarrollo se inicia automáticamente
- Los cambios se ven inmediatamente (HMR)
- No es necesario reiniciar el servidor
- El build es solo para verificar que todo compila
- En producción, usa los archivos de `dist/`

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/N1MRODve/SMARTBIENESTAR3)