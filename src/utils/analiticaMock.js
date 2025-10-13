// TODO: conectar con "resultados_encuestas" y "departamentos" cuando BD esté activa.

export const analiticaMock = {
  bienestar_global: 4.2,
  variacion_trimestral: +0.3,
  participacion_global: 78,
  departamentos_fuertes: [
    { nombre: 'RRHH', promedio: 4.6, empleados: 12, tendencia: 'up' },
    { nombre: 'Marketing', promedio: 4.4, empleados: 18, tendencia: 'up' },
    { nombre: 'Producción', promedio: 4.3, empleados: 25, tendencia: 'stable' }
  ],
  departamentos_criticos: [
    { nombre: 'Ventas', promedio: 3.1, empleados: 20, tendencia: 'down' },
    { nombre: 'Atención al Cliente', promedio: 2.9, empleados: 15, tendencia: 'down' }
  ],
  alertas_activas: 3,
  encuestas_activas: 2,
  encuestas_completadas: 12,
  empleados_totales: 90
};

export const evolucionMock = [
  { mes: 'Mayo', valor: 3.8, participacion: 72 },
  { mes: 'Junio', valor: 3.9, participacion: 75 },
  { mes: 'Julio', valor: 4.0, participacion: 73 },
  { mes: 'Agosto', valor: 4.1, participacion: 76 },
  { mes: 'Septiembre', valor: 4.3, participacion: 80 },
  { mes: 'Octubre', valor: 4.2, participacion: 78 }
];

export const categoriasBienestarMock = [
  { categoria: 'Clima Laboral', valor: 4.5, variacion: +0.4 },
  { categoria: 'Liderazgo', valor: 4.2, variacion: +0.2 },
  { categoria: 'Desarrollo', valor: 4.0, variacion: +0.3 },
  { categoria: 'Balance', valor: 3.8, variacion: -0.1 },
  { categoria: 'Comunicación', valor: 4.1, variacion: +0.5 }
];

export const alertasPorTipoMock = {
  criticas: 3,
  moderadas: 5,
  bajas: 2
};

// Funciones de análisis
export const calcularTendencia = (variacion) => {
  if (variacion > 0) return 'positiva';
  if (variacion < 0) return 'negativa';
  return 'estable';
};

export const obtenerColorTendencia = (variacion) => {
  if (variacion > 0) return 'text-green-600';
  if (variacion < 0) return 'text-red-600';
  return 'text-gray-600';
};

export const obtenerIconoTendencia = (variacion) => {
  if (variacion > 0) return 'trending-up';
  if (variacion < 0) return 'trending-down';
  return 'minus';
};

export const generarResumenEjecutivo = (data) => {
  const tendencia = calcularTendencia(data.variacion_trimestral);
  const mejoresAreas = data.departamentos_fuertes.map(d => d.nombre).join(' y ');
  const areasRiesgo = data.departamentos_criticos.map(d => d.nombre).join(' y ');

  let resumen = '';

  if (tendencia === 'positiva') {
    resumen = `El índice de bienestar global ha aumentado un ${Math.abs(data.variacion_trimestral).toFixed(1)} en el último trimestre, impulsado por mejoras en ${mejoresAreas}. `;
  } else if (tendencia === 'negativa') {
    resumen = `El índice de bienestar global ha disminuido un ${Math.abs(data.variacion_trimestral).toFixed(1)} en el último trimestre, requiriendo atención urgente. `;
  } else {
    resumen = `El índice de bienestar global se mantiene estable en ${data.bienestar_global.toFixed(1)}. `;
  }

  if (data.departamentos_criticos.length > 0) {
    resumen += `${areasRiesgo} ${data.departamentos_criticos.length > 1 ? 'requieren' : 'requiere'} seguimiento inmediato para implementar planes de mejora.`;
  } else {
    resumen += 'Todos los departamentos muestran indicadores saludables.';
  }

  return resumen;
};

export const obtenerEstadoGlobal = (promedio) => {
  if (promedio >= 4.0) return { label: 'Excelente', color: 'green', bg: 'bg-green-100', text: 'text-green-800' };
  if (promedio >= 3.5) return { label: 'Bueno', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' };
  if (promedio >= 3.0) return { label: 'Regular', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800' };
  return { label: 'Crítico', color: 'red', bg: 'bg-red-100', text: 'text-red-800' };
};
