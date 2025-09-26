// /src/services/mock/encuestas.service.js

// Base de datos simulada de encuestas
const surveys = [
  {
    id: 1,
    titulo: 'Pulso de Bienestar Semanal',
    descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
    fechaCreacion: '2024-01-15',
    estado: 'activa',
    preguntas: [
      { id: 101, texto: '¿Cómo calificarías tu nivel de estrés esta semana?', tipo: 'opcion_multiple', opciones: ['Bajo', 'Medio', 'Alto'] },
      { id: 102, texto: '¿Sientes que tienes las herramientas adecuadas para hacer tu trabajo?', tipo: 'si_no' },
      { id: 103, texto: 'En una escala del 1 al 5, ¿qué tan satisfecho estás con el balance vida-trabajo?', tipo: 'escala_1_5' }
    ],
    respuestas: [] // Array para almacenar respuestas
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