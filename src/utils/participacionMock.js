// TODO: conectar con tablas "encuestas", "respuestas" y "departamentos" en futuras iteraciones.

export const participacionMock = [
  {
    id: 'enc-001',
    encuesta: 'Clima360 Insight',
    enviados: 45,
    respondidos: 38,
    fecha_envio: '2025-10-01',
    fecha_cierre: '2025-10-15',
    estado: 'activa',
    departamentos: [
      { nombre: 'RRHH', enviados: 8, respondidos: 7 },
      { nombre: 'Marketing', enviados: 12, respondidos: 9 },
      { nombre: 'Ventas', enviados: 15, respondidos: 9 },
      { nombre: 'Producción', enviados: 10, respondidos: 8 }
    ]
  },
  {
    id: 'enc-002',
    encuesta: 'Pulse Bienestar Septiembre',
    enviados: 30,
    respondidos: 18,
    fecha_envio: '2025-09-15',
    fecha_cierre: '2025-09-25',
    estado: 'cerrada',
    departamentos: [
      { nombre: 'RRHH', enviados: 6, respondidos: 5 },
      { nombre: 'Marketing', enviados: 8, respondidos: 4 },
      { nombre: 'Ventas', enviados: 10, respondidos: 6 },
      { nombre: 'Producción', enviados: 6, respondidos: 3 }
    ]
  },
  {
    id: 'enc-003',
    encuesta: 'Encuesta de Satisfacción Laboral',
    enviados: 52,
    respondidos: 47,
    fecha_envio: '2025-08-20',
    fecha_cierre: '2025-09-05',
    estado: 'cerrada',
    departamentos: [
      { nombre: 'RRHH', enviados: 10, respondidos: 9 },
      { nombre: 'Marketing', enviados: 14, respondidos: 13 },
      { nombre: 'Ventas', enviados: 16, respondidos: 14 },
      { nombre: 'Producción', enviados: 12, respondidos: 11 }
    ]
  },
  {
    id: 'enc-004',
    encuesta: 'Evaluación de Liderazgo Q2',
    enviados: 25,
    respondidos: 21,
    fecha_envio: '2025-07-10',
    fecha_cierre: '2025-07-25',
    estado: 'cerrada',
    departamentos: [
      { nombre: 'RRHH', enviados: 5, respondidos: 5 },
      { nombre: 'Marketing', enviados: 7, respondidos: 6 },
      { nombre: 'Ventas', enviados: 8, respondidos: 6 },
      { nombre: 'Producción', enviados: 5, respondidos: 4 }
    ]
  },
  {
    id: 'enc-005',
    encuesta: 'Encuesta de Onboarding',
    enviados: 18,
    respondidos: 14,
    fecha_envio: '2025-09-30',
    fecha_cierre: '2025-10-10',
    estado: 'activa',
    departamentos: [
      { nombre: 'RRHH', enviados: 3, respondidos: 3 },
      { nombre: 'Marketing', enviados: 5, respondidos: 4 },
      { nombre: 'Ventas', enviados: 6, respondidos: 4 },
      { nombre: 'Producción', enviados: 4, respondidos: 3 }
    ]
  }
];

// Función para calcular tasa de participación
export const calcularTasaParticipacion = (enviados, respondidos) => {
  if (enviados === 0) return 0;
  return Math.round((respondidos / enviados) * 100);
};

// Función para obtener participación por departamento consolidada
export const getParticipacionPorDepartamento = () => {
  const departamentosMap = {};

  participacionMock.forEach(encuesta => {
    encuesta.departamentos.forEach(dept => {
      if (!departamentosMap[dept.nombre]) {
        departamentosMap[dept.nombre] = {
          nombre: dept.nombre,
          enviados: 0,
          respondidos: 0
        };
      }
      departamentosMap[dept.nombre].enviados += dept.enviados;
      departamentosMap[dept.nombre].respondidos += dept.respondidos;
    });
  });

  return Object.values(departamentosMap).map(dept => ({
    ...dept,
    tasa: calcularTasaParticipacion(dept.enviados, dept.respondidos)
  }));
};

// Función para obtener evolución temporal
export const getEvolucionTemporal = () => {
  return participacionMock
    .sort((a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio))
    .map(enc => ({
      fecha: enc.fecha_envio,
      encuesta: enc.encuesta,
      tasa: calcularTasaParticipacion(enc.enviados, enc.respondidos),
      respondidos: enc.respondidos,
      enviados: enc.enviados
    }));
};

// Función para obtener estadísticas globales
export const getEstadisticasGlobales = () => {
  const totalEnviados = participacionMock.reduce((sum, enc) => sum + enc.enviados, 0);
  const totalRespondidos = participacionMock.reduce((sum, enc) => sum + enc.respondidos, 0);
  const encuestasActivas = participacionMock.filter(enc => enc.estado === 'activa').length;
  const encuestasCerradas = participacionMock.filter(enc => enc.estado === 'cerrada').length;

  const tasaPromedio = calcularTasaParticipacion(totalEnviados, totalRespondidos);

  return {
    totalEnviados,
    totalRespondidos,
    tasaPromedio,
    encuestasActivas,
    encuestasCerradas,
    totalEncuestas: participacionMock.length
  };
};

// Función para obtener departamento con mejor/peor participación
export const getDepartamentosExtremos = () => {
  const departamentos = getParticipacionPorDepartamento();

  const mejor = departamentos.reduce((max, dept) =>
    dept.tasa > max.tasa ? dept : max
  , departamentos[0]);

  const peor = departamentos.reduce((min, dept) =>
    dept.tasa < min.tasa ? dept : min
  , departamentos[0]);

  return { mejor, peor };
};
