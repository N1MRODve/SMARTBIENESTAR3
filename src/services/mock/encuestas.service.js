// /src/services/mock/encuestas.service.js
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