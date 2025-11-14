# 📸 Modo Demo - Guía de Uso

## ¿Qué es el Modo Demo?

El Modo Demo es una funcionalidad que permite mostrar la plataforma con datos simulados realistas de **SportLife Performance**, un centro deportivo de alto rendimiento, sin modificar ni acceder a la base de datos real.

## ✨ Características

- ✅ **120 empleados** distribuidos en 6 departamentos
- ✅ **5 comunicados** de diferentes tipos y prioridades
- ✅ **2 encuestas** (1 activa con 87 respuestas, 72.5% participación)
- ✅ **5 recompensas** disponibles con stock
- ✅ **5 canjes** históricos (completados y pendientes)
- ✅ **3 servicios** de bienestar corporativo
- ✅ **Métricas completas** de clima laboral y participación
- ✅ **NO modifica** la base de datos real
- ✅ **Datos coherentes** entre todas las vistas

## 🎯 Cómo Activar el Modo Demo

### Paso 1: Iniciar Sesión
- Inicia sesión en la plataforma como administrador
- Accede al dashboard principal

### Paso 2: Activar Modo Demo
- Busca el botón en la esquina inferior derecha: **"Activar Modo Demo"**
- Haz clic en el botón
- La página se recargará automáticamente

### Paso 3: Verificar Activación
- Verás un botón negro que dice: **"Modo Demo ACTIVO"**
- Aparecerá un banner flotante con información de la empresa demo
- El dashboard mostrará: **"SportLife Performance"**

## 📊 Datos Demo Incluidos

### Empresa: SportLife Performance
- **Sector:** Deportes y Fitness
- **Tipo:** Centro deportivo de alto rendimiento
- **Empleados:** 120 activos
- **Logo:** Imagen profesional de centro deportivo

### Departamentos (6)
```
🏋️ Entrenamiento Personal (35 empleados)
🥗 Nutrición Deportiva (15 empleados)
💪 Fisioterapia (12 empleados)
📞 Recepción y Atención (18 empleados)
🤸 Clases Grupales (28 empleados)
�� Dirección (12 empleados)
```

### Estadísticas Dashboard
```
👥 Empleados: 120
📢 Comunicados: 5
📋 Encuestas activas: 1
🎁 Recompensas: 5
```

### Métricas de Bienestar
```
🧠 Salud Mental: 8.6/10
💪 Ergonomía: 8.9/10
❤️ Satisfacción Laboral: 8.4/10
⚖️ Balance Vida-Trabajo: 8.3/10
🛡️ Ambiente Laboral: 8.7/10
```

### Participación por Departamento
```
🥇 Dirección: 100%
🥈 Entrenamiento Personal: 92%
🥉 Clases Grupales: 90%
📊 Nutrición Deportiva: 88%
📊 Fisioterapia: 85%
📊 Recepción: 82%
```

## 🖼️ Pantallazos Recomendados

### 1. Dashboard Principal
**Muestra:**
- Métricas generales (120 empleados, 87.5% participación)
- 5 métricas de bienestar con valores altos
- Acciones rápidas con estadísticas

### 2. Gestión de Empleados
**Muestra:**
- 12 empleados detallados
- Diferentes cargos y departamentos
- Sistema de puntos activo

### 3. Centro de Comunicación
**Muestra:**
- 5 comunicados de diferentes tipos
- Lecturas entre 78-112 empleados
- Prioridades variadas (alta, media, baja)

### 4. Encuestas
**Muestra:**
- Encuesta activa: "Clima Laboral Q4 2024"
- 87 respuestas (72.5% participación)
- Progreso visual y métricas

### 5. Analítica Ejecutiva
**Muestra:**
- 6 dimensiones de clima laboral
- Participación por departamento
- Tendencia mensual creciente
- Departamentos destacados

### 6. Recompensas
**Muestra:**
- 5 recompensas atractivas con imágenes
- Puntos requeridos variados (200-500)
- Diferentes categorías

### 7. Historial de Canjes
**Muestra:**
- 5 canjes con estados variados
- Empleados y fechas reales
- Puntos gastados

## 🔧 Operaciones en Modo Demo

### ✅ Lo que puedes hacer:
- **Ver** todos los datos simulados
- **Crear** comunicados, encuestas, recompensas (no se guardan)
- **Editar** cualquier elemento (cambios solo visuales)
- **Eliminar** items (no afecta nada)
- **Navegar** por todas las vistas
- **Tomar** pantallazos profesionales

### ❌ Lo que NO hace:
- **NO modifica** la base de datos real
- **NO guarda** cambios permanentes
- **NO afecta** datos de producción
- **NO requiere** permisos especiales

## 🎬 Desactivar Modo Demo

### Opción 1: Desde el botón
- Haz clic en **"Modo Demo ACTIVO"** (botón negro)
- La página se recargará
- Volverás a ver tus datos reales

### Opción 2: Desde el navegador
- Abre las herramientas de desarrollo (F12)
- Ve a Console
- Ejecuta: `localStorage.removeItem('demo_mode')`
- Recarga la página

## 💡 Tips para Pantallazos

### 1. Timing
- Activa el modo demo **antes** de la demo
- Practica la navegación con datos demo
- Ten claro qué vistas mostrarás

### 2. Presentación
- Destaca las métricas altas (8.4-8.9/10)
- Muestra la participación activa (87.5%)
- Resalta los departamentos con mejor clima

### 3. Storytelling
- "SportLife es un centro deportivo exitoso..."
- "Con 120 empleados altamente satisfechos..."
- "92% de participación en Entrenamiento Personal..."

### 4. Detalles
- Todos los nombres son realistas
- Las fechas son recientes
- Los números son coherentes
- Las imágenes son profesionales

## 🐛 Solución de Problemas

### No veo datos demo
- Verifica que el botón diga "Modo Demo ACTIVO"
- Refresca la página (F5)
- Revisa la consola por errores `[DEMO MODE]`

### Los datos siguen siendo míos
- Asegúrate de hacer clic en "Activar Modo Demo"
- Espera a que la página se recargue completamente
- Verifica que aparezca "SportLife Performance"

### El botón no aparece
- Solo visible en vistas de administrador
- Debe estar en esquina inferior derecha
- Verifica que estés logueado como admin

## 📝 Logs en Consola

Cuando el modo demo está activo, verás logs como:
```
[DEMO MODE] Creando comunicados: {...}
[DEMO MODE] Actualizando empleados: {...}
[DEMO MODE] Eliminando recompensas con id: demo-rec-1
[DEMO MODE] Canjeando recompensa: Día libre adicional
```

Estos logs confirman que las operaciones se están simulando correctamente.

## 🎉 ¡Listo para Demos Profesionales!

Con el Modo Demo activado, puedes:
- ✅ Mostrar la plataforma con datos realistas
- ✅ Demostrar todas las funcionalidades
- ✅ Tomar pantallazos de calidad
- ✅ Hacer presentaciones en vivo
- ✅ Sin riesgo de modificar datos reales

**¡Todo sin tocar la base de datos!** 🚀
