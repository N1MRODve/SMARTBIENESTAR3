// src/stores/comunicados.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getComunicados, addComunicado } from '@/services/mock/comunicados.service';

export const useComunicadosStore = defineStore('comunicados', () => {
  const comunicados = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const cargarComunicados = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const comunicadosData = await getComunicados();
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
      const response = await addComunicado(datosComunicado);
      
      if (response.success) {
        // Añadir el nuevo comunicado al principio de la lista
        comunicados.value.unshift(response.comunicado);
        console.log('Comunicado creado exitosamente:', response.comunicado);
        return { success: true, comunicado: response.comunicado };
      }
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