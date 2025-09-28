// /src/services/mock/scheduling.service.js

import { ref } from 'vue';

// Database simulation for scheduled surveys
const scheduledSurveys = ref([]);
const scheduleHistory = ref([]);

/**
 * Creates a new recurring survey schedule
 */
export const createRecurringSchedule = async (surveyData, scheduleConfig) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const schedule = {
        id: `schedule-${Date.now()}`,
        surveyId: surveyData.id || `survey-${Date.now()}`,
        surveyTitle: surveyData.titulo,
        ...scheduleConfig,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'admin@demo.com', // In real app, get from auth
        nextSendDate: calculateNextSendDate(scheduleConfig),
        totalSent: 0,
        lastSentDate: null
      };

      scheduledSurveys.value.push(schedule);
      
      console.log('Recurring schedule created:', schedule);
      resolve({
        success: true,
        schedule,
        message: 'Programación recurrente creada exitosamente'
      });
    }, 500);
  });
};

/**
 * Gets all scheduled surveys
 */
export const getScheduledSurveys = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...scheduledSurveys.value]);
    }, 300);
  });
};

/**
 * Updates an existing schedule
 */
export const updateSchedule = async (scheduleId, updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const scheduleIndex = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
      
      if (scheduleIndex === -1) {
        reject(new Error('Schedule not found'));
        return;
      }

      scheduledSurveys.value[scheduleIndex] = {
        ...scheduledSurveys.value[scheduleIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      resolve({
        success: true,
        schedule: scheduledSurveys.value[scheduleIndex]
      });
    }, 400);
  });
};

/**
 * Cancels a recurring schedule
 */
export const cancelSchedule = async (scheduleId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const scheduleIndex = scheduledSurveys.value.findIndex(s => s.id === scheduleId);
      
      if (scheduleIndex === -1) {
        reject(new Error('Schedule not found'));
        return;
      }

      scheduledSurveys.value[scheduleIndex].status = 'cancelled';
      scheduledSurveys.value[scheduleIndex].cancelledAt = new Date().toISOString();

      resolve({
        success: true,
        message: 'Programación cancelada exitosamente'
      });
    }, 300);
  });
};

/**
 * Gets schedule history and statistics
 */
export const getScheduleHistory = async (scheduleId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const history = scheduleHistory.value.filter(h => h.scheduleId === scheduleId);
      resolve(history);
    }, 200);
  });
};

/**
 * Simulates the execution of scheduled surveys
 */
export const executeScheduledSurvey = async (scheduleId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const schedule = scheduledSurveys.value.find(s => s.id === scheduleId);
      
      if (!schedule) {
        reject(new Error('Schedule not found'));
        return;
      }

      if (schedule.status !== 'active') {
        reject(new Error('Schedule is not active'));
        return;
      }

      // Update schedule
      schedule.totalSent += 1;
      schedule.lastSentDate = new Date().toISOString();
      schedule.nextSendDate = calculateNextSendDate(schedule);

      // Add to history
      const historyEntry = {
        id: `history-${Date.now()}`,
        scheduleId,
        surveyTitle: schedule.surveyTitle,
        sentDate: new Date().toISOString(),
        recipientCount: 50, // Mock recipient count
        status: 'sent'
      };

      scheduleHistory.value.push(historyEntry);

      console.log('Scheduled survey executed:', historyEntry);
      resolve({
        success: true,
        historyEntry,
        nextSendDate: schedule.nextSendDate
      });
    }, 600);
  });
};

/**
 * Calculates the next send date based on schedule configuration
 */
const calculateNextSendDate = (config) => {
  if (!config.startDate) return null;

  const now = new Date();
  let nextDate = new Date(config.startDate);

  // If start date is in the past, calculate next occurrence
  if (nextDate <= now) {
    switch (config.frequency) {
      case 'daily':
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;
      case 'weekly':
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        break;
      case 'biweekly':
        while (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 14);
        }
        break;
      case 'monthly':
        while (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        break;
      case 'quarterly':
        while (nextDate <= now) {
          nextDate.setMonth(nextDate.getMonth() + 3);
        }
        break;
      case 'yearly':
        while (nextDate <= now) {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        break;
      case 'custom':
        const interval = parseInt(config.customInterval);
        while (nextDate <= now) {
          if (config.customUnit === 'days') {
            nextDate.setDate(nextDate.getDate() + interval);
          } else if (config.customUnit === 'weeks') {
            nextDate.setDate(nextDate.getDate() + (interval * 7));
          } else if (config.customUnit === 'months') {
            nextDate.setMonth(nextDate.getMonth() + interval);
          }
        }
        break;
    }
  }

  // Set the time
  if (config.sendTime) {
    const [hours, minutes] = config.sendTime.split(':');
    nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  }

  return nextDate.toISOString();
};

/**
 * Validates schedule configuration
 */
export const validateScheduleConfig = (config) => {
  const errors = [];

  if (!config.frequency) {
    errors.push('Frecuencia es requerida');
  }

  if (!config.startDate) {
    errors.push('Fecha de inicio es requerida');
  }

  if (!config.sendTime) {
    errors.push('Hora de envío es requerida');
  }

  if (!config.activeDuration) {
    errors.push('Duración activa es requerida');
  }

  // Frequency-specific validations
  if (['weekly', 'biweekly'].includes(config.frequency) && config.daysOfWeek.length === 0) {
    errors.push('Selecciona al menos un día de la semana');
  }

  if (['monthly', 'quarterly', 'yearly'].includes(config.frequency) && !config.dayOfMonth) {
    errors.push('Selecciona un día del mes');
  }

  if (config.frequency === 'custom') {
    if (!config.customInterval || config.customInterval < 1) {
      errors.push('Intervalo personalizado debe ser mayor a 0');
    }
    if (!config.customUnit) {
      errors.push('Unidad de intervalo es requerida');
    }
  }

  if (config.startDate && config.endDate) {
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    if (end <= start) {
      errors.push('Fecha de finalización debe ser posterior a la fecha de inicio');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets upcoming scheduled sends for dashboard
 */
export const getUpcomingScheduledSends = async (limit = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const upcoming = scheduledSurveys.value
        .filter(s => s.status === 'active' && s.nextSendDate)
        .sort((a, b) => new Date(a.nextSendDate) - new Date(b.nextSendDate))
        .slice(0, limit)
        .map(s => ({
          id: s.id,
          surveyTitle: s.surveyTitle,
          nextSendDate: s.nextSendDate,
          frequency: s.frequency,
          recipientCount: 50 // Mock count
        }));

      resolve(upcoming);
    }, 200);
  });
};

/**
 * Resets all schedules (useful for demo)
 */
export const resetSchedules = () => {
  scheduledSurveys.value = [];
  scheduleHistory.value = [];
  console.log('All schedules reset');
  return { success: true };
};

// Export schedule status constants
export const SCHEDULE_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Export frequency constants
export const FREQUENCY_OPTIONS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};