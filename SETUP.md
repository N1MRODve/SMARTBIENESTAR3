# Configuración de Smart Bienestar

## Base de Datos Configurada

La aplicación ya está conectada a Supabase con todas las tablas y funciones necesarias.

### Estructura de Base de Datos

**16 Tablas:**
- departamentos
- empleados
- comunicados, comunicados_lecturas, comunicados_destinatarios
- encuestas, preguntas_encuesta, respuestas_encuesta, acciones_recomendadas
- recompensas, canjes_recompensas
- transacciones_puntos
- servicios, sesiones, solicitudes_servicios, reservas_sesiones

**3 Funciones con Triggers:**
- actualizar_puntos_empleado()
- actualizar_cupo_crear_reserva()
- actualizar_cupo_cancelar_reserva()

**1 Edge Function:**
- submit-survey-response

## Datos de Prueba

Se han insertado datos de ejemplo:
- 9 departamentos
- 5 servicios de bienestar
- 6 recompensas

## Crear Usuario de Prueba

Para crear tu primer usuario administrador, necesitas:

### Opción 1: Desde la Consola de Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Authentication" > "Users"
4. Click en "Add user"
5. Crea un usuario con email y contraseña

### Opción 2: Desde el Código

Usa la función de registro en la aplicación:
- Email: `admin@smartbienestar.com`
- Password: (tu contraseña segura)
- Nombre: `Administrador`
- Departamento: Selecciona uno de la lista
- Cargo: `Administrador de Sistema`

## Variables de Entorno

Ya configuradas en `.env`:
```
VITE_SUPABASE_URL=https://vrmxccuklpnysvtnmfja.supabase.co
VITE_SUPABASE_ANON_KEY=(ya configurada)
```

## Visualizar la Plataforma

El servidor de desarrollo **se inicia automáticamente** en este entorno.

### La plataforma está disponible y se actualiza automáticamente:
- ✅ Los cambios se reflejan **inmediatamente** (Hot Module Replacement)
- ✅ No necesitas reiniciar el servidor manualmente
- ✅ El navegador se actualiza solo cuando guardas archivos

### Si necesitas refrescar manualmente:
1. En el navegador: `Ctrl + R` (o `Cmd + R` en Mac)
2. Recarga forzada sin caché: `Ctrl + Shift + R`

### Después de hacer un build:
```bash
npm run build      # Construye para producción
npm run verify     # Verifica que el build sea correcto
```

**Importante:** El build es para verificar que todo compila correctamente. En desarrollo, los cambios se ven automáticamente sin necesidad de hacer build.

## Funcionalidades Conectadas

✅ Autenticación con Supabase
✅ Gestión de Empleados
✅ Gestión de Comunicados
✅ Sistema de Encuestas
✅ Gamificación y Puntos
✅ Recompensas y Canjes
✅ Servicios de Bienestar
✅ Reservas de Sesiones

## 🎨 Diseño Actualizado (Minimalista Blanco y Negro)

### Vistas Actualizadas:
✅ **DashboardView** - Panel principal con diseño limpio
✅ **EncuestasView** - Gestión de encuestas minimalista

### Características del Nuevo Diseño:
- Sin emojis
- Solo blanco, negro y escala de grises
- Sombras suaves (`shadow-sm`, `shadow-md`)
- Bordes sutiles (`border-gray-200`, `border-gray-300`)
- Jerarquía visual clara
- Transiciones suaves en interacciones

## Próximos Pasos

1. Crear tu primer usuario
2. Iniciar sesión
3. Explorar el dashboard actualizado ✨
4. Crear empleados
5. Gestionar encuestas ✨
6. Configurar servicios

## 🔧 Comandos Útiles

```bash
npm run build      # Limpia caché y construye
npm run verify     # Verifica integridad del build
npm run clean      # Solo limpia caché
```

## Notas Importantes

- ✅ Todos los datos se guardan en Supabase (no más mocks)
- ✅ Row Level Security (RLS) habilitado en todas las tablas
- ✅ Los puntos se actualizan automáticamente con triggers
- ✅ Las respuestas de encuestas previenen duplicados por IP
- ✅ Build optimizado con code splitting
- ✅ Cache busting automático con hashes únicos

## 🐛 Problemas Comunes

### Error de Service Worker
Si ves errores de Service Worker en la consola:
- Es normal en el entorno WebContainer
- No afecta la funcionalidad de la aplicación
- No aparecerá en producción

Ver `TROUBLESHOOTING.md` para más detalles.

### La plataforma no se actualiza
1. Refresca con `Ctrl + Shift + R`
2. Verifica la consola del navegador (F12)
3. Limpia caché: `npm run clean && npm run build`
