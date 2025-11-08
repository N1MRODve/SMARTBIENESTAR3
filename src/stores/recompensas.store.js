import { defineStore } from 'pinia';
import { ref } from 'vue';
import { recompensasService } from '@/services/recompensas.service';

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
      const recompensasData = await recompensasService.getAll();
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
      const recompensasData = await recompensasService.getByCategoria(categoria);
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
      const resultado = await recompensasService.canjear(usuarioId, recompensaId);

      if (historialCanjes.value) {
        historialCanjes.value.unshift(resultado);
      }

      return { success: true, canje: resultado };
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
      const historialData = await recompensasService.getHistorialCanjes(usuarioId);
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
      // TODO: Implementar servicio de estadísticas
      estadisticas.value = {};
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
      const resultado = await recompensasService.create(nuevaRecompensa);
      recompensas.value.push(resultado);
      return { success: true, recompensa: resultado };
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
      const resultado = await recompensasService.update(
        recompensaActualizada.id,
        recompensaActualizada
      );

      const index = recompensas.value.findIndex(r => r.id === recompensaActualizada.id);
      if (index !== -1) {
        recompensas.value[index] = resultado;
      }

      return { success: true, recompensa: resultado };
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
      await recompensasService.delete(recompensaId);

      const index = recompensas.value.findIndex(r => r.id === recompensaId);
      if (index !== -1) {
        recompensas.value.splice(index, 1);
      }

      return { success: true };
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
