<template>
  <div class="space-y-6">
    <!-- Recurrence Toggle -->
    <div class="flex items-center space-x-3">
      <input
        id="enable-recurrence"
        v-model="isRecurring"
        type="checkbox"
        class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        @change="handleRecurrenceToggle"
      />
      <label for="enable-recurrence" class="text-sm font-medium text-gray-700">
        Programar envío automático recurrente
      </label>
    </div>

    <!-- Recurrence Configuration -->
    <div v-if="isRecurring" class="space-y-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="text-lg font-semibold text-blue-900 mb-4">Configuración de Recurrencia</h4>
      
      <!-- Pattern Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Frequency -->
        <div class="form-group">
          <label for="frequency" class="form-label">Frecuencia *</label>
          <select
            id="frequency"
            v-model="schedule.frequency"
            class="input"
            required
            @change="handleFrequencyChange"
          >
            <option value="">Selecciona frecuencia</option>
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quincenal</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        <!-- Custom Interval (only for custom frequency) -->
        <div v-if="schedule.frequency === 'custom'" class="form-group">
          <label for="custom-interval" class="form-label">Intervalo personalizado *</label>
          <div class="flex items-center space-x-2">
            <input
              id="custom-interval"
              v-model="schedule.customInterval"
              type="number"
              min="1"
              max="365"
              class="input flex-1"
              placeholder="Número"
              required
            />
            <select v-model="schedule.customUnit" class="input flex-1" required>
              <option value="days">Días</option>
              <option value="weeks">Semanas</option>
              <option value="months">Meses</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Day Selection (for weekly/biweekly) -->
      <div v-if="schedule.frequency === 'weekly' || schedule.frequency === 'biweekly'" class="form-group">
        <label class="form-label">Días de la semana *</label>
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="(day, index) in daysOfWeek" 
            :key="day.value"
            class="text-center"
          >
            <input
              :id="`day-${day.value}`"
              v-model="schedule.daysOfWeek"
              :value="day.value"
              type="checkbox"
              class="sr-only"
            />
            <label
              :for="`day-${day.value}`"
              :class="[
                'block w-full py-2 px-1 text-xs font-medium rounded-lg cursor-pointer transition-colors',
                schedule.daysOfWeek.includes(day.value)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ day.short }}
            </label>
          </div>
        </div>
      </div>

      <!-- Day of Month (for monthly/quarterly/yearly) -->
      <div v-if="['monthly', 'quarterly', 'yearly'].includes(schedule.frequency)" class="form-group">
        <label for="day-of-month" class="form-label">Día del mes *</label>
        <select
          id="day-of-month"
          v-model="schedule.dayOfMonth"
          class="input"
          required
        >
          <option value="">Selecciona día</option>
          <option v-for="day in 31" :key="day" :value="day">
            {{ day }}
          </option>
          <option value="last">Último día del mes</option>
        </select>
      </div>

      <!-- Time Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Send Time -->
        <div class="form-group">
          <label for="send-time" class="form-label">Hora de envío *</label>
          <input
            id="send-time"
            v-model="schedule.sendTime"
            type="time"
            class="input"
            required
          />
          <p class="mt-1 text-xs text-gray-500">
            Hora en la que se enviará la encuesta automáticamente
          </p>
        </div>

        <!-- Active Duration -->
        <div class="form-group">
          <label for="active-duration" class="form-label">Duración activa *</label>
          <select
            id="active-duration"
            v-model="schedule.activeDuration"
            class="input"
            required
          >
            <option value="">Selecciona duración</option>
            <option value="1">1 día</option>
            <option value="3">3 días</option>
            <option value="7">1 semana</option>
            <option value="14">2 semanas</option>
            <option value="30">1 mes</option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Tiempo que la encuesta estará disponible para responder
          </p>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Start Date -->
        <div class="form-group">
          <label for="start-date" class="form-label">Fecha de inicio *</label>
          <input
            id="start-date"
            v-model="schedule.startDate"
            type="date"
            class="input"
            :min="minDate"
            required
            @change="validateDateRange"
          />
        </div>

        <!-- End Date -->
        <div class="form-group">
          <label for="end-date" class="form-label">Fecha de finalización</label>
          <input
            id="end-date"
            v-model="schedule.endDate"
            type="date"
            class="input"
            :min="schedule.startDate || minDate"
            @change="validateDateRange"
          />
          <p class="mt-1 text-xs text-gray-500">
            Opcional. Deja vacío para recurrencia indefinida
          </p>
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="border-t border-blue-200 pt-6">
        <h5 class="text-md font-medium text-blue-900 mb-4">Opciones Avanzadas</h5>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Timezone -->
          <div class="form-group">
            <label for="timezone" class="form-label">Zona horaria</label>
            <select
              id="timezone"
              v-model="schedule.timezone"
              class="input"
            >
              <option value="Europe/Madrid">Madrid (UTC+1)</option>
              <option value="Europe/London">Londres (UTC+0)</option>
              <option value="America/New_York">Nueva York (UTC-5)</option>
              <option value="America/Los_Angeles">Los Ángeles (UTC-8)</option>
            </select>
          </div>

          <!-- Reminder Settings -->
          <div class="form-group">
            <label class="form-label">Recordatorios</label>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  id="reminder-email"
                  v-model="schedule.sendReminders"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label for="reminder-email" class="ml-2 text-sm text-gray-700">
                  Enviar recordatorio por email
                </label>
              </div>
              <div v-if="schedule.sendReminders" class="ml-6">
                <select v-model="schedule.reminderDays" class="input text-sm">
                  <option value="1">1 día antes</option>
                  <option value="2">2 días antes</option>
                  <option value="3">3 días antes</option>
                  <option value="7">1 semana antes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Preview -->
      <div v-if="schedulePreview" class="border-t border-blue-200 pt-6">
        <h5 class="text-md font-medium text-blue-900 mb-4">Vista Previa del Cronograma</h5>
        
        <!-- Summary -->
        <div class="bg-white border border-blue-300 rounded-lg p-4 mb-4">
          <div class="flex items-start">
            <Calendar class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p class="text-blue-900 font-medium">{{ schedulePreview.summary }}</p>
              <p class="text-blue-700 text-sm mt-1">{{ schedulePreview.details }}</p>
            </div>
          </div>
        </div>

        <!-- Next Send Dates -->
        <div v-if="nextSendDates.length > 0">
          <h6 class="text-sm font-medium text-blue-800 mb-3">Próximas fechas de envío:</h6>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div 
              v-for="(date, index) in nextSendDates.slice(0, 8)" 
              :key="index"
              class="bg-white border border-blue-200 rounded-lg p-2 text-center"
            >
              <p class="text-xs font-medium text-blue-900">
                {{ formatPreviewDate(date) }}
              </p>
              <p class="text-xs text-blue-700">
                {{ schedule.sendTime }}
              </p>
            </div>
          </div>
          <p v-if="nextSendDates.length > 8" class="text-xs text-blue-600 mt-2 text-center">
            Y {{ nextSendDates.length - 8 }} fechas más...
          </p>
        </div>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <AlertTriangle class="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h6 class="text-sm font-medium text-red-800 mb-2">Errores de configuración:</h6>
            <ul class="text-sm text-red-700 space-y-1">
              <li v-for="error in validationErrors" :key="error">• {{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Calendar, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      isRecurring: false,
      frequency: '',
      customInterval: 1,
      customUnit: 'weeks',
      daysOfWeek: [],
      dayOfMonth: '',
      sendTime: '09:00',
      activeDuration: '7',
      startDate: '',
      endDate: '',
      timezone: 'Europe/Madrid',
      sendReminders: false,
      reminderDays: '1'
    })
  }
});

const emit = defineEmits(['update:modelValue']);

// Local state
const isRecurring = ref(props.modelValue.isRecurring);
const schedule = ref({ ...props.modelValue });
const validationErrors = ref([]);

// Constants
const daysOfWeek = [
  { value: 'monday', short: 'Lun', full: 'Lunes' },
  { value: 'tuesday', short: 'Mar', full: 'Martes' },
  { value: 'wednesday', short: 'Mié', full: 'Miércoles' },
  { value: 'thursday', short: 'Jue', full: 'Jueves' },
  { value: 'friday', short: 'Vie', full: 'Viernes' },
  { value: 'saturday', short: 'Sáb', full: 'Sábado' },
  { value: 'sunday', short: 'Dom', full: 'Domingo' }
];

const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

// Computed properties
const schedulePreview = computed(() => {
  if (!isRecurring.value || !schedule.value.frequency || !schedule.value.startDate) {
    return null;
  }

  let summary = '';
  let details = '';

  switch (schedule.value.frequency) {
    case 'daily':
      summary = 'Envío diario';
      details = `Todos los días a las ${schedule.value.sendTime}`;
      break;
    case 'weekly':
      if (schedule.value.daysOfWeek.length > 0) {
        const dayNames = schedule.value.daysOfWeek.map(day => 
          daysOfWeek.find(d => d.value === day)?.full
        ).join(', ');
        summary = 'Envío semanal';
        details = `Cada ${dayNames} a las ${schedule.value.sendTime}`;
      }
      break;
    case 'biweekly':
      if (schedule.value.daysOfWeek.length > 0) {
        const dayNames = schedule.value.daysOfWeek.map(day => 
          daysOfWeek.find(d => d.value === day)?.full
        ).join(', ');
        summary = 'Envío quincenal';
        details = `Cada dos semanas los ${dayNames} a las ${schedule.value.sendTime}`;
      }
      break;
    case 'monthly':
      if (schedule.value.dayOfMonth) {
        const dayText = schedule.value.dayOfMonth === 'last' ? 'último día' : `día ${schedule.value.dayOfMonth}`;
        summary = 'Envío mensual';
        details = `El ${dayText} de cada mes a las ${schedule.value.sendTime}`;
      }
      break;
    case 'quarterly':
      if (schedule.value.dayOfMonth) {
        const dayText = schedule.value.dayOfMonth === 'last' ? 'último día' : `día ${schedule.value.dayOfMonth}`;
        summary = 'Envío trimestral';
        details = `El ${dayText} cada 3 meses a las ${schedule.value.sendTime}`;
      }
      break;
    case 'yearly':
      if (schedule.value.dayOfMonth && schedule.value.startDate) {
        const startDate = new Date(schedule.value.startDate);
        const monthName = startDate.toLocaleDateString('es-ES', { month: 'long' });
        const dayText = schedule.value.dayOfMonth === 'last' ? 'último día' : `día ${schedule.value.dayOfMonth}`;
        summary = 'Envío anual';
        details = `El ${dayText} de ${monthName} cada año a las ${schedule.value.sendTime}`;
      }
      break;
    case 'custom':
      if (schedule.value.customInterval && schedule.value.customUnit) {
        const unitText = {
          days: 'días',
          weeks: 'semanas',
          months: 'meses'
        }[schedule.value.customUnit];
        summary = 'Envío personalizado';
        details = `Cada ${schedule.value.customInterval} ${unitText} a las ${schedule.value.sendTime}`;
      }
      break;
  }

  if (schedule.value.activeDuration) {
    details += `. Activa por ${schedule.value.activeDuration} día${schedule.value.activeDuration !== '1' ? 's' : ''}`;
  }

  if (schedule.value.endDate) {
    const endDate = new Date(schedule.value.endDate);
    details += `. Hasta el ${endDate.toLocaleDateString('es-ES')}`;
  }

  return { summary, details };
});

const nextSendDates = computed(() => {
  if (!isRecurring.value || !schedule.value.frequency || !schedule.value.startDate) {
    return [];
  }

  const dates = [];
  const startDate = new Date(schedule.value.startDate);
  const endDate = schedule.value.endDate ? new Date(schedule.value.endDate) : null;
  let currentDate = new Date(startDate);

  // Generate next 20 dates or until end date
  for (let i = 0; i < 20; i++) {
    if (endDate && currentDate > endDate) break;
    
    dates.push(new Date(currentDate));
    
    // Calculate next date based on frequency
    switch (schedule.value.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'quarterly':
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      case 'custom':
        if (schedule.value.customUnit === 'days') {
          currentDate.setDate(currentDate.getDate() + parseInt(schedule.value.customInterval));
        } else if (schedule.value.customUnit === 'weeks') {
          currentDate.setDate(currentDate.getDate() + (parseInt(schedule.value.customInterval) * 7));
        } else if (schedule.value.customUnit === 'months') {
          currentDate.setMonth(currentDate.getMonth() + parseInt(schedule.value.customInterval));
        }
        break;
    }
  }

  return dates;
});

// Methods
const handleRecurrenceToggle = () => {
  schedule.value.isRecurring = isRecurring.value;
  if (!isRecurring.value) {
    // Reset schedule when disabling recurrence
    schedule.value = {
      ...schedule.value,
      frequency: '',
      daysOfWeek: [],
      dayOfMonth: '',
      customInterval: 1,
      customUnit: 'weeks'
    };
  }
  emitUpdate();
};

const handleFrequencyChange = () => {
  // Reset specific fields when frequency changes
  schedule.value.daysOfWeek = [];
  schedule.value.dayOfMonth = '';
  schedule.value.customInterval = 1;
  schedule.value.customUnit = 'weeks';
  validateSchedule();
  emitUpdate();
};

const validateDateRange = () => {
  if (schedule.value.startDate && schedule.value.endDate) {
    const start = new Date(schedule.value.startDate);
    const end = new Date(schedule.value.endDate);
    
    if (end <= start) {
      schedule.value.endDate = '';
      validationErrors.value.push('La fecha de finalización debe ser posterior a la fecha de inicio');
    }
  }
  validateSchedule();
  emitUpdate();
};

const validateSchedule = () => {
  validationErrors.value = [];

  if (!isRecurring.value) return;

  if (!schedule.value.frequency) {
    validationErrors.value.push('Selecciona una frecuencia');
  }

  if (!schedule.value.startDate) {
    validationErrors.value.push('Selecciona una fecha de inicio');
  }

  if (!schedule.value.sendTime) {
    validationErrors.value.push('Selecciona una hora de envío');
  }

  if (!schedule.value.activeDuration) {
    validationErrors.value.push('Selecciona la duración activa');
  }

  // Frequency-specific validations
  if (['weekly', 'biweekly'].includes(schedule.value.frequency) && schedule.value.daysOfWeek.length === 0) {
    validationErrors.value.push('Selecciona al menos un día de la semana');
  }

  if (['monthly', 'quarterly', 'yearly'].includes(schedule.value.frequency) && !schedule.value.dayOfMonth) {
    validationErrors.value.push('Selecciona un día del mes');
  }

  if (schedule.value.frequency === 'custom') {
    if (!schedule.value.customInterval || schedule.value.customInterval < 1) {
      validationErrors.value.push('El intervalo personalizado debe ser mayor a 0');
    }
    if (!schedule.value.customUnit) {
      validationErrors.value.push('Selecciona una unidad para el intervalo personalizado');
    }
  }
};

const formatPreviewDate = (date) => {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  });
};

const emitUpdate = () => {
  emit('update:modelValue', {
    ...schedule.value,
    isRecurring: isRecurring.value
  });
};

// Watchers
watch(schedule, () => {
  validateSchedule();
  emitUpdate();
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  schedule.value = { ...newValue };
  isRecurring.value = newValue.isRecurring;
}, { deep: true });
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary;
}
</style>