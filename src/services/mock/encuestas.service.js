// /src/services/mock/encuestas.service.js

// Función para generar encuestas por defecto con datos simulados
const getDefaultSurveys = () => {
  const primeraEncuesta = {
    id: 1,
    titulo: 'Pulso de Bienestar Semanal',
    descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
    fechaCreacion: '2024-01-15',
    estado: 'activa',
    active: true,
    preguntas: [
      { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
      { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no', opciones: ['Sí', 'No'] },
      { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5', opciones: [1, 2, 3, 4, 5] },
      { id: 104, texto: '¿Hay algo más que te gustaría compartir con nosotros sobre tu experiencia laboral?', tipo: 'texto_abierto', opciones: [] }
    ],
    respuestas: [] // Empezamos con el array vacío
  };

  // Comentarios de ejemplo para las preguntas de texto abierto
  const comentariosEjemplo = [
    "Me gustaría tener más flexibilidad en los horarios de trabajo.",
    "El ambiente de trabajo es muy positivo, pero podríamos mejorar la comunicación entre equipos.",
    "Sería genial tener más oportunidades de capacitación y desarrollo profesional.",
    "La carga de trabajo a veces es abrumadora, especialmente los viernes.",
    "Agradezco mucho el apoyo de mi supervisor y el equipo de recursos humanos.",
    "Creo que necesitamos mejores herramientas tecnológicas para ser más eficientes.",
    "Me encanta trabajar aquí, pero el espacio físico podría ser más cómodo.",
    "Sería útil tener más reuniones de feedback para saber cómo estoy progresando.",
    "El programa de beneficios es excelente, especialmente el seguro médico.",
    "A veces siento que mi trabajo no es valorado lo suficiente.",
    "Me gustaría participar más en la toma de decisiones que afectan mi trabajo.",
    "El equilibrio vida-trabajo ha mejorado mucho desde que implementaron el trabajo remoto.",
    "Creo que podríamos tener más actividades de team building.",
    "La cafetería necesita más opciones saludables.",
    "Me siento muy motivado trabajando en este equipo.",
    "Sería genial tener un programa de mentoring más estructurado.",
    "A veces las reuniones son demasiado largas y poco productivas.",
    "Agradezco la transparencia de la gerencia en cuanto a los objetivos de la empresa.",
    "Me gustaría tener más días de vacaciones al año.",
    "El proceso de evaluación de desempeño podría ser más claro y frecuente.",
    "Excelente cultura empresarial, me siento parte de algo importante.",
    "Necesitamos mejor ventilación en la oficina.",
    "Me encanta la diversidad del equipo y las diferentes perspectivas que aporta.",
    "Sería útil tener más capacitación en nuevas tecnologías.",
    "El estacionamiento es un problema constante.",
    "Me siento muy apoyado por mi equipo cuando tengo dificultades.",
    "Creo que deberíamos tener más flexibilidad para trabajar desde casa.",
    "La comunicación interna ha mejorado mucho este año.",
    "Me gustaría tener más oportunidades de crecimiento dentro de la empresa.",
    "El ambiente de trabajo es muy colaborativo y positivo.",
    "",  // Algunas respuestas vacías para simular realismo
    "",
    "Sin comentarios adicionales por ahora.",
    "Todo bien en general.",
    "Gracias por preguntar, significa mucho que se preocupen por nosotros."
  ];
  // --- INICIO DE LA LÓGICA DE SIEMBRA ---
  const TOTAL_RESPUESTAS_SIMULADAS = 50;
  for (let i = 0; i < TOTAL_RESPUESTAS_SIMULADAS; i++) {
    const unaRespuestaCompleta = {
      id: Date.now() + i,
      fechaRespuesta: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      respuestas: {}
    };
    
    primeraEncuesta.preguntas.forEach(pregunta => {
      if (pregunta.tipo === 'texto_abierto') {
        // Para preguntas de texto abierto, usar comentarios de ejemplo
        unaRespuestaCompleta.respuestas[pregunta.id] = comentariosEjemplo[Math.floor(Math.random() * comentariosEjemplo.length)];
      } else {
        // Para otros tipos, selecciona una opción aleatoria de las disponibles
        const opcionAleatoria = pregunta.opciones[Math.floor(Math.random() * pregunta.opciones.length)];
        unaRespuestaCompleta.respuestas[pregunta.id] = opcionAleatoria;
      }
    });
    
    primeraEncuesta.respuestas.push(unaRespuestaCompleta);
  }
  // --- FIN DE LA LÓGICA DE SIEMBRA ---

  // Segunda encuesta (semana anterior) con las mismas preguntas
  const segundaEncuesta = {
    id: 2,
    titulo: 'Pulso de Bienestar (Semana Anterior)',
    descripcion: 'Encuesta de la semana anterior para comparación',
    fechaCreacion: '2024-01-08',
    estado: 'finalizada',
    active: false,
    preguntas: [
      { id: 201, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
      { id: 202, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no', opciones: ['Sí', 'No'] },
      { id: 203, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5', opciones: [1, 2, 3, 4, 5] },
      { id: 204, texto: '¿Hay algo más que te gustaría compartir con nosotros sobre tu experiencia laboral?', tipo: 'texto_abierto', opciones: [] }
    ],
    respuestas: []
  };

  // Comentarios diferentes para la semana anterior
  const comentariosAnteriores = [
    "La semana pasada fue muy estresante por los plazos ajustados.",
    "Necesitamos urgentemente mejores herramientas de comunicación.",
    "El trabajo remoto no está funcionando bien para nuestro equipo.",
    "Me siento desconectado del resto del equipo.",
    "La carga de trabajo ha sido excesiva últimamente.",
    "Agradezco el esfuerzo de la gerencia por mantenernos informados.",
    "Creo que necesitamos más personal en nuestro departamento.",
    "El nuevo sistema es confuso y ralentiza nuestro trabajo.",
    "Me gustaría tener más claridad sobre mis responsabilidades.",
    "El ambiente de trabajo se siente tenso últimamente.",
    "Necesitamos mejor coordinación entre los diferentes equipos.",
    "Me siento abrumado con tantos proyectos simultáneos.",
    "La falta de feedback constante me genera incertidumbre.",
    "Sería útil tener más reuniones de seguimiento.",
    "El espacio de trabajo no es adecuado para la concentración.",
    "Me preocupa la falta de oportunidades de crecimiento.",
    "Las reuniones son demasiado frecuentes y poco efectivas.",
    "Necesito más tiempo para completar mis tareas adecuadamente.",
    "La comunicación con otros departamentos es deficiente.",
    "Me gustaría tener más autonomía en mi trabajo.",
    "El proceso de aprobación es muy lento y burocrático.",
    "Siento que mi opinión no es tomada en cuenta.",
    "Necesitamos mejores políticas de trabajo flexible.",
    "La presión por cumplir objetivos está afectando la calidad.",
    "Me gustaría tener más capacitación en las nuevas herramientas.",
    "",
    "",
    "Sin comentarios específicos.",
    "Espero que las cosas mejoren pronto.",
    "Gracias por preguntar, aunque ha sido una semana difícil."
  ];
  // Generar respuestas para la segunda encuesta con tendencias ligeramente diferentes
  for (let i = 0; i < TOTAL_RESPUESTAS_SIMULADAS; i++) {
    const unaRespuestaCompleta = {
      id: Date.now() + 1000 + i,
      fechaRespuesta: new Date(Date.now() - (7 + Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      respuestas: {}
    };
    
    segundaEncuesta.preguntas.forEach(pregunta => {
      let opcionAleatoria;
      
      if (pregunta.tipo === 'texto_abierto') {
        // Para preguntas de texto abierto, usar comentarios de la semana anterior
        unaRespuestaCompleta.respuestas[pregunta.id] = comentariosAnteriores[Math.floor(Math.random() * comentariosAnteriores.length)];
      } else {
        // Crear tendencias específicas para cada pregunta
        if (pregunta.id === 201) { // Estrés - tendencia a más estrés en semana anterior
          const rand = Math.random();
          if (rand < 0.2) opcionAleatoria = 'Bajo';
          else if (rand < 0.4) opcionAleatoria = 'Medio';
          else opcionAleatoria = 'Alto';
        } else if (pregunta.id === 202) { // Herramientas - menos herramientas en semana anterior
          opcionAleatoria = Math.random() < 0.4 ? 'Sí' : 'No';
        } else if (pregunta.id === 203) { // Balance - peor balance en semana anterior
          const rand = Math.random();
          if (rand < 0.3) opcionAleatoria = 1;
          else if (rand < 0.5) opcionAleatoria = 2;
          else if (rand < 0.7) opcionAleatoria = 3;
          else if (rand < 0.85) opcionAleatoria = 4;
          else opcionAleatoria = 5;
        } else {
          opcionAleatoria = pregunta.opciones[Math.floor(Math.random() * pregunta.opciones.length)];
        }
      }
      
      unaRespuestaCompleta.respuestas[pregunta.id] = opcionAleatoria;
    });
    
    segundaEncuesta.respuestas.push(unaRespuestaCompleta);
  }
  return [
    primeraEncuesta,
    segundaEncuesta,
    {
      id: 3,
      titulo: 'Evaluación de Clima Laboral',
      descripcion: 'Evaluación mensual del ambiente de trabajo',
      fechaCreacion: '2024-01-10',
      estado: 'finalizada',
      respuestas: [],
      preguntas: [
        { id: 301, texto: '¿Cómo calificarías la comunicación en tu equipo?', tipo: 'escala_1_5', opciones: [1, 2, 3, 4, 5] },
        { id: 302, texto: '¿Te sientes valorado en tu trabajo?', tipo: 'si_no', opciones: ['Sí', 'No'] }
      ]
    },
    {
      id: 4,
      titulo: 'Satisfacción con Beneficios',
      descripcion: 'Encuesta sobre los beneficios corporativos',
      fechaCreacion: '2024-01-05',
      estado: 'borrador',
      respuestas: [],
      preguntas: [
        { id: 401, texto: '¿Estás satisfecho con los beneficios de salud?', tipo: 'opcion_multiple', opciones: ['Muy satisfecho', 'Satisfecho', 'Insatisfecho'] }
      ]
    }
  ];
};

// Base de datos simulada de encuestas - inicializada con datos por defecto
let surveys = getDefaultSurveys();

// Mantener la estructura original para compatibilidad
const surveyData = surveys.find(s => s.id === 1) || {
  id: 1,
  titulo: 'Pulso de Bienestar Semanal',
  preguntas: [
    { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
    { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no' },
    { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5' }
  ]
};

// Función para resetear las encuestas a su estado inicial
export const resetSurveys = () => {
  surveys = getDefaultSurveys();
  return surveys;
};

// Función para obtener todas las encuestas
export const getSurveys = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...surveys]); // Devolver una copia para evitar mutaciones
    }, 300);
  });
};

// Función para obtener la encuesta activa (para empleados)
export const getActiveSurvey = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const activeSurvey = surveys.find(s => s.estado === 'activa');
      resolve(activeSurvey || surveyData);
    }, 400);
  });
};

// Función para obtener una encuesta específica por ID
export const getSurveyById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const survey = surveys.find(s => s.id === parseInt(id));
      if (survey) {
        resolve({ ...survey }); // Devolver una copia
      } else {
        reject(new Error('Encuesta no encontrada'));
      }
    }, 300);
  });
};

// Función para añadir respuesta a una encuesta
export const addAnswer = (surveyId, respuestas) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const survey = surveys.find(s => s.id === surveyId);
      if (survey) {
        survey.respuestas.push({
          id: Date.now(),
          respuestas: respuestas,
          fechaRespuesta: new Date().toISOString()
        });
      }
      resolve({ success: true });
    }, 500);
  });
};

// Función para añadir una nueva encuesta
export const addSurvey = (nuevaEncuesta) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const encuesta = {
        id: Date.now(),
        titulo: nuevaEncuesta.titulo,
        descripcion: nuevaEncuesta.descripcion || '',
        fechaCreacion: new Date().toISOString().split('T')[0],
        estado: nuevaEncuesta.estado || 'activa',
        respuestas: [],
        preguntas: nuevaEncuesta.preguntas.map((p, index) => ({
          id: Date.now() + index,
          texto: p.texto,
          tipo: p.tipo,
          opciones: p.opciones || []
        }))
      };
      
      surveys.push(encuesta);
      console.log('Nueva encuesta añadida:', encuesta);
      resolve({ success: true, encuesta });
    }, 800);
  });
};

// Función auxiliar para generar respuestas simuladas
const generateMockResponses = (survey) => {
  const responses = [];
  const numResponses = Math.floor(Math.random() * 15) + 5; // Entre 5 y 20 respuestas
  
  for (let i = 0; i < numResponses; i++) {
    const respuesta = {
      id: Date.now() + i,
      fechaRespuesta: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      respuestas: {}
    };
    
    survey.preguntas.forEach(pregunta => {
      switch (pregunta.tipo) {
        case 'opcion_multiple':
          const randomOption = pregunta.opciones[Math.floor(Math.random() * pregunta.opciones.length)];
          respuesta.respuestas[pregunta.id] = randomOption;
          break;
        case 'si_no':
          respuesta.respuestas[pregunta.id] = Math.random() > 0.5 ? 'Sí' : 'No';
          break;
        case 'escala_1_5':
          respuesta.respuestas[pregunta.id] = Math.floor(Math.random() * 5) + 1;
          break;
      }
    });
    
    responses.push(respuesta);
  }
  
  return responses;
};