// /src/stores/scheduling.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSchedulingStore = defineStore('scheduling', () => {
  const scheduledSurveys = ref([]);
  const upcomingSchedules = ref([]);
  const scheduleHistory = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Validación local de configuración de programación
  const validateScheduleConfig = (config) => {
    const errors = [];
    if (!config) {
      errors.push('Configuración requerida');
      return { isValid: false, errors };
    }
    if (!config.frecuencia) errors.push('Frecuencia requerida');
    if (!config.fechaInicio) errors.push('Fecha de inicio requerida');
    return { isValid: errors.length === 0, errors };
  };

  const createSchedule = async (surveyData, scheduleConfig) => {
    loading.value = true;
    error.value = null;

    try {
      const validation = validateScheduleConfig(scheduleConfig);
      if (!validation.isValid) {
        throw new Error(`Configuración inválida: ${validation.errors.join(', ')}`);
      }

      // Funcionalidad de programación pendiente de implementación en backend
      const schedule = {
        id: crypto.randomUUID(),
        surveyId: surveyData.id,
        config: scheduleConfig,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      scheduledSurveys.value.push(schedule);
      return { success: true, schedule };
    } catch (err) {
      error.value = err.message || 'Error al crear la programación';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loadScheduledSurveys = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Sin tabla de scheduling aún — retorna estado local
      scheduledSurveys.value = scheduledSurveys.value || [];
    } catch (err) {
      error.value = err.message || 'Error al cargar las programaciones';
    } finally {
      loading.value = false;
    }
  };

  const loadUpcomingSchedules = async (limit = 5) => {
    loading.value = true;
    error.value = null;

    try {
      upcomingSchedules.value = [];
    } catch (err) {
      error.value = err.message || 'Error al cargar próximos envíos';
    } finally {
      loading.value = false;
    }
  };

  const updateScheduleConfig = async (scheduleId, updates) => {
    loading.value = true;
    error.value = null;

    try {
      const index = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
      if (index !== -1) {
        scheduledSurveys.value[index] = { ...scheduledSurveys.value[index], ...updates };
        return { success: true, schedule: scheduledSurveys.value[index] };
      }
      throw new Error('Programación no encontrada');
    } catch (err) {
      error.value = err.message || 'Error al actualizar la programación';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelScheduleById = async (scheduleId) => {
    loading.value = true;
    error.value = null;

    try {
      const index = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
      if (index !== -1) {
        scheduledSurveys.value[index].status = 'cancelled';
        return { success: true };
      }
      throw new Error('Programación no encontrada');
    } catch (err) {
      error.value = err.message || 'Error al cancelar la programación';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loadScheduleHistory = async () => {
    loading.value = true;
    error.value = null;

    try {
      scheduleHistory.value = [];
    } catch (err) {
      error.value = err.message || 'Error al cargar el historial';
    } finally {
      loading.value = false;
    }
  };

  return {
    scheduledSurveys,
    upcomingSchedules,
    scheduleHistory,
    loading,
    error,
    createSchedule,
    loadScheduledSurveys,
    loadUpcomingSchedules,
    updateScheduleConfig,
    cancelScheduleById,
    loadScheduleHistory
  };
});
