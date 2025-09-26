// /src/services/mock/encuestas.service.js

// Función para generar encuestas por defecto con datos simulados
const getDefaultSurveys = () => {
  const primeraEncuesta = {
    id: 1,
    titulo: 'Pulso de Bienestar Semanal',
    descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
    fechaCreacion: '2024-01-15',
    estado: 'activa',
    preguntas: [
      { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
      { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no', opciones: ['Sí', 'No'] },
      { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5', opciones: [1, 2, 3, 4, 5] }
    ],
    respuestas: [] // Empezamos con el array vacío
  };

  // --- INICIO DE LA LÓGICA DE SIEMBRA ---
  const TOTAL_RESPUESTAS_SIMULADAS = 50;
  for (let i = 0; i < TOTAL_RESPUESTAS_SIMULADAS; i++) {
    const unaRespuestaCompleta = {
      id: Date.now() + i,
      fechaRespuesta: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      respuestas: {}
    };
    
    primeraEncuesta.preguntas.forEach(pregunta => {
      // Selecciona una opción aleatoria de las disponibles para cada pregunta
      const opcionAleatoria = pregunta.opciones[Math.floor(Math.random() * pregunta.opciones.length)];
      unaRespuestaCompleta.respuestas[pregunta.id] = opcionAleatoria;
    });
    
    primeraEncuesta.respuestas.push(unaRespuestaCompleta);
  }
  // --- FIN DE LA LÓGICA DE SIEMBRA ---

  return [
    primeraEncuesta,
    {
      id: 2,
      titulo: 'Evaluación de Clima Laboral',
      descripcion: 'Evaluación mensual del ambiente de trabajo',
      fechaCreacion: '2024-01-10',
      estado: 'finalizada',
      respuestas: [],
      preguntas: [
        { id: 201, texto: '¿Cómo calificarías la comunicación en tu equipo?', tipo: 'escala_1_5', opciones: [1, 2, 3, 4, 5] },
        { id: 202, texto: '¿Te sientes valorado en tu trabajo?', tipo: 'si_no', opciones: ['Sí', 'No'] }
      ]
    },
    {
      id: 3,
      titulo: 'Satisfacción con Beneficios',
      descripcion: 'Encuesta sobre los beneficios corporativos',
      fechaCreacion: '2024-01-05',
      estado: 'borrador',
      respuestas: [],
      preguntas: [
        { id: 301, texto: '¿Estás satisfecho con los beneficios de salud?', tipo: 'opcion_multiple', opciones: ['Muy satisfecho', 'Satisfecho', 'Insatisfecho'] }
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
  {
    id: 1,
    titulo: 'Pulso de Bienestar Semanal',
    descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
    fechaCreacion: '2024-01-15',
    estado: 'activa',
    respuestas: [], // Array para almacenar respuestas
    preguntas: [
      { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
      { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no' },
      { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5' }
    ]
  },
  {
    id: 2,
    titulo: 'Evaluación de Clima Laboral',
    descripcion: 'Evaluación mensual del ambiente de trabajo',
    fechaCreacion: '2024-01-10',
    estado: 'finalizada',
    respuestas: [],
    preguntas: [
      { id: 201, texto: '¿Cómo calificarías la comunicación en tu equipo?', tipo: 'escala_1_5' },
      { id: 202, texto: '¿Te sientes valorado en tu trabajo?', tipo: 'si_no' }
    ]
  },
  {
    id: 3,
    titulo: 'Satisfacción con Beneficios',
    descripcion: 'Encuesta sobre los beneficios corporativos',
    fechaCreacion: '2024-01-05',
    estado: 'borrador',
    respuestas: [],
    preguntas: [
      { id: 301, texto: '¿Estás satisfecho con los beneficios de salud?', tipo: 'opcion_multiple', opciones: ['Muy satisfecho', 'Satisfecho', 'Insatisfecho'] }
    ]
  }
];

const surveyData = {
  id: 1,
  titulo: 'Pulso de Bienestar Semanal',
  preguntas: [
    { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
    { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no' },
    { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5' }
  ]
};

export const getActiveSurvey = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(surveyData);
    }, 400);
  });
};

// Función para obtener todas las encuestas
export const getSurveys = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(surveys);
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

// Función para obtener una encuesta específica por ID
export const getSurveyById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const survey = surveys.find(s => s.id === parseInt(id));
      if (survey) {
        // Simular algunas respuestas para demostración
        const surveyWithResponses = {
          ...survey,
          respuestas: generateMockResponses(survey)
        };
        resolve(surveyWithResponses);
      } else {
        reject(new Error('Encuesta no encontrada'));
      }
    }, 300);
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