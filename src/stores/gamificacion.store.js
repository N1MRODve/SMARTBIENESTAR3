// src/stores/gamificacion.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getPuntos, 
  addPuntos, 
  getHistorialPuntos, 
  getRankingPuntos,
  PUNTOS_ACTIVIDADES 
} from '@/services/mock/gamificacion.service';

export const useGamificacionStore = defineStore('gamificacion', () => {
  const puntosUsuario = ref(0);
  const historial = ref([]);
  const ranking = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const cargarPuntos = async (usuarioId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const puntos = await getPuntos(usuarioId);
      puntosUsuario.value = puntos;
    } catch (err) {
      error.value = err.message || 'Error al cargar los puntos';
      console.error('Error cargando puntos:', err);
    } finally {
      loading.value = false;
    }
  };

  const otorgarPuntos = async (usuarioId, cantidad, motivo) => {
    loading.value = true;
    error.value = null;
    
    try {
      const resultado = await addPuntos(usuarioId, cantidad, motivo);
      
      if (resultado.success) {
        puntosUsuario.value = resultado.puntosTotal;
        
        // Añadir al historial local
        if (historial.value) {
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

  const cargarHistorial = async (usuarioId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const historialData = await getHistorialPuntos(usuarioId);
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
      const rankingData = await getRankingPuntos();
      ranking.value = rankingData;
    } catch (err) {
      error.value = err.message || 'Error al cargar el ranking';
      console.error('Error cargando ranking:', err);
    } finally {
      loading.value = false;
    }
  };

  // Funciones de conveniencia para actividades específicas
  const otorgarPuntosEncuesta = async (usuarioId) => {
    return await otorgarPuntos(
      usuarioId, 
      PUNTOS_ACTIVIDADES.RESPONDER_ENCUESTA, 
      'Encuesta completada'
    );
  };

  const otorgarPuntosReserva = async (usuarioId, nombreSesion) => {
    return await otorgarPuntos(
      usuarioId, 
      PUNTOS_ACTIVIDADES.RESERVAR_SESION, 
      `Reserva en: ${nombreSesion}`
    );
  };

  const otorgarPuntosAsistencia = async (usuarioId, nombreSesion) => {
    return await otorgarPuntos(
      usuarioId, 
      PUNTOS_ACTIVIDADES.ASISTIR_SESION, 
      `Asistencia a: ${nombreSesion}`
    );
  };

  return {
    puntosUsuario,
    historial,
    ranking,
    loading,
    error,
    cargarPuntos,
    otorgarPuntos,
    cargarHistorial,
    cargarRanking,
    otorgarPuntosEncuesta,
    otorgarPuntosReserva,
    otorgarPuntosAsistencia
  };
});