import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getActiveSurvey } from '@/services/mock/encuestas.service';

export const useEncuestasStore = defineStore('encuestas', () => {
  const encuestaActiva = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const cargarEncuestaActiva = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const encuesta = await getActiveSurvey();
      encuestaActiva.value = encuesta;
    } catch (err) {
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta:', err);
    } finally {
      loading.value = false;
    }
  };

  const enviarRespuestas = async (respuestas) => {
    loading.value = true;
    
    try {
      // Simular envío de respuestas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Respuestas enviadas:', respuestas);
      return { success: true, message: 'Respuestas enviadas correctamente' };
    } catch (err) {
      error.value = err.message || 'Error al enviar respuestas';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    encuestaActiva,
    loading,
    error,
    cargarEncuestaActiva,
    enviarRespuestas
  };
});