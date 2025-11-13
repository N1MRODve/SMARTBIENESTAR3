# Modo Demo - Presentación Comercial

Este documento explica cómo usar el **Modo Demo** para realizar capturas de pantalla y demostraciones comerciales de la plataforma sin afectar los datos reales en la base de datos.

## ¿Qué es el Modo Demo?

El Modo Demo es una característica especial que reemplaza temporalmente los datos reales de la base de datos con datos ficticios de demostración. Esto te permite:

- Hacer capturas de pantalla profesionales para presentaciones
- Mostrar la plataforma con datos realistas y consistentes
- No afectar ni modificar la base de datos real
- Cambiar fácilmente entre datos reales y demo

## Empresa de Demostración

Los datos demo simulan una empresa del sector deportivo:

**SportLife Performance**
- Sector: Deportes y Fitness
- Centro deportivo de alto rendimiento
- 120 empleados activos
- 6 departamentos operativos

### Departamentos

1. **Entrenamiento Personal** (35 empleados)
2. **Nutrición Deportiva** (15 empleados)
3. **Fisioterapia** (12 empleados)
4. **Recepción y Atención** (18 empleados)
5. **Clases Grupales** (28 empleados)
6. **Dirección** (12 empleados)

### Datos Incluidos

El modo demo incluye:

- ✅ 12 empleados con perfiles completos
- ✅ 6 departamentos activos
- ✅ 5 comunicados recientes
- ✅ 2 encuestas (1 activa, 1 finalizada)
- ✅ 5 recompensas disponibles
- ✅ 3 servicios de bienestar
- ✅ Estadísticas y métricas realistas
- ✅ Datos de participación por departamento
- ✅ Respuestas de encuestas generadas

## Cómo Activar el Modo Demo

1. **Inicia sesión** en el panel de administración
2. En la esquina inferior derecha verás un botón **"Activar Modo Demo"**
3. Haz clic en el botón
4. La página se recargará automáticamente
5. Verás un banner naranja indicando que el modo demo está activo
6. El botón ahora dirá **"Modo Demo ACTIVO"** con un ícono de monitor

### Banner de Información

Cuando el modo demo está activo, aparece un banner flotante que muestra:
- Empresa: SportLife Performance (Sector Deportivo)
- Botón para copiar información rápidamente

## Cómo Desactivar el Modo Demo

1. Haz clic en el botón **"Modo Demo ACTIVO"**
2. La página se recargará automáticamente
3. Volverás a ver los datos reales de tu base de datos

## Pantallazos Recomendados

### Dashboard Principal
- Muestra métricas generales de la empresa
- Estadísticas de participación
- Actividad reciente

### Gestión de Empleados
- Lista de 12 empleados con diferentes roles
- Datos organizados por departamentos
- Información de contacto y puntos

### Encuestas
- Encuesta activa de Clima Laboral Q4 2024
- 87 respuestas (72.5% participación)
- Resultados y análisis por dimensiones

### Comunicaciones
- 5 comunicados de diferentes tipos
- Estadísticas de lectura
- Prioridades y categorías

### Recompensas
- 5 recompensas en diferentes categorías
- Sistema de puntos
- Stock y disponibilidad

### Analítica
- Datos de participación por departamento
- Tendencias mensuales
- Dimensiones de clima laboral con scores

## Notas Importantes

⚠️ **Cambios no persistentes**: Cualquier acción que realices en modo demo (crear, editar, eliminar) NO se guardará en la base de datos. Los cambios son solo visuales y temporales.

⚠️ **Recarga de página**: Al activar/desactivar el modo demo, la página se recarga automáticamente para aplicar los cambios.

💡 **Consistencia**: Los datos demo son consistentes y están diseñados para mostrar un caso de uso realista del sector deportivo.

🎯 **Presentaciones**: Ideal para demos comerciales, capacitaciones, y presentaciones a clientes potenciales.

## Personalización

Los datos demo se encuentran en:
```
src/utils/demoData.js
```

Si necesitas modificar los datos para una presentación específica, puedes editar este archivo manteniendo la estructura existente.

## Soporte Técnico

Si encuentras algún problema con el modo demo o necesitas datos específicos para tu presentación, contacta al equipo de desarrollo.
