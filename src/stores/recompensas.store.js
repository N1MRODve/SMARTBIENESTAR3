// src/stores/recompensas.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getRecompensas, 
  canjearRecompensa, 
  getHistorialCanjes,
  getEstadisticasCanjes,
  getRecompensasPorCategoria,
  addRecompensa,
  updateRecompensa,
  deleteRecompensa
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

  const crearRecompensa = async (nuevaRecompensa) => {
    loading.value = true;
    error.value = null;
    
    try {
      const resultado = await addRecompensa(nuevaRecompensa);
      
      if (resultado.success) {
        // Añadir la nueva recompensa al estado local
        recompensas.value.push(resultado.recompensa);
        
        console.log('Recompensa creada exitosamente:', resultado.recompensa);
        console.log('Estado local actualizado, total recompensas:', recompensas.value.length);
        return resultado;
      }
    } catch (err) {
      error.value = err.message || 'Error al crear la recompensa';
      console.error('Error creando recompensa:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const actualizarRecompensa = async (recompensaActualizada) => {
    loading.value = true;
    error.value = null;
    
    try {
      const resultado = await updateRecompensa(recompensaActualizada);
      
      if (resultado.success) {
        // Actualizar la recompensa en el estado local
        const index = recompensas.value.findIndex(r => r.id === recompensaActualizada.id);
        if (index !== -1) {
          recompensas.value[index] = resultado.recompensa;
        }
        
        console.log('Recompensa actualizada exitosamente:', resultado.recompensa);
        return resultado;
      }
    } catch (err) {
      error.value = err.message || 'Error al actualizar la recompensa';
      console.error('Error actualizando recompensa:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const eliminarRecompensa = async (recompensaId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const resultado = await deleteRecompensa(recompensaId);
      
      if (resultado.success) {
        // Eliminar la recompensa del estado local
        const index = recompensas.value.findIndex(r => r.id === recompensaId);
        if (index !== -1) {
          recompensas.value.splice(index, 1);
        }
        
        console.log('Recompensa eliminada exitosamente');
        return resultado;
      }
    } catch (err) {
      error.value = err.message || 'Error al eliminar la recompensa';
      console.error('Error eliminando recompensa:', err);
      throw err;
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
    cargarEstadisticas,
    crearRecompensa,
    actualizarRecompensa,
    eliminarRecompensa
  };
});