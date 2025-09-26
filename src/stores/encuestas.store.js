import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getActiveSurvey, getSurveys, addAnswer, addSurvey, getSurveyById } from '@/services/mock/encuestas.service';

export const useEncuestasStore = defineStore('encuestas', () => {
  const activeSurvey = ref(null);
  const encuestaActiva = ref(null);
  const encuestas = ref([]);
  const surveys = ref([]);
  const selectedSurvey = ref(null);
  const isLoading = ref(false);
  const loading = ref(false);
  const error = ref(null);

  const fetchAllSurveys = async () => {
    console.log('Cargando todas las encuestas...');
    isLoading.value = true;
    error.value = null;
    
    try {
      const allSurveys = await getSurveys();
      surveys.value = allSurveys;
      console.log('Encuestas cargadas:', allSurveys);
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchActiveSurvey = async () => {
    console.log('2. Llamando a fetchActiveSurvey en el store...');
    isLoading.value = true;
    error.value = null;
    
    try {
      const encuesta = await getActiveSurvey();
      activeSurvey.value = encuesta;
      encuestaActiva.value = encuesta;
      console.log('2.1. Encuesta obtenida del mock service:', encuesta);
      console.log('2.2. activeSurvey.value actualizado:', activeSurvey.value);
    } catch (err) {
      console.error('2.3. Error en fetchActiveSurvey:', err);
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta:', err);
    } finally {
      isLoading.value = false;
      console.log('2.4. fetchActiveSurvey completado. isLoading:', isLoading.value);
    }
  };

  const submitSurveyAnswers = async (respuestas) => {
    isLoading.value = true;
    
    try {
      // Enviar respuestas usando el mock service
      await addAnswer(activeSurvey.value.id, respuestas);
      
      console.log('Respuestas enviadas:', respuestas);
      return { success: true, message: 'Respuestas enviadas correctamente' };
    } catch (err) {
      error.value = err.message || 'Error al enviar respuestas';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const cargarEncuestaActiva = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const encuesta = await getActiveSurvey();
      activeSurvey.value = encuesta;
      encuestaActiva.value = encuesta;
    } catch (err) {
      error.value = err.message || 'Error al cargar la encuesta';
      console.error('Error cargando encuesta:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const cargarEncuestas = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Simular múltiples encuestas para el dashboard del admin
      const encuestasData = [
        {
          id: 1,
          titulo: 'Pulso de Bienestar Semanal',
          descripcion: 'Encuesta semanal sobre el bienestar de los empleados',
          fechaCreacion: '2024-01-15',
          estado: 'activa',
          totalRespuestas: 0,
          totalEmpleados: 120,
          preguntas: 3
        },
        {
          id: 2,
          titulo: 'Evaluación de Clima Laboral',
          descripcion: 'Evaluación mensual del ambiente de trabajo',
          fechaCreacion: '2024-01-10',
          estado: 'finalizada',
          totalRespuestas: 0,
          totalEmpleados: 120,
          preguntas: 8
        },
        {
          id: 3,
          titulo: 'Satisfacción con Beneficios',
          descripcion: 'Encuesta sobre los beneficios corporativos',
          fechaCreacion: '2024-01-05',
          estado: 'borrador',
          totalRespuestas: 0,
          preguntas: 5
        }
      ];
      
      encuestas.value = encuestasData;
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
      // Simular creación de encuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const nuevaEncuesta = {
        id: Date.now(),
        titulo: datosEncuesta.titulo,
        descripcion: datosEncuesta.descripcion || '',
        fechaCreacion: new Date().toISOString().split('T')[0],
        estado: datosEncuesta.estado || 'activa',
        totalRespuestas: 0,
        totalEmpleados: 120,
        preguntas: datosEncuesta.preguntas.length,
        preguntasDetalle: datosEncuesta.preguntas
      };
      
      // Agregar la nueva encuesta al estado
      encuestas.value.unshift(nuevaEncuesta);
      
      console.log('Nueva encuesta creada:', nuevaEncuesta);
      return { success: true, encuesta: nuevaEncuesta };
    } catch (err) {
      error.value = err.message || 'Error al crear la encuesta';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createNewSurvey = async (nuevaEncuestaData) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Llamar al servicio mock para añadir la encuesta
      const response = await addSurvey(nuevaEncuestaData);
      
      if (response.success) {
        // Añadir la nueva encuesta al estado local
        surveys.value.unshift(response.encuesta);
        
        console.log('Encuesta creada exitosamente:', response.encuesta);
        return { success: true, encuesta: response.encuesta };
      }
    } catch (err) {
      error.value = err.message || 'Error al crear la encuesta';
      console.error('Error creando encuesta:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchSurveyById = async (id) => {
    console.log('Cargando encuesta por ID:', id);
    isLoading.value = true;
    error.value = null;
    
    try {
      const survey = await getSurveyById(id);
      selectedSurvey.value = survey;
      console.log('Encuesta cargada:', survey);
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