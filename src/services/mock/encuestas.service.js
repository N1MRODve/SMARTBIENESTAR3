// /src/services/mock/encuestas.service.js
import { ref } from 'vue';

// --- Base de Datos Simulada ---

// Usamos una lista de empleados simple para los cálculos.
const totalEmpleados = 50; 

const encuestasDb = ref([
  {
    id: 'enc-01',
    titulo: 'Encuesta de Pulso de Bienestar (Q3)',
    categoria: 'general',
    estado: 'Finalizada',
    totalParticipantes: 42,
    privacidadNivel: 'anonimato_parcial',
    preguntas: [
      {
        id: 'p1',
        texto: '¿Cómo calificarías tu nivel de estrés esta semana?',
        resultados: { labels: ['Bajo', 'Medio', 'Alto'], data: [10, 20, 12] },
        resultadosPorGrupo: [
          { departamento: 'Desarrollo', total_respuestas: 8, promedio: '2.1 (Medio)' },
          { departamento: 'Marketing', total_respuestas: 6, promedio: '2.8 (Alto)' },
          { departamento: 'Ventas', total_respuestas: 7, promedio: '1.9 (Bajo-Medio)' },
          { departamento: 'RRHH', total_respuestas: 3, promedio: '1.7 (Bajo)' },
          { departamento: 'Finanzas', total_respuestas: 5, promedio: '2.2 (Medio)' },
          { departamento: 'Operaciones', total_respuestas: 8, promedio: '2.4 (Medio)' },
          { departamento: 'Atención al Cliente', total_respuestas: 5, promedio: '2.6 (Medio-Alto)' }
        ],
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
        resultados: { labels: ['Sí', 'No'], data: [35, 7] },
        resultadosPorGrupo: [
          { departamento: 'Desarrollo', total_respuestas: 8, promedio: '87.5% Sí' },
          { departamento: 'Marketing', total_respuestas: 6, promedio: '83.3% Sí' },
          { departamento: 'Ventas', total_respuestas: 7, promedio: '71.4% Sí' },
          { departamento: 'RRHH', total_respuestas: 3, promedio: '100% Sí' },
          { departamento: 'Finanzas', total_respuestas: 5, promedio: '80% Sí' },
          { departamento: 'Operaciones', total_respuestas: 8, promedio: '87.5% Sí' },
          { departamento: 'Atención al Cliente', total_respuestas: 5, promedio: '60% Sí' }
        ],
        insight: 'La mayoría se siente equipada para su trabajo.',
        recomendacion: null
      }
    ]
  },
  {
    id: 'enc-02',
    titulo: 'Encuesta de Clima Laboral 2025',
    categoria: 'comunicacion',
    estado: 'Activa',
    totalParticipantes: 35,
    privacidadNivel: 'anonimato_completo'
  },
  // TODO: conectar con tabla "encuestas" y "respuestas_encuestas" cuando la BD esté activa.
  {
    id: 'clima360',
    titulo: 'Clima360 Insight',
    descripcion: 'Diagnóstico integral del clima laboral y bienestar organizacional.',
    categoria: 'clima-laboral',
    estado: 'Plantilla',
    totalParticipantes: 0,
    privacidadNivel: 'anonimato_completo',
    esPlantilla: true,
    preguntas: [
      { id: 1, texto: 'La tasa de rotación está dentro de los estándares aceptables.', variable: 'rotacion', tipo: 'escala' },
      { id: 2, texto: 'El absentismo no afecta significativamente la productividad.', variable: 'absentismo', tipo: 'escala' },
      { id: 3, texto: 'Los empleados alcanzan consistentemente los objetivos de productividad establecidos.', variable: 'productividad', tipo: 'escala' },
      { id: 4, texto: 'El liderazgo contribuye positivamente a la retención de talento.', variable: 'liderazgo', tipo: 'escala' },
      { id: 5, texto: 'La comunicación interna es clara, transparente y efectiva.', variable: 'comunicacion', tipo: 'escala' },
      { id: 6, texto: 'Ofrecemos oportunidades de desarrollo profesional y movilidad interna.', variable: 'desarrollo', tipo: 'escala' },
      { id: 7, texto: 'Los empleados reciben reconocimiento oportuno y feedback constructivo.', variable: 'reconocimiento', tipo: 'escala' },
      { id: 8, texto: 'Promovemos una cultura de bienestar y equilibrio vida-trabajo.', variable: 'bienestar', tipo: 'escala' },
      { id: 9, texto: 'La empresa se adapta eficazmente a los cambios.', variable: 'adaptabilidad', tipo: 'escala' },
      { id: 10, texto: 'Los empleados muestran sentido de pertenencia y compromiso.', variable: 'pertenencia', tipo: 'escala' }
    ],
    metricas: [
      { id: 11, texto: 'Tasa de rotación anual', opciones: ['<5%', '5–10%', '11–15%', '>15%'], valores: [5, 4, 3, 1] },
      { id: 12, texto: 'Tasa de absentismo', opciones: ['Bajo', 'Medio', 'Alto'], valores: [5, 3, 1] },
      { id: 13, texto: 'Índice de productividad', opciones: ['Muy alta', 'Alta', 'Media', 'Baja', 'Muy baja'], valores: [5, 4, 3, 2, 1] }
    ]
  }
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

// Alias para compatibilidad con otros módulos
export const getSurveys = getEncuestas;
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

// Alias para compatibilidad con otros módulos
/**
 * Devuelve la encuesta activa actual.
 */
export const getActiveSurvey = async () => {
  const encuestaActiva = encuestasDb.value.find(e => e.estado === 'Activa');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (encuestaActiva) {
        resolve(encuestaActiva);
      } else {
        reject(new Error('No hay encuesta activa'));
      }
    }, 300);
  });
};

/**
 * Simula agregar una nueva encuesta a la base de datos.
 * @param {Object} nuevaEncuesta - Los datos de la nueva encuesta.
 */
export const addSurvey = async (nuevaEncuesta) => {
  const encuestaConId = {
    ...nuevaEncuesta,
    id: `enc-${Date.now()}`,
    categoria: nuevaEncuesta.categoria || 'general',
    totalParticipantes: 0,
    estado: 'Borrador'
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      encuestasDb.value.push(encuestaConId);
      resolve(encuestaConId);
    }, 300);
  });
};
export const getSurveyById = getResultadosEncuestaById;

/**
 * Simula la actualización de una encuesta existente.
 * @param {Object} encuestaActualizada - Los datos actualizados de la encuesta.
 */
export const updateSurvey = async (encuestaActualizada) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = encuestasDb.value.findIndex(e => e.id === encuestaActualizada.id);
      
      if (index === -1) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }
      
      // Actualizar la encuesta manteniendo algunos campos originales
      encuestasDb.value[index] = {
        ...encuestasDb.value[index],
        titulo: encuestaActualizada.titulo,
        descripcion: encuestaActualizada.descripcion || '',
        categoria: encuestaActualizada.categoria || 'general',
        estado: encuestaActualizada.estado,
        preguntas: encuestaActualizada.preguntas || [],
        fechaActualizacion: new Date().toISOString()
      };
      
      console.log('Encuesta actualizada:', encuestasDb.value[index]);
      resolve({ 
        success: true, 
        encuesta: encuestasDb.value[index],
        message: 'Encuesta actualizada correctamente'
      });
    }, 500);
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