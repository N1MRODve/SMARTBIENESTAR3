// Datos Demo de Encuestas - SportLife Performance
// Sistema completo de encuestas de bienestar deportivo

// Plantillas de encuestas predefinidas
export const plantillasEncuestas = [
  {
    id: 'plantilla-1',
    nombre: 'Clima Laboral Deportivo',
    descripcion: 'Evaluación completa del ambiente de trabajo en centros deportivos',
    categoria: 'clima-laboral',
    icon: '🏢',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Cómo calificarías el ambiente de trabajo en tu departamento?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy malo', 5: 'Excelente' } },
        dimension: 'Ambiente Laboral',
        obligatoria: true
      },
      {
        id: 'p2',
        texto: '¿Te sientes valorado por tu equipo de trabajo?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Siempre' } },
        dimension: 'Reconocimiento',
        obligatoria: true
      },
      {
        id: 'p3',
        texto: '¿La comunicación con tu supervisor es efectiva?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy deficiente', 5: 'Excelente' } },
        dimension: 'Comunicación',
        obligatoria: true
      },
      {
        id: 'p4',
        texto: '¿Tienes acceso a los recursos necesarios para realizar tu trabajo?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Siempre' } },
        dimension: 'Recursos',
        obligatoria: true
      },
      {
        id: 'p5',
        texto: '¿Qué aspectos consideras que deberíamos mejorar?',
        tipo: 'abierta',
        dimension: 'Sugerencias',
        obligatoria: false
      }
    ],
    duracion_estimada: 5,
    icono: 'users',
    color: 'blue'
  },
  {
    id: 'plantilla-2',
    nombre: 'Salud y Bienestar Personal',
    descripcion: 'Evaluación del bienestar físico y emocional del equipo',
    categoria: 'bienestar',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Cómo calificarías tu nivel de estrés laboral actual?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy bajo', 5: 'Muy alto' } },
        dimension: 'Estrés',
        obligatoria: true
      },
      {
        id: 'p2',
        texto: '¿Mantienes un equilibrio saludable entre trabajo y vida personal?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Siempre' } },
        dimension: 'Equilibrio Vida-Trabajo',
        obligatoria: true
      },
      {
        id: 'p3',
        texto: '¿Te sientes físicamente agotado después de tu jornada laboral?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Siempre' } },
        dimension: 'Fatiga Física',
        obligatoria: true
      },
      {
        id: 'p4',
        texto: '¿Utilizas las instalaciones deportivas para tu entrenamiento personal?',
        tipo: 'opcion_multiple',
        opciones: ['Diariamente', '3-4 veces por semana', '1-2 veces por semana', 'Ocasionalmente', 'Nunca'],
        dimension: 'Uso de Instalaciones',
        obligatoria: true
      },
      {
        id: 'p5',
        texto: '¿Qué programas de bienestar te gustaría que implementáramos?',
        tipo: 'abierta',
        dimension: 'Sugerencias Bienestar',
        obligatoria: false
      }
    ],
    duracion_estimada: 5,
    icono: 'heart',
    icon: '💚',
    color: 'green'
  },
  {
    id: 'plantilla-3',
    nombre: 'Carga Laboral y Desempeño',
    descripcion: 'Evaluación de la carga de trabajo y eficiencia',
    categoria: 'desempeno',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Tu carga de trabajo es manejable?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy baja', 5: 'Excesiva' } },
        dimension: 'Carga de Trabajo',
        obligatoria: true
      },
      {
        id: 'p2',
        texto: '¿Tienes tiempo suficiente para atender adecuadamente a cada cliente?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Siempre' } },
        dimension: 'Tiempo por Cliente',
        obligatoria: true
      },
      {
        id: 'p3',
        texto: '¿Los horarios de trabajo son apropiados?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy inadecuados', 5: 'Perfectos' } },
        dimension: 'Horarios',
        obligatoria: true
      },
      {
        id: 'p4',
        texto: '¿Recibes formación continua adecuada para tu rol?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Nunca', 5: 'Frecuentemente' } },
        dimension: 'Formación',
        obligatoria: true
      }
    ],
    duracion_estimada: 4,
    icono: 'trending-up',
    icon: '📊',
    color: 'orange'
  },
  {
    id: 'plantilla-4',
    nombre: 'Evaluación Trimestral 360',
    descripcion: 'Evaluación integral de todos los aspectos laborales',
    categoria: 'integral',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Estás satisfecho con tu trabajo en SportLife?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy insatisfecho', 5: 'Muy satisfecho' } },
        dimension: 'Satisfacción General',
        obligatoria: true
      },
      {
        id: 'p2',
        texto: '¿Recomendarías SportLife como lugar de trabajo?',
        tipo: 'escala',
        escala: { min: 0, max: 10, etiquetas: { 0: 'Nunca', 10: 'Definitivamente' } },
        dimension: 'NPS Empleado',
        obligatoria: true
      },
      {
        id: 'p3',
        texto: '¿Las instalaciones y equipamiento están en buen estado?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy deficiente', 5: 'Excelente' } },
        dimension: 'Instalaciones',
        obligatoria: true
      },
      {
        id: 'p4',
        texto: '¿El liderazgo de la empresa es efectivo?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Muy deficiente', 5: 'Excelente' } },
        dimension: 'Liderazgo',
        obligatoria: true
      },
      {
        id: 'p5',
        texto: '¿Tienes oportunidades de crecimiento profesional?',
        tipo: 'escala',
        escala: { min: 1, max: 5, etiquetas: { 1: 'Ninguna', 5: 'Muchas' } },
        dimension: 'Desarrollo Profesional',
        obligatoria: true
      },
      {
        id: 'p6',
        texto: '¿Qué es lo mejor de trabajar en SportLife?',
        tipo: 'abierta',
        dimension: 'Aspectos Positivos',
        obligatoria: false
      },
      {
        id: 'p7',
        texto: '¿Qué cambiarías para mejorar tu experiencia laboral?',
        tipo: 'abierta',
        dimension: 'Áreas de Mejora',
        obligatoria: false
      }
    ],
    duracion_estimada: 8,
    icono: 'clipboard-check',
    icon: '📋',
    color: 'purple'
  }
];

// Encuestas activas y completadas
export const encuestasDemo = [
  {
    id: 'enc-001',
    titulo: 'Evaluación Trimestral Q4 2024',
    descripcion: 'Evaluación integral del último trimestre del año',
    tipo: 'integral',
    categoria: 'integral',
    plantilla_id: 'plantilla-4',
    estado: 'completada',
    fecha_creacion: '2024-12-01',
    fecha_inicio: '2024-12-15',
    fecha_fin: '2024-12-28',
    es_anonima: true,
    privacidad_nivel: 'anonimato_completo',
    participacion: {
      total_empleados: 120,
      respuestas: 112,
      porcentaje: 93.3,
      por_departamento: {
        'Entrenamiento Personal': { total: 35, respuestas: 33, porcentaje: 94.3 },
        'Nutrición Deportiva': { total: 15, respuestas: 14, porcentaje: 93.3 },
        'Fisioterapia': { total: 12, respuestas: 12, porcentaje: 100 },
        'Recepción y Atención': { total: 18, respuestas: 16, porcentaje: 88.9 },
        'Clases Grupales': { total: 28, respuestas: 26, porcentaje: 92.9 },
        'Dirección': { total: 12, respuestas: 11, porcentaje: 91.7 }
      }
    },
    resultados: {
      score_global: 4.2,
      dimensiones: {
        'Satisfacción General': 4.3,
        'NPS Empleado': 8.2,
        'Instalaciones': 4.6,
        'Liderazgo': 4.0,
        'Desarrollo Profesional': 3.9
      },
      distribucion_respuestas: {
        'p1': { 1: 2, 2: 5, 3: 18, 4: 45, 5: 42 },
        'p2': { 0: 0, 1: 0, 2: 1, 3: 2, 4: 3, 5: 5, 6: 8, 7: 12, 8: 25, 9: 32, 10: 24 },
        'p3': { 1: 1, 2: 3, 3: 12, 4: 38, 5: 58 },
        'p4': { 1: 3, 2: 8, 3: 22, 4: 48, 5: 31 },
        'p5': { 1: 5, 2: 12, 3: 28, 4: 42, 5: 25 }
      },
      tendencias: 'positiva',
      comparacion_anterior: {
        cambio: 0.3,
        porcentaje_cambio: 7.7
      }
    },
    comentarios_destacados: [
      {
        id: 'c1',
        dimension: 'Aspectos Positivos',
        texto: 'El ambiente de equipo es increíble. Todos nos apoyamos y celebramos los logros juntos.',
        departamento: 'Entrenamiento Personal',
        fecha: '2024-12-20'
      },
      {
        id: 'c2',
        dimension: 'Aspectos Positivos',
        texto: 'Las instalaciones son de primera calidad y siempre están impecables.',
        departamento: 'Fisioterapia',
        fecha: '2024-12-21'
      },
      {
        id: 'c3',
        dimension: 'Áreas de Mejora',
        texto: 'Sería genial tener más oportunidades de formación especializada en nuevas técnicas.',
        departamento: 'Entrenamiento Personal',
        fecha: '2024-12-19'
      },
      {
        id: 'c4',
        dimension: 'Aspectos Positivos',
        texto: 'Me encanta que podamos usar las instalaciones. Es un beneficio enorme.',
        departamento: 'Nutrición Deportiva',
        fecha: '2024-12-22'
      },
      {
        id: 'c5',
        dimension: 'Áreas de Mejora',
        texto: 'Algunos turnos en horario pico son muy intensos. Necesitamos más personal de apoyo.',
        departamento: 'Recepción y Atención',
        fecha: '2024-12-18'
      }
    ]
  },
  {
    id: 'enc-002',
    titulo: 'Pulso de Bienestar Enero 2025',
    descripcion: 'Evaluación mensual de salud y bienestar del equipo',
    tipo: 'bienestar',
    categoria: 'bienestar',
    plantilla_id: 'plantilla-2',
    estado: 'activa',
    fecha_creacion: '2025-01-08',
    fecha_inicio: '2025-01-10',
    fecha_fin: '2025-01-17',
    es_anonima: true,
    privacidad_nivel: 'anonimato_completo',
    participacion: {
      total_empleados: 120,
      respuestas: 87,
      porcentaje: 72.5,
      por_departamento: {
        'Entrenamiento Personal': { total: 35, respuestas: 28, porcentaje: 80.0 },
        'Nutrición Deportiva': { total: 15, respuestas: 12, porcentaje: 80.0 },
        'Fisioterapia': { total: 12, respuestas: 10, porcentaje: 83.3 },
        'Recepción y Atención': { total: 18, respuestas: 11, porcentaje: 61.1 },
        'Clases Grupales': { total: 28, respuestas: 19, porcentaje: 67.9 },
        'Dirección': { total: 12, respuestas: 7, porcentaje: 58.3 }
      }
    },
    resultados: {
      score_global: 3.8,
      dimensiones: {
        'Estrés': 2.9,
        'Equilibrio Vida-Trabajo': 3.7,
        'Fatiga Física': 3.2,
        'Uso de Instalaciones': 4.2
      },
      distribucion_respuestas: {
        'p1': { 1: 8, 2: 15, 3: 35, 4: 22, 5: 7 },
        'p2': { 1: 5, 2: 12, 3: 28, 4: 32, 5: 10 },
        'p3': { 1: 10, 2: 18, 3: 30, 4: 20, 5: 9 },
        'p4': {
          'Diariamente': 28,
          '3-4 veces por semana': 35,
          '1-2 veces por semana': 15,
          'Ocasionalmente': 7,
          'Nunca': 2
        }
      },
      tendencias: 'atencion',
      alertas: ['Nivel de estrés ligeramente elevado en Recepción y Atención']
    }
  },
  {
    id: 'enc-003',
    titulo: 'Clima Laboral Noviembre 2024',
    descripcion: 'Evaluación del ambiente de trabajo y comunicación',
    tipo: 'clima-laboral',
    categoria: 'clima-laboral',
    plantilla_id: 'plantilla-1',
    estado: 'completada',
    fecha_creacion: '2024-11-01',
    fecha_inicio: '2024-11-10',
    fecha_fin: '2024-11-20',
    es_anonima: true,
    privacidad_nivel: 'anonimato_completo',
    participacion: {
      total_empleados: 118,
      respuestas: 105,
      porcentaje: 89.0,
      por_departamento: {
        'Entrenamiento Personal': { total: 34, respuestas: 31, porcentaje: 91.2 },
        'Nutrición Deportiva': { total: 15, respuestas: 13, porcentaje: 86.7 },
        'Fisioterapia': { total: 12, respuestas: 11, porcentaje: 91.7 },
        'Recepción y Atención': { total: 17, respuestas: 14, porcentaje: 82.4 },
        'Clases Grupales': { total: 28, respuestas: 25, porcentaje: 89.3 },
        'Dirección': { total: 12, respuestas: 11, porcentaje: 91.7 }
      }
    },
    resultados: {
      score_global: 4.1,
      dimensiones: {
        'Ambiente Laboral': 4.3,
        'Reconocimiento': 4.0,
        'Comunicación': 3.9,
        'Recursos': 4.2
      },
      distribucion_respuestas: {
        'p1': { 1: 2, 2: 6, 3: 20, 4: 42, 5: 35 },
        'p2': { 1: 3, 2: 8, 3: 25, 4: 45, 5: 24 },
        'p3': { 1: 4, 2: 10, 3: 28, 4: 38, 5: 25 },
        'p4': { 1: 2, 2: 5, 3: 18, 4: 48, 5: 32 }
      },
      tendencias: 'positiva'
    }
  },
  {
    id: 'enc-004',
    titulo: 'Evaluación de Carga Laboral - Temporada Alta',
    descripcion: 'Medición de carga de trabajo durante enero (operación enero)',
    tipo: 'desempeno',
    categoria: 'desempeno',
    plantilla_id: 'plantilla-3',
    estado: 'programada',
    fecha_creacion: '2025-01-12',
    fecha_inicio: '2025-02-01',
    fecha_fin: '2025-02-10',
    es_anonima: true,
    privacidad_nivel: 'anonimato_completo',
    participacion: {
      total_empleados: 120,
      respuestas: 0,
      porcentaje: 0,
      por_departamento: {}
    },
    resultados: null
  }
];

// Estadísticas generales del sistema de encuestas
export const estadisticasEncuestas = {
  total_encuestas: 15,
  activas: 1,
  completadas: 12,
  programadas: 2,
  tasa_participacion_promedio: 88.5,
  score_bienestar_promedio: 4.1,
  tendencia_general: 'positiva',
  evolucion_trimestral: [
    { periodo: 'Q1 2024', score: 3.8, participacion: 82 },
    { periodo: 'Q2 2024', score: 3.9, participacion: 85 },
    { periodo: 'Q3 2024', score: 4.0, participacion: 87 },
    { periodo: 'Q4 2024', score: 4.2, participacion: 91 }
  ],
  departamentos_top: [
    { nombre: 'Fisioterapia', score: 4.5, participacion: 96 },
    { nombre: 'Nutrición Deportiva', score: 4.4, participacion: 92 },
    { nombre: 'Entrenamiento Personal', score: 4.3, participacion: 91 }
  ],
  areas_mejora: [
    { dimension: 'Desarrollo Profesional', score: 3.9 },
    { dimension: 'Equilibrio Vida-Trabajo', score: 3.7 },
    { dimension: 'Estrés', score: 2.9 }
  ],
  areas_fortaleza: [
    { dimension: 'Instalaciones', score: 4.6 },
    { dimension: 'Ambiente Laboral', score: 4.3 },
    { dimension: 'Satisfacción General', score: 4.3 }
  ]
};

// Comentarios anónimos recientes
export const comentariosRecientes = [
  {
    id: 'com-1',
    encuesta_id: 'enc-001',
    dimension: 'Aspectos Positivos',
    texto: 'Excelente ambiente de trabajo. El equipo es como una familia.',
    sentimiento: 'positivo',
    fecha: '2024-12-20',
    departamento: 'Entrenamiento Personal'
  },
  {
    id: 'com-2',
    encuesta_id: 'enc-001',
    dimension: 'Áreas de Mejora',
    texto: 'Necesitamos más espacios para descansar entre sesiones.',
    sentimiento: 'constructivo',
    fecha: '2024-12-19',
    departamento: 'Clases Grupales'
  },
  {
    id: 'com-3',
    encuesta_id: 'enc-002',
    dimension: 'Sugerencias Bienestar',
    texto: 'Sería increíble tener sesiones de mindfulness para el equipo.',
    sentimiento: 'sugerencia',
    fecha: '2025-01-12',
    departamento: 'Recepción y Atención'
  },
  {
    id: 'com-4',
    encuesta_id: 'enc-001',
    dimension: 'Aspectos Positivos',
    texto: 'Los descuentos en productos deportivos son un beneficio fantástico.',
    sentimiento: 'positivo',
    fecha: '2024-12-21',
    departamento: 'Nutrición Deportiva'
  },
  {
    id: 'com-5',
    encuesta_id: 'enc-003',
    dimension: 'Sugerencias',
    texto: 'Me gustaría más formación en nuevas técnicas de recuperación.',
    sentimiento: 'sugerencia',
    fecha: '2024-11-15',
    departamento: 'Fisioterapia'
  }
];

// Acciones recomendadas basadas en resultados
export const accionesRecomendadas = [
  {
    id: 'accion-1',
    encuesta_id: 'enc-002',
    prioridad: 'alta',
    dimension: 'Estrés',
    titulo: 'Implementar Programa de Gestión del Estrés',
    descripcion: 'El nivel de estrés reportado (2.9/5) requiere atención inmediata',
    acciones_sugeridas: [
      'Organizar talleres de manejo del estrés',
      'Ofrecer sesiones de mindfulness semanales',
      'Evaluar redistribución de cargas de trabajo',
      'Implementar pausas activas obligatorias'
    ],
    departamentos_afectados: ['Recepción y Atención', 'Clases Grupales'],
    impacto_estimado: 'alto',
    esfuerzo_requerido: 'medio'
  },
  {
    id: 'accion-2',
    encuesta_id: 'enc-001',
    prioridad: 'media',
    dimension: 'Desarrollo Profesional',
    titulo: 'Ampliar Programa de Formación Continua',
    descripcion: 'Score de 3.9/5 indica oportunidad de mejora en desarrollo profesional',
    acciones_sugeridas: [
      'Crear plan de certificaciones anuales',
      'Establecer presupuesto de formación por empleado',
      'Organizar workshops trimestrales con expertos',
      'Implementar programa de mentoring interno'
    ],
    departamentos_afectados: ['Todos'],
    impacto_estimado: 'alto',
    esfuerzo_requerido: 'alto'
  },
  {
    id: 'accion-3',
    encuesta_id: 'enc-002',
    prioridad: 'baja',
    dimension: 'Uso de Instalaciones',
    titulo: 'Optimizar Horarios de Acceso Personal',
    descripcion: 'Alto uso de instalaciones (4.2/5) pero algunos comentarios sobre horarios',
    acciones_sugeridas: [
      'Crear franjas horarias exclusivas para empleados',
      'Diseñar rutinas de entrenamiento específicas para el equipo',
      'Ofrecer clases gratuitas exclusivas para staff'
    ],
    departamentos_afectados: ['Todos'],
    impacto_estimado: 'medio',
    esfuerzo_requerido: 'bajo'
  }
];

// Función helper para obtener encuesta por ID
export const getEncuestaById = (id) => {
  return encuestasDemo.find(e => e.id === id);
};

// Función helper para obtener plantilla por ID
export const getPlantillaById = (id) => {
  return plantillasEncuestas.find(p => p.id === id);
};

// Función para calcular estadísticas en tiempo real
export const calcularEstadisticasActuales = () => {
  const activas = encuestasDemo.filter(e => e.estado === 'activa');
  const completadas = encuestasDemo.filter(e => e.estado === 'completada');

  const participacionTotal = completadas.reduce((sum, e) =>
    sum + e.participacion.porcentaje, 0
  );

  const scoreTotal = completadas
    .filter(e => e.resultados)
    .reduce((sum, e) => sum + e.resultados.score_global, 0);

  return {
    activas: activas.length,
    completadas: completadas.length,
    tasa_participacion: completadas.length > 0 ? participacionTotal / completadas.length : 0,
    score_promedio: completadas.length > 0 ? scoreTotal / completadas.length : 0
  };
};
