// src/stores/recompensas.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getRecompensas, 
  canjearRecompensa, 
  getHistorialCanjes,
  getEstadisticasCanjes,
  getRecompensasPorCategoria 
} from '@/services/mock/recompensas.service';

export const useRecompensasStore = defineStore('recompensas', () => {
  const recompensas = ref([]);
  const historialCanjes = ref([]);
  const estadisticas = ref({});
  const loading = ref(false);
  const error = ref(null);

  const cargarRecompensas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const recompensasData = await getRecompensas();
      recompensas.value = recompensasData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las recompensas';
      console.error('Error cargando recompensas:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarRecompensasPorCategoria = async (categoria) => {
    loading.value = true;
    error.value = null;
    
    try {
      const recompensasData = await getRecompensasPorCategoria(categoria);
      recompensas.value = recompensasData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las recompensas';
      console.error('Error cargando recompensas por categoría:', err);
    } finally {
      loading.value = false;
    }
  };

  const realizarCanje = async (usuarioId, recompensaId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const resultado = await canjearRecompensa(usuarioId, recompensaId);
      
      if (resultado.success) {
        // Añadir al historial local
        if (historialCanjes.value) {
          historialCanjes.value.unshift(resultado.canje);
        }
        
        console.log('Canje realizado exitosamente:', resultado);
        return resultado;
      }
    } catch (err) {
      error.value = err.message || 'Error al realizar el canje';
      console.error('Error realizando canje:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cargarHistorial = async (usuarioId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const historialData = await getHistorialCanjes(usuarioId);
      historialCanjes.value = historialData;
    } catch (err) {
      error.value = err.message || 'Error al cargar el historial';
      console.error('Error cargando historial:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarEstadisticas = async (usuarioId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const estadisticasData = await getEstadisticasCanjes(usuarioId);
      estadisticas.value = estadisticasData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las estadísticas';
      console.error('Error cargando estadísticas:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    recompensas,
    historialCanjes,
    estadisticas,
    loading,
    error,
    cargarRecompensas,
    cargarRecompensasPorCategoria,
    realizarCanje,
    cargarHistorial,
    cargarEstadisticas
  };
});