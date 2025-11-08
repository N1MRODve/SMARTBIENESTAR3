import { defineStore } from 'pinia';
import { ref } from 'vue';
import { comunicadosService } from '@/services/comunicados.service';

export const useComunicadosStore = defineStore('comunicados', () => {
  const comunicados = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const cargarComunicados = async () => {
    loading.value = true;
    error.value = null;

    try {
      const comunicadosData = await comunicadosService.getAll();
      comunicados.value = comunicadosData;
    } catch (err) {
      error.value = err.message || 'Error al cargar los comunicados';
      console.error('Error cargando comunicados:', err);
    } finally {
      loading.value = false;
    }
  };

  const crearComunicado = async (datosComunicado) => {
    loading.value = true;
    error.value = null;

    try {
      const nuevoComunicado = await comunicadosService.create(datosComunicado);
      comunicados.value.unshift(nuevoComunicado);
      return { success: true, comunicado: nuevoComunicado };
    } catch (err) {
      error.value = err.message || 'Error al crear el comunicado';
      console.error('Error creando comunicado:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    comunicados,
    loading,
    error,
    cargarComunicados,
    crearComunicado
  };
});