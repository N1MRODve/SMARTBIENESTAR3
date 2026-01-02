import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { comunicadosService } from '@/services/comunicados.service';

export const useComunicadosStore = defineStore('comunicados', () => {
  // Estado
  const comunicados = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // ==========================================
  // COMPUTED: Conteo de no leídos (FUENTE ÚNICA DE VERDAD)
  // ==========================================
  const conteoNoLeidos = computed(() => {
    return comunicados.value.filter(c => !c.leido).length;
  });

  // ==========================================
  // ACCIONES
  // ==========================================

  /**
   * Cargar comunicados del empleado actual CON estado de lectura
   * Esta es la fuente única de verdad para el badge y la lista
   */
  const cargarComunicados = async () => {
    loading.value = true;
    error.value = null;

    try {
      // IMPORTANTE: Usar getMisComunicados que incluye el campo 'leido'
      const comunicadosData = await comunicadosService.getMisComunicados();
      comunicados.value = comunicadosData;
      console.log('[ComunicadosStore] Comunicados cargados:', comunicadosData.length, 'No leídos:', conteoNoLeidos.value);
    } catch (err) {
      error.value = err.message || 'Error al cargar los comunicados';
      console.error('[ComunicadosStore] Error cargando comunicados:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Marcar un comunicado como leído
   * 1. Actualiza en BD
   * 2. Actualiza estado local INMEDIATAMENTE
   * 3. El badge se actualiza automáticamente via computed
   */
  const marcarComoLeido = async (comunicadoId) => {
    // Buscar el comunicado
    const comunicado = comunicados.value.find(c => c.id === comunicadoId);

    // Si ya está leído, no hacer nada
    if (!comunicado || comunicado.leido) {
      return { success: true, yaLeido: true };
    }

    try {
      // 1. Marcar en BD
      await comunicadosService.marcarComoLeidoEmpleado(comunicadoId);

      // 2. Actualizar estado local INMEDIATAMENTE (optimistic update)
      comunicado.leido = true;

      console.log('[ComunicadosStore] Comunicado marcado como leído:', comunicadoId, 'No leídos restantes:', conteoNoLeidos.value);

      return { success: true };
    } catch (err) {
      console.error('[ComunicadosStore] Error marcando como leído:', err);
      // En caso de error, revertir el cambio optimista
      comunicado.leido = false;
      throw err;
    }
  };

  /**
   * Obtener un comunicado por ID (desde el estado local)
   */
  const getComunicadoById = (id) => {
    return comunicados.value.find(c => c.id === id) || null;
  };

  /**
   * Refrescar comunicados (útil después de acciones que modifiquen el estado)
   */
  const refrescarComunicados = async () => {
    await cargarComunicados();
  };

  // Crear comunicado (para admin)
  const crearComunicado = async (datosComunicado) => {
    loading.value = true;
    error.value = null;

    try {
      const nuevoComunicado = await comunicadosService.create(datosComunicado);
      comunicados.value.unshift(nuevoComunicado);
      return { success: true, comunicado: nuevoComunicado };
    } catch (err) {
      error.value = err.message || 'Error al crear el comunicado';
      console.error('[ComunicadosStore] Error creando comunicado:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estado
    comunicados,
    loading,
    error,

    // Computed
    conteoNoLeidos,

    // Acciones
    cargarComunicados,
    marcarComoLeido,
    getComunicadoById,
    refrescarComunicados,
    crearComunicado
  };
});