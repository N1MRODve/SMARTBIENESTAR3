import { defineStore } from 'pinia';
import { ref } from 'vue';
import { recompensasService } from '@/services/recompensas.service';
import { useAuthStore } from '@/stores/auth.store';

export const useRecompensasStore = defineStore('recompensas', () => {
  const recompensas = ref([]);
  const historialCanjes = ref([]);
  const estadisticas = ref({});
  const loading = ref(false);
  const error = ref(null);

  /**
   * Obtiene el empresaId del auth store
   */
  const getEmpresaId = () => {
    const authStore = useAuthStore();
    return authStore.empresaId;
  };

  const cargarRecompensas = async () => {
    loading.value = true;
    error.value = null;

    try {
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const recompensasData = await recompensasService.getAll(empresaId);
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
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const recompensasData = await recompensasService.getByCategoria(empresaId, categoria);
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
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const resultado = await recompensasService.canjear(usuarioId, recompensaId, empresaId);

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

  const cargarHistorial = async (usuarioId = null) => {
    loading.value = true;
    error.value = null;

    try {
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const historialData = await recompensasService.getHistorialCanjes(empresaId, usuarioId);
      historialCanjes.value = historialData;
    } catch (err) {
      error.value = err.message || 'Error al cargar el historial';
      console.error('Error cargando historial:', err);
    } finally {
      loading.value = false;
    }
  };

  const cargarEstadisticas = async () => {
    loading.value = true;
    error.value = null;

    try {
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const stats = await recompensasService.getStats(empresaId);
      estadisticas.value = stats;
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
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      // Asegurar que la recompensa tenga empresa_id
      const recompensaConEmpresa = {
        ...nuevaRecompensa,
        empresa_id: empresaId
      };

      const resultado = await recompensasService.create(recompensaConEmpresa);
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
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const resultado = await recompensasService.update(
        recompensaActualizada.id,
        recompensaActualizada,
        empresaId
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
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      await recompensasService.delete(recompensaId, empresaId);

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

  const updateEstadoCanje = async (canjeId, estado, notas = null) => {
    loading.value = true;
    error.value = null;

    try {
      const empresaId = getEmpresaId();
      if (!empresaId) {
        throw new Error('No se encontró empresaId');
      }

      const resultado = await recompensasService.updateEstadoCanje(canjeId, estado, empresaId, notas);

      // Actualizar en el historial local
      const index = historialCanjes.value.findIndex(c => c.id === canjeId);
      if (index !== -1) {
        historialCanjes.value[index] = { ...historialCanjes.value[index], ...resultado };
      }

      return { success: true, canje: resultado };
    } catch (err) {
      error.value = err.message || 'Error al actualizar el canje';
      console.error('Error actualizando canje:', err);
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
    eliminarRecompensa,
    updateEstadoCanje
  };
});
