import { defineStore } from 'pinia';
import { ref } from 'vue';
import { encuestasService } from '@/services/encuestas.service';

export const useEncuestasStore = defineStore('encuestas', () => {
  const activeSurvey = ref(null);
  const encuestaActiva = ref(null);
  const encuestas = ref([]);
  const surveys = ref([]);
  const selectedSurvey = ref(null);
  const previousSurvey = ref(null);
  const isLoading = ref(false);
  const loading = ref(false);
  const error = ref(null);

  const fetchAllSurveys = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const allSurveys = await encuestasService.getAll();
      surveys.value = allSurveys;
      encuestas.value = allSurveys;
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchActiveSurvey = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const encuesta = await encuestasService.getActive();
      activeSurvey.value = encuesta;
      encuestaActiva.value = encuesta;
    } catch (err) {
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const submitSurveyAnswers = async (encuestaId, respuestas) => {
    isLoading.value = true;

    try {
      const result = await encuestasService.submitRespuesta(encuestaId, respuestas);
      return { success: true, message: result.message || 'Respuestas enviadas correctamente' };
    } catch (err) {
      error.value = err.message || 'Error al enviar respuestas';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const cargarEncuestaActiva = async () => {
    await fetchActiveSurvey();
  };

  const cargarEncuestas = async () => {
    loading.value = true;
    error.value = null;

    try {
      await fetchAllSurveys();
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
    } finally {
      loading.value = false;
    }
  };

  const crearEncuesta = async (datosEncuesta) => {
    loading.value = true;
    error.value = null;

    try {
      const nuevaEncuesta = await encuestasService.create(datosEncuesta);

      encuestas.value.unshift(nuevaEncuesta);
      surveys.value.unshift(nuevaEncuesta);

      return { success: true, encuesta: nuevaEncuesta };
    } catch (err) {
      error.value = err.message || 'Error al crear la encuesta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createNewSurvey = async (nuevaEncuestaData) => {
    return await crearEncuesta(nuevaEncuestaData);
  };

  const fetchSurveyById = async (id) => {
    isLoading.value = true;
    error.value = null;

    try {
      const survey = await encuestasService.getById(id);
      selectedSurvey.value = survey;

      // Intentar cargar encuesta anterior para comparación
      const allSurveys = await encuestasService.getAll();
      const currentIndex = allSurveys.findIndex(s => s.id === id);
      if (currentIndex > 0) {
        previousSurvey.value = allSurveys[currentIndex - 1];
      } else {
        previousSurvey.value = null;
      }
    } catch (err) {
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta por ID:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    activeSurvey,
    isLoading,
    surveys,
    selectedSurvey,
    previousSurvey,
    fetchActiveSurvey,
    fetchAllSurveys,
    fetchSurveyById,
    submitSurveyAnswers,
    encuestaActiva,
    encuestas,
    loading,
    error,
    cargarEncuestaActiva,
    cargarEncuestas,
    crearEncuesta,
    createNewSurvey
  };
});
