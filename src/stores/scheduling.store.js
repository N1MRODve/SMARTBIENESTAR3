// /src/stores/scheduling.store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
// TODO: Implement real scheduling service with Supabase
// import {
//   createRecurringSchedule,
//   getScheduledSurveys,
//   updateSchedule,
//   cancelSchedule,
//   getScheduleHistory,
//   getUpcomingScheduledSends,
//   validateScheduleConfig
// } from '@/services/scheduling.service';

export const useSchedulingStore = defineStore('scheduling', () => {
  const scheduledSurveys = ref([]);
  const upcomingSchedules = ref([]);
  const scheduleHistory = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const createSchedule = async (surveyData, scheduleConfig) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Validate configuration first
      const validation = validateScheduleConfig(scheduleConfig);
      if (!validation.isValid) {
        throw new Error(`Configuración inválida: ${validation.errors.join(', ')}`);
      }

      const response = await createRecurringSchedule(surveyData, scheduleConfig);
      
      if (response.success) {
        // Add to local state
        scheduledSurveys.value.push(response.schedule);
        
        console.log('Schedule created successfully:', response.schedule);
        return response;
      }
    } catch (err) {
      error.value = err.message || 'Error al crear la programación';
      console.error('Error creating schedule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loadScheduledSurveys = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const surveys = await getScheduledSurveys();
      scheduledSurveys.value = surveys;
    } catch (err) {
      error.value = err.message || 'Error al cargar las programaciones';
      console.error('Error loading scheduled surveys:', err);
    } finally {
      loading.value = false;
    }
  };

  const loadUpcomingSchedules = async (limit = 5) => {
    loading.value = true;
    error.value = null;
    
    try {
      const upcoming = await getUpcomingScheduledSends(limit);
      upcomingSchedules.value = upcoming;
    } catch (err) {
      error.value = err.message || 'Error al cargar próximos envíos';
      console.error('Error loading upcoming schedules:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateScheduleConfig = async (scheduleId, updates) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateSchedule(scheduleId, updates);
      
      if (response.success) {
        // Update local state
        const index = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
        if (index !== -1) {
          scheduledSurveys.value[index] = response.schedule;
        }
        
        console.log('Schedule updated successfully');
        return response;
      }
    } catch (err) {
      error.value = err.message || 'Error al actualizar la programación';
      console.error('Error updating schedule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const cancelScheduleById = async (scheduleId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await cancelSchedule(scheduleId);
      
      if (response.success) {
        // Update local state
        const index = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
        if (index !== -1) {
          scheduledSurveys.value[index].status = 'cancelled';
        }
        
        console.log('Schedule cancelled successfully');
        return response;
      }
    } catch (err) {
      error.value = err.message || 'Error al cancelar la programación';
      console.error('Error cancelling schedule:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loadScheduleHistory = async (scheduleId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const history = await getScheduleHistory(scheduleId);
      scheduleHistory.value = history;
    } catch (err) {
      error.value = err.message || 'Error al cargar el historial';
      console.error('Error loading schedule history:', err);
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