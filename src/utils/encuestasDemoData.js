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
    puntos_otorgados: 100,
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
    puntos_otorgados: 120,
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

// Encuestas activas y completadas - FitCorp
export const encuestasDemo = [
  {
    id: 'enc-fitcorp-001',
    titulo: 'Clima Laboral - Noviembre 2024',
    descripcion: 'Encuesta trimestral sobre satisfacción y bienestar en FitCorp',
    tipo: 'clima_laboral',
    categoria: 'clima-laboral',
    plantilla_id: 'plantilla-1',
    estado: 'activa',
    estado_label: 'Activa',
    fecha_creacion: '2024-11-01',
    fecha_inicio: '2024-11-20',
    fecha_fin: '2024-11-30',
    es_anonima: true,
    privacidad_nivel: 'anonimo',
    puntos_otorgados: 100,
    totalPreguntas: 8,
    preguntas: [
      { id: 'p1', texto: '¿Cómo calificarías el ambiente de trabajo en tu departamento?', tipo: 'escala', dimension: 'Ambiente Laboral' },
      { id: 'p2', texto: '¿Te sientes valorado por tu equipo de trabajo?', tipo: 'escala', dimension: 'Reconocimiento' },
      { id: 'p3', texto: '¿La comunicación con tu supervisor es efectiva?', tipo: 'escala', dimension: 'Comunicación' },
      { id: 'p4', texto: '¿Tienes acceso a los recursos necesarios para realizar tu trabajo?', tipo: 'escala', dimension: 'Recursos' },
      { id: 'p5', texto: '¿Cómo valoras las instalaciones de FitCorp?', tipo: 'escala', dimension: 'Instalaciones' },
      { id: 'p6', texto: '¿Te sientes apoyado en tu desarrollo profesional?', tipo: 'escala', dimension: 'Desarrollo' },
      { id: 'p7', texto: '¿Qué aspectos consideras que deberíamos mejorar?', tipo: 'abierta', dimension: 'Sugerencias' },
      { id: 'p8', texto: '¿Qué es lo mejor de trabajar en FitCorp?', tipo: 'abierta', dimension: 'Aspectos Positivos' }
    ],
    participacion: {
      total_empleados: 45,
      respuestas: 38,
      porcentaje: 84.4,
      por_departamento: {
        'Entrenamiento Deportivo': { total: 12, respuestas: 11, porcentaje: 91.7 },
        'Fisioterapia': { total: 8, respuestas: 8, porcentaje: 100 },
        'Nutrición Deportiva': { total: 6, respuestas: 5, porcentaje: 83.3 },
        'Psicología Deportiva': { total: 5, respuestas: 4, porcentaje: 80.0 },
        'Administración': { total: 8, respuestas: 6, porcentaje: 75.0 },
        'Servicios Generales': { total: 6, respuestas: 4, porcentaje: 66.7 }
      }
    },
    resultados: {
      score_global: 4.4,
      nps: 8.5,
      dimensiones: {
        'Ambiente Laboral': { valor: 4.6, respuestas: 38, tendencia: 'positiva' },
        'Reconocimiento': { valor: 4.3, respuestas: 38, tendencia: 'estable' },
        'Comunicación': { valor: 4.2, respuestas: 38, tendencia: 'positiva' },
        'Recursos': { valor: 4.5, respuestas: 38, tendencia: 'positiva' },
        'Instalaciones': { valor: 4.8, respuestas: 38, tendencia: 'positiva' },
        'Desarrollo': { valor: 4.1, respuestas: 38, tendencia: 'estable' }
      },
      distribucion_respuestas: {
        'p1': { 1: 0, 2: 1, 3: 4, 4: 12, 5: 21 },
        'p2': { 1: 1, 2: 2, 3: 5, 4: 15, 5: 15 },
        'p3': { 1: 1, 2: 3, 3: 6, 4: 16, 5: 12 },
        'p4': { 1: 0, 2: 2, 3: 5, 4: 13, 5: 18 },
        'p5': { 1: 0, 2: 0, 3: 2, 4: 10, 5: 26 },
        'p6': { 1: 1, 2: 3, 3: 7, 4: 14, 5: 13 }
      },
      tendencias: 'muy_positiva',
      comparacion_anterior: {
        cambio: 0.2,
        porcentaje_cambio: 4.8
      }
    },
    comentarios_destacados: [
      {
        id: 'c1',
        dimension: 'Aspectos Positivos',
        texto: 'Las instalaciones de FitCorp son espectaculares. Tener acceso a equipamiento de última generación para nuestro propio entrenamiento es un beneficio increíble.',
        departamento: 'Entrenamiento Deportivo',
        fecha: '2024-11-22',
        sentimiento: 'muy_positivo'
      },
      {
        id: 'c2',
        dimension: 'Aspectos Positivos',
        texto: 'El equipo de fisioterapia es excepcional. Todos somos muy colaborativos y siempre estamos aprendiendo unos de otros.',
        departamento: 'Fisioterapia',
        fecha: '2024-11-23',
        sentimiento: 'positivo'
      },
      {
        id: 'c3',
        dimension: 'Sugerencias',
        texto: 'Sería genial tener más formaciones sobre las últimas tendencias en nutrición deportiva y suplementación.',
        departamento: 'Nutrición Deportiva',
        fecha: '2024-11-21',
        sentimiento: 'constructivo'
      },
      {
        id: 'c4',
        dimension: 'Aspectos Positivos',
        texto: 'Me encanta poder trabajar con atletas de alto rendimiento. Es muy motivador ver su progreso día a día.',
        departamento: 'Psicología Deportiva',
        fecha: '2024-11-24',
        sentimiento: 'positivo'
      },
      {
        id: 'c5',
        dimension: 'Sugerencias',
        texto: 'Podríamos mejorar la comunicación entre departamentos. A veces los planes de entrenamiento no están completamente alineados con nutrición.',
        departamento: 'Entrenamiento Deportivo',
        fecha: '2024-11-23',
        sentimiento: 'constructivo'
      },
      {
        id: 'c6',
        dimension: 'Aspectos Positivos',
        texto: 'El sistema de puntos y recompensas es muy motivador. Me gusta sentir que mi participación en encuestas se valora.',
        departamento: 'Administración',
        fecha: '2024-11-25',
        sentimiento: 'positivo'
      },
      {
        id: 'c7',
        dimension: 'Sugerencias',
        texto: 'Necesitamos más sesiones de mindfulness y gestión del estrés. El trabajo con deportistas de élite puede ser muy demandante.',
        departamento: 'Psicología Deportiva',
        fecha: '2024-11-22',
        sentimiento: 'constructivo'
      },
      {
        id: 'c8',
        dimension: 'Aspectos Positivos',
        texto: 'La dirección es muy transparente y siempre está abierta a escuchar sugerencias. Se siente un ambiente de confianza.',
        departamento: 'Fisioterapia',
        fecha: '2024-11-26',
        sentimiento: 'muy_positivo'
      },
      {
        id: 'c9',
        dimension: 'Aspectos Positivos',
        texto: 'Los programas de nutrición que ofrecemos son de clase mundial. Estoy orgulloso del trabajo que hacemos.',
        departamento: 'Nutrición Deportiva',
        fecha: '2024-11-24',
        sentimiento: 'muy_positivo'
      },
      {
        id: 'c10',
        dimension: 'Sugerencias',
        texto: 'Un sistema de reservas más flexible para las sesiones de apoyo personal sería muy útil.',
        departamento: 'Administración',
        fecha: '2024-11-25',
        sentimiento: 'constructivo'
      }
    ],
    acciones_recomendadas: [
      {
        id: 'a1',
        prioridad: 'alta',
        dimension: 'Desarrollo',
        titulo: 'Programa de Formación Continua',
        descripcion: 'Implementar ciclos trimestrales de formación especializada en nuevas técnicas y metodologías deportivas',
        impacto_estimado: 'alto',
        recursos_necesarios: 'Presupuesto para instructores externos, tiempo dedicado',
        plazo_sugerido: '3 meses'
      },
      {
        id: 'a2',
        prioridad: 'media',
        dimension: 'Comunicación',
        titulo: 'Reuniones Interdepartamentales',
        descripcion: 'Establecer reuniones semanales entre entrenamiento, nutrición y fisioterapia para alinear planes',
        impacto_estimado: 'medio',
        recursos_necesarios: '2 horas semanales',
        plazo_sugerido: '1 mes'
      },
      {
        id: 'a3',
        prioridad: 'media',
        dimension: 'Bienestar',
        titulo: 'Programa de Mindfulness',
        descripcion: 'Sesiones semanales de mindfulness y gestión del estrés para todo el equipo',
        impacto_estimado: 'alto',
        recursos_necesarios: 'Instructor especializado, sala dedicada',
        plazo_sugerido: '1 mes'
      }
    ]
  },
  {
    id: 'enc-fitcorp-002',
    titulo: 'Evaluación de Servicios Deportivos',
    descripcion: 'Tu opinión sobre nuestros programas de entrenamiento y recuperación',
    tipo: 'satisfaccion',
    categoria: 'bienestar',
    plantilla_id: 'plantilla-2',
    estado: 'activa',
    estado_label: 'Activa',
    fecha_creacion: '2024-11-01',
    fecha_inicio: '2024-11-21',
    fecha_fin: '2024-11-27',
    es_anonima: true,
    privacidad_nivel: 'anonimo',
    puntos_otorgados: 150,
    totalPreguntas: 7,
    preguntas: [
      { id: 'p1', texto: '¿Cómo calificas la calidad de nuestros programas de entrenamiento?', tipo: 'escala', dimension: 'Calidad Servicios' },
      { id: 'p2', texto: '¿Los servicios de recuperación (crioterapia, masajes) cumplen tus expectativas?', tipo: 'escala', dimension: 'Recuperación' },
      { id: 'p3', texto: '¿Qué tan satisfecho estás con el equipamiento disponible?', tipo: 'escala', dimension: 'Equipamiento' },
      { id: 'p4', texto: '¿Los planes nutricionales son efectivos y personalizados?', tipo: 'escala', dimension: 'Nutrición' },
      { id: 'p5', texto: '¿El apoyo psicológico te ayuda en tu desempeño?', tipo: 'escala', dimension: 'Apoyo Psicológico' },
      { id: 'p6', texto: '¿Qué servicio te gustaría que mejoráramos?', tipo: 'abierta', dimension: 'Mejoras' },
      { id: 'p7', texto: '¿Qué nuevo servicio te gustaría que ofreciéramos?', tipo: 'abierta', dimension: 'Innovación' }
    ],
    participacion: {
      total_empleados: 45,
      respuestas: 29,
      porcentaje: 64.4,
      por_departamento: {
        'Entrenamiento Deportivo': { total: 12, respuestas: 9, porcentaje: 75.0 },
        'Fisioterapia': { total: 8, respuestas: 6, porcentaje: 75.0 },
        'Nutrición Deportiva': { total: 6, respuestas: 4, porcentaje: 66.7 },
        'Psicología Deportiva': { total: 5, respuestas: 3, porcentaje: 60.0 },
        'Administración': { total: 8, respuestas: 4, porcentaje: 50.0 },
        'Servicios Generales': { total: 6, respuestas: 3, porcentaje: 50.0 }
      }
    },
    resultados: {
      score_global: 4.5,
      nps: 8.8,
      dimensiones: {
        'Calidad Servicios': { valor: 4.7, respuestas: 29, tendencia: 'positiva' },
        'Recuperación': { valor: 4.6, respuestas: 29, tendencia: 'positiva' },
        'Equipamiento': { valor: 4.8, respuestas: 29, tendencia: 'muy_positiva' },
        'Nutrición': { valor: 4.5, respuestas: 29, tendencia: 'positiva' },
        'Apoyo Psicológico': { valor: 4.3, respuestas: 29, tendencia: 'estable' }
      },
      distribucion_respuestas: {
        'p1': { 1: 0, 2: 0, 3: 2, 4: 9, 5: 18 },
        'p2': { 1: 0, 2: 1, 3: 3, 4: 10, 5: 15 },
        'p3': { 1: 0, 2: 0, 3: 1, 4: 8, 5: 20 },
        'p4': { 1: 0, 2: 1, 3: 4, 4: 12, 5: 12 },
        'p5': { 1: 1, 2: 2, 3: 5, 4: 13, 5: 8 }
      },
      tendencias: 'muy_positiva',
      comparacion_anterior: {
        cambio: 0.3,
        porcentaje_cambio: 7.1
      }
    },
    comentarios_destacados: [
      {
        id: 'c1',
        dimension: 'Calidad Servicios',
        texto: 'La crioterapia ha mejorado significativamente mis tiempos de recuperación. Excelente inversión.',
        departamento: 'Entrenamiento Deportivo',
        fecha: '2024-11-23',
        sentimiento: 'muy_positivo'
      },
      {
        id: 'c2',
        dimension: 'Equipamiento',
        texto: 'El nuevo equipamiento de análisis biomecánico es impresionante. Nos da datos muy precisos.',
        departamento: 'Fisioterapia',
        fecha: '2024-11-24',
        sentimiento: 'muy_positivo'
      },
      {
        id: 'c3',
        dimension: 'Innovación',
        texto: 'Sería fantástico incorporar sesiones de yoga y meditación guiadas específicamente para deportistas.',
        departamento: 'Psicología Deportiva',
        fecha: '2024-11-22',
        sentimiento: 'constructivo'
      },
      {
        id: 'c4',
        dimension: 'Mejoras',
        texto: 'Los planes nutricionales podrían incluir más opciones para dietas veganas y vegetarianas de alto rendimiento.',
        departamento: 'Nutrición Deportiva',
        fecha: '2024-11-25',
        sentimiento: 'constructivo'
      },
      {
        id: 'c5',
        dimension: 'Calidad Servicios',
        texto: 'Los protocolos de entrenamiento están perfectamente estructurados. Se nota la experiencia del equipo.',
        departamento: 'Entrenamiento Deportivo',
        fecha: '2024-11-24',
        sentimiento: 'positivo'
      }
    ],
    acciones_recomendadas: [
      {
        id: 'a1',
        prioridad: 'media',
        dimension: 'Innovación',
        titulo: 'Programa de Yoga Deportivo',
        descripcion: 'Implementar sesiones de yoga adaptado para atletas de alto rendimiento',
        impacto_estimado: 'alto',
        recursos_necesarios: 'Instructor certificado en yoga deportivo, espacio dedicado',
        plazo_sugerido: '2 meses'
      },
      {
        id: 'a2',
        prioridad: 'baja',
        dimension: 'Nutrición',
        titulo: 'Menús Plant-Based',
        descripcion: 'Ampliar opciones de planes nutricionales veganos y vegetarianos de alta performance',
        impacto_estimado: 'medio',
        recursos_necesarios: 'Consultoría nutricional especializada',
        plazo_sugerido: '1 mes'
      }
    ]
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
