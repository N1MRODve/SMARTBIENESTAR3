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

## Iniciar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## Funcionalidades Conectadas

✅ Autenticación con Supabase
✅ Gestión de Empleados
✅ Gestión de Comunicados
✅ Sistema de Encuestas
✅ Gamificación y Puntos
✅ Recompensas y Canjes
✅ Servicios de Bienestar
✅ Reservas de Sesiones

## Próximos Pasos

1. Crear tu primer usuario
2. Iniciar sesión
3. Explorar el dashboard
4. Crear empleados
5. Configurar servicios
6. Crear tu primera encuesta

## Notas Importantes

- Todos los datos se guardan en Supabase (no más mocks)
- Row Level Security (RLS) está habilitado en todas las tablas
- Los puntos se actualizan automáticamente con triggers
- Las respuestas de encuestas previenen duplicados por IP
