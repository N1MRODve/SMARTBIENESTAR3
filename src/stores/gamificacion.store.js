import { defineStore } from 'pinia';
import { ref } from 'vue';
import { gamificacionService, PUNTOS_ACTIVIDADES } from '@/services/gamificacion.service';

export { PUNTOS_ACTIVIDADES };

export const useGamificacionStore = defineStore('gamificacion', () => {
  const puntosUsuario = ref(0);
  const historial = ref([]);
  const ranking = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /**
   * Carga los puntos del empleado.
   * @param {string} id - Puede ser empleado.id o auth_user_id
   * @param {boolean} isAuthUserId - Si true, busca por auth_user_id (default: true para compatibilidad)
   */
  const cargarPuntos = async (id, isAuthUserId = true) => {
    if (!id) {
      console.warn('cargarPuntos: id no proporcionado');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log('[cargarPuntos] Cargando puntos para:', id, 'isAuthUserId:', isAuthUserId);
      const puntos = await gamificacionService.getPuntos(id, isAuthUserId);
      puntosUsuario.value = puntos;
      console.log('[cargarPuntos] Puntos cargados:', puntos);
    } catch (err) {
      // Error 406 ocurre cuando no hay resultados o problemas de RLS
      // Mantener puntos en 0 sin bloquear la UI
      if (err?.code === 'PGRST116' || err?.message?.includes('406')) {
        puntosUsuario.value = 0;
        console.warn('No se encontraron puntos para el empleado, usando 0');
      } else {
        error.value = err.message || 'Error al cargar los puntos';
        console.error('Error cargando puntos:', err);
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * Carga los puntos usando empleado.id (para cuando ya tienes el ID del empleado)
   */
  const cargarPuntosPorEmpleadoId = async (empleadoId) => {
    return cargarPuntos(empleadoId, false);
  };

  const otorgarPuntos = async (empleadoId, cantidad, motivo, referenciaId = null, referenciaTipo = 'manual') => {
    if (!empleadoId) {
      console.warn('otorgarPuntos: empleadoId no proporcionado');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const resultado = await gamificacionService.addPuntos(
        empleadoId,
        cantidad,
        motivo,
        referenciaId,
        referenciaTipo
      );

      if (resultado.success) {
        puntosUsuario.value = resultado.puntosTotal;

        // Añadir al historial local
        if (historial.value && resultado.transaccion) {
          historial.value.unshift(resultado.transaccion);
        }

        console.log(`¡Puntos otorgados! +${cantidad} por: ${motivo}`);
        return resultado;
      }
    } catch (err) {
      error.value = err.message || 'Error al otorgar puntos';
      console.error('Error otorgando puntos:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cargarHistorial = async (empleadoId) => {
    if (!empleadoId) {
      console.warn('cargarHistorial: empleadoId no proporcionado');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const historialData = await gamificacionService.getHistorial(empleadoId);
      historial.value = historialData;
    } catch (err) {
      error.value = err.message || 'Error al cargar el historial';
      console.error('Error cargando historial:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarRanking = async () => {
    loading.value = true;
    error.value = null;

    try {
      const rankingData = await gamificacionService.getRanking();
      ranking.value = rankingData;
    } catch (err) {
      error.value = err.message || 'Error al cargar el ranking';
      console.error('Error cargando ranking:', err);
    } finally {
      loading.value = false;
    }
  };

  // Funciones de conveniencia para actividades específicas
  const otorgarPuntosEncuesta = async (empleadoId, encuestaId) => {
    return await gamificacionService.otorgarPuntosEncuesta(empleadoId, encuestaId);
  };

  const otorgarPuntosReserva = async (empleadoId, sesionId, nombreSesion) => {
    return await gamificacionService.otorgarPuntosReserva(empleadoId, sesionId, nombreSesion);
  };

  const otorgarPuntosAsistencia = async (empleadoId, sesionId, nombreSesion) => {
    return await gamificacionService.otorgarPuntosAsistencia(empleadoId, sesionId, nombreSesion);
  };

  // Reset del store
  const reset = () => {
    puntosUsuario.value = 0;
    historial.value = [];
    ranking.value = [];
    error.value = null;
  };

  return {
    puntosUsuario,
    historial,
    ranking,
    loading,
    error,
    cargarPuntos,
    cargarPuntosPorEmpleadoId,
    otorgarPuntos,
    cargarHistorial,
    cargarRanking,
    otorgarPuntosEncuesta,
    otorgarPuntosReserva,
    otorgarPuntosAsistencia,
    reset
  };
});
