// /src/services/mock/encuestas.service.js
import { ref } from 'vue';

// --- Base de Datos Simulada ---

// Usamos una lista de empleados simple para los cálculos.
const totalEmpleados = 50; 

const encuestasDb = ref([
  { 
    id: 'enc-01', 
    titulo: 'Encuesta de Pulso de Bienestar (Q3)', 
    estado: 'Finalizada', 
    totalParticipantes: 42,
    preguntas: [
      { 
        id: 'p1', 
        texto: '¿Cómo calificarías tu nivel de estrés esta semana?',
        resultados: { labels: ['Bajo', 'Medio', 'Alto'], data: [10, 20, 12] }, // 42 respuestas
        insight: 'Un 28% del equipo reporta un nivel de estrés alto.',
        recomendacion: {
          id: 'serv-01',
          titulo: 'Taller de Mindfulness y Gestión del Estrés',
          descripcion: 'Ideal para dar herramientas contra el estrés.'
        }
      },
      {
        id: 'p2',
        texto: '¿Sientes que tienes las herramientas adecuadas?',
        resultados: { labels: ['Sí', 'No'], data: [35, 7] }, // 42 respuestas
        insight: 'La mayoría se siente equipada para su trabajo.',
        recomendacion: null
      }
    ]
  },
  { 
    id: 'enc-02', 
    titulo: 'Encuesta de Clima Laboral 2025', 
    estado: 'Activa', 
    totalParticipantes: 35,
    // ... (podríamos añadir más datos aquí)
  },
]);

// --- Funciones del Servicio ---

/**
 * Devuelve una lista de todas las encuestas con metadatos calculados.
 */
export const getEncuestas = async () => {
  const encuestasConMetadatos = encuestasDb.value.map(encuesta => {
    const tasaParticipacion = Math.round((encuesta.totalParticipantes / totalEmpleados) * 100);
    return {
      ...encuesta,
      tasaParticipacion: `${tasaParticipacion}%`
    };
  });
  return new Promise(resolve => setTimeout(() => resolve(encuestasConMetadatos), 300));
};

/**
 * Devuelve los detalles y resultados de una sola encuesta por su ID.
 * @param {string} encuestaId - El ID de la encuesta a buscar.
 */
export const getResultadosEncuestaById = async (encuestaId) => {
  const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (encuesta) {
        resolve(encuesta);
      } else {
        reject(new Error('Encuesta no encontrada'));
      }
    }, 300);
  });
};

/**
 * Simula el proceso de enviar respuestas a una encuesta.
 * @param {string} encuestaId - El ID de la encuesta.
 * @param {Object} respuestas - Las respuestas del usuario.
 */
export const addAnswer = async (encuestaId, respuestas) => {
  const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (encuesta && encuesta.estado === 'Activa') {
        // Simular incremento de participantes
        encuesta.totalParticipantes += 1;
        resolve({ success: true, message: 'Respuestas enviadas correctamente' });
      } else if (!encuesta) {
        reject(new Error('Encuesta no encontrada'));
      } else {
        reject(new Error('La encuesta no está activa'));
      }
    }, 300);
  });
};