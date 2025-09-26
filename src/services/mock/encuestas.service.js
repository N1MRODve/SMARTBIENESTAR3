// /src/services/mock/encuestas.service.js

// Base de datos simulada de encuestas
const surveys = [
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