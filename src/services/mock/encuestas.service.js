// Servicio Mock de Encuestas - SportLife Performance
import { ref } from 'vue';
import {
  plantillasEncuestas,
  encuestasDemo,
  estadisticasEncuestas,
  comentariosRecientes,
  accionesRecomendadas,
  getEncuestaById as getEncuestaFromData,
  getPlantillaById,
  calcularEstadisticasActuales
} from '@/utils/encuestasDemoData';

// Base de datos reactiva
const encuestasDb = ref([...encuestasDemo]);
const plantillasDb = ref([...plantillasEncuestas]);
const comentariosDb = ref([...comentariosRecientes]);
const accionesDb = ref([...accionesRecomendadas]);

/**
 * Obtiene todas las encuestas con metadatos
 */
export const getEncuestas = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const encuestasConMetadatos = encuestasDb.value.map(encuesta => {
        // Obtener preguntas de la plantilla si existe
        let preguntas = [];
        if (encuesta.plantilla_id) {
          const plantilla = plantillasDb.value.find(p => p.id === encuesta.plantilla_id);
          if (plantilla) {
            preguntas = plantilla.preguntas;
          }
        }

        return {
          ...encuesta,
          preguntas: preguntas,
          tasaParticipacion: `${encuesta.participacion.porcentaje.toFixed(1)}%`,
          estado_label: encuesta.estado.charAt(0).toUpperCase() + encuesta.estado.slice(1)
        };
      });
      resolve(encuestasConMetadatos);
    }, 300);
  });
};

// Alias para compatibilidad
export const getSurveys = getEncuestas;

/**
 * Obtiene una encuesta por ID con todos sus resultados
 */
export const getResultadosEncuestaById = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (encuesta) {
        // Si la encuesta tiene plantilla, agregar las preguntas
        if (encuesta.plantilla_id) {
          const plantilla = plantillasDb.value.find(p => p.id === encuesta.plantilla_id);
          if (plantilla) {
            encuesta.preguntas = plantilla.preguntas;
          }
        }
        resolve(encuesta);
      } else {
        reject(new Error('Encuesta no encontrada'));
      }
    }, 300);
  });
};

// Alias
export const getSurveyById = getResultadosEncuestaById;

/**
 * Obtiene la encuesta activa actual
 */
export const getActiveSurvey = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuestaActiva = encuestasDb.value.find(e => e.estado === 'activa');
      if (encuestaActiva) {
        // Agregar preguntas de la plantilla
        if (encuestaActiva.plantilla_id) {
          const plantilla = plantillasDb.value.find(p => p.id === encuestaActiva.plantilla_id);
          if (plantilla) {
            encuestaActiva.preguntas = plantilla.preguntas;
          }
        }
        resolve(encuestaActiva);
      } else {
        reject(new Error('No hay encuesta activa'));
      }
    }, 300);
  });
};

/**
 * Obtiene todas las plantillas disponibles
 */
export const getPlantillas = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(plantillasDb.value);
    }, 200);
  });
};

/**
 * Obtiene una plantilla por ID
 */
export const getPlantillaDetails = async (plantillaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plantilla = plantillasDb.value.find(p => p.id === plantillaId);
      if (plantilla) {
        resolve(plantilla);
      } else {
        reject(new Error('Plantilla no encontrada'));
      }
    }, 200);
  });
};

/**
 * Crea una nueva encuesta
 */
export const addSurvey = async (nuevaEncuesta) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const encuestaConId = {
        ...nuevaEncuesta,
        id: `enc-${Date.now()}`,
        fecha_creacion: new Date().toISOString().split('T')[0],
        participacion: {
          total_empleados: 120,
          respuestas: 0,
          porcentaje: 0,
          por_departamento: {}
        },
        resultados: null
      };

      encuestasDb.value.push(encuestaConId);
      resolve(encuestaConId);
    }, 300);
  });
};

/**
 * Actualiza una encuesta existente
 */
export const updateSurvey = async (encuestaActualizada) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = encuestasDb.value.findIndex(e => e.id === encuestaActualizada.id);

      if (index === -1) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      encuestasDb.value[index] = {
        ...encuestasDb.value[index],
        ...encuestaActualizada,
        fecha_actualizacion: new Date().toISOString().split('T')[0]
      };

      resolve({
        success: true,
        encuesta: encuestasDb.value[index],
        message: 'Encuesta actualizada correctamente'
      });
    }, 500);
  });
};

/**
 * Elimina una encuesta
 */
export const deleteSurvey = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = encuestasDb.value.findIndex(e => e.id === encuestaId);
      if (index !== -1) {
        encuestasDb.value.splice(index, 1);
        resolve({ success: true, message: 'Encuesta eliminada correctamente' });
      } else {
        reject(new Error('Encuesta no encontrada'));
      }
    }, 300);
  });
};

/**
 * Envía respuestas a una encuesta
 */
export const addAnswer = async (encuestaId, respuestas) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);

      if (!encuesta) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      if (encuesta.estado !== 'activa') {
        reject(new Error('La encuesta no está activa'));
        return;
      }

      // Simular incremento de participantes
      encuesta.participacion.respuestas += 1;
      encuesta.participacion.porcentaje =
        (encuesta.participacion.respuestas / encuesta.participacion.total_empleados) * 100;

      resolve({
        success: true,
        message: 'Respuestas enviadas correctamente. ¡Gracias por tu participación!'
      });
    }, 300);
  });
};

/**
 * Obtiene estadísticas generales del sistema de encuestas
 */
export const getEstadisticasGenerales = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const stats = calcularEstadisticasActuales();
      resolve({
        ...estadisticasEncuestas,
        ...stats
      });
    }, 200);
  });
};

/**
 * Obtiene comentarios recientes de todas las encuestas
 */
export const getComentariosRecientes = async (limite = 10) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const comentarios = comentariosDb.value
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, limite);
      resolve(comentarios);
    }, 200);
  });
};

/**
 * Obtiene comentarios de una encuesta específica
 */
export const getComentariosPorEncuesta = async (encuestaId) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const comentarios = comentariosDb.value.filter(c => c.encuesta_id === encuestaId);
      resolve(comentarios);
    }, 200);
  });
};

/**
 * Obtiene acciones recomendadas basadas en resultados
 */
export const getAccionesRecomendadas = async (encuestaId = null) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let acciones = accionesDb.value;
      if (encuestaId) {
        acciones = acciones.filter(a => a.encuesta_id === encuestaId);
      }
      resolve(acciones.sort((a, b) => {
        const prioridades = { alta: 3, media: 2, baja: 1 };
        return prioridades[b.prioridad] - prioridades[a.prioridad];
      }));
    }, 200);
  });
};

/**
 * Obtiene estadísticas de participación por departamento
 */
export const getParticipacionPorDepartamento = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (encuesta && encuesta.participacion) {
        const participacion = Object.entries(encuesta.participacion.por_departamento).map(
          ([nombre, datos]) => ({
            departamento: nombre,
            ...datos
          })
        );
        resolve(participacion);
      } else {
        reject(new Error('Datos de participación no disponibles'));
      }
    }, 200);
  });
};

/**
 * Obtiene evolución temporal de scores
 */
export const getEvolucionScores = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(estadisticasEncuestas.evolucion_trimestral);
    }, 200);
  });
};

/**
 * Obtiene análisis por dimensiones
 */
export const getAnalisisDimensiones = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (encuesta && encuesta.resultados && encuesta.resultados.dimensiones) {
        const dimensiones = Object.entries(encuesta.resultados.dimensiones).map(
          ([nombre, score]) => ({
            dimension: nombre,
            score: score,
            color: score >= 4.0 ? 'green' : score >= 3.5 ? 'yellow' : 'red'
          })
        );
        resolve(dimensiones);
      } else {
        reject(new Error('Análisis de dimensiones no disponible'));
      }
    }, 200);
  });
};

/**
 * Duplica una encuesta existente
 */
export const duplicarEncuesta = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const original = encuestasDb.value.find(e => e.id === encuestaId);
      if (!original) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      const duplicada = {
        ...original,
        id: `enc-${Date.now()}`,
        titulo: `${original.titulo} (Copia)`,
        estado: 'borrador',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_inicio: null,
        fecha_fin: null,
        participacion: {
          total_empleados: 120,
          respuestas: 0,
          porcentaje: 0,
          por_departamento: {}
        },
        resultados: null
      };

      encuestasDb.value.push(duplicada);
      resolve(duplicada);
    }, 300);
  });
};

/**
 * Programa una encuesta para envío futuro
 */
export const programarEncuesta = async (encuestaId, fechaInicio, fechaFin) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (!encuesta) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      encuesta.estado = 'programada';
      encuesta.fecha_inicio = fechaInicio;
      encuesta.fecha_fin = fechaFin;

      resolve({
        success: true,
        message: 'Encuesta programada correctamente',
        encuesta
      });
    }, 300);
  });
};

/**
 * Activa una encuesta programada
 */
export const activarEncuesta = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (!encuesta) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      encuesta.estado = 'activa';
      if (!encuesta.fecha_inicio) {
        encuesta.fecha_inicio = new Date().toISOString().split('T')[0];
      }

      resolve({
        success: true,
        message: 'Encuesta activada correctamente',
        encuesta
      });
    }, 300);
  });
};

/**
 * Finaliza una encuesta activa
 */
export const finalizarEncuesta = async (encuestaId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const encuesta = encuestasDb.value.find(e => e.id === encuestaId);
      if (!encuesta) {
        reject(new Error('Encuesta no encontrada'));
        return;
      }

      encuesta.estado = 'completada';
      encuesta.fecha_fin = new Date().toISOString().split('T')[0];

      resolve({
        success: true,
        message: 'Encuesta finalizada correctamente',
        encuesta
      });
    }, 300);
  });
};

// Exportar datos adicionales para uso directo
export { plantillasEncuestas, estadisticasEncuestas, comentariosRecientes, accionesRecomendadas };
