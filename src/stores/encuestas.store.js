import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getActiveSurvey } from '@/services/mock/encuestas.service';

export const useEncuestasStore = defineStore('encuestas', () => {
  const encuestaActiva = ref(null);
  const encuestas = ref([]);
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
          totalRespuestas: 45,
          totalEmpleados: 120,
          preguntas: 3
        },
        {
          id: 2,
          titulo: 'Evaluación de Clima Laboral',
          descripcion: 'Evaluación mensual del ambiente de trabajo',
          fechaCreacion: '2024-01-10',
          estado: 'finalizada',
          totalRespuestas: 98,
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
          totalEmpleados: 120,
          preguntas: 5
        }
      ];
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      encuestas.value = encuestasData;
    } catch (err) {
      error.value = err.message || 'Error al cargar las encuestas';
      console.error('Error cargando encuestas:', err);
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
    encuestas,
    loading,
    error,
    cargarEncuestaActiva,
    cargarEncuestas,
    enviarRespuestas
  };
});