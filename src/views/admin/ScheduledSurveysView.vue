<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Encuestas Programadas</h1>
              <p class="mt-2 text-lg text-gray-600">Gestiona las encuestas recurrentes y sus cronogramas</p>
            </div>
            <Button 
              @click="volverAlDashboard"
              variant="outline"
            >
              <ArrowLeft class="h-5 w-5 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-2xl font-bold text-primary">{{ scheduledSurveys.length }}</div>
            <div class="text-sm text-gray-500">Total Programadas</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-2xl font-bold text-green-600">{{ activeSchedules }}</div>
            <div class="text-sm text-gray-500">Activas</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ upcomingSchedules.length }}</div>
            <div class="text-sm text-gray-500">Próximos Envíos</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-2xl font-bold text-orange-600">{{ totalSentThisMonth }}</div>
            <div class="text-sm text-gray-500">Enviadas Este Mes</div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando encuestas programadas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las programaciones</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="loadScheduledSurveys" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="scheduledSurveys.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay encuestas programadas</h3>
          <p class="text-gray-500 mb-6">Crea una encuesta recurrente para comenzar</p>
          <Button @click="crearNuevaEncuesta">
            <Plus class="h-4 w-4 mr-2" />
            Crear Encuesta Recurrente
          </Button>
        </div>

        <!-- Scheduled Surveys List -->
        <div v-else class="space-y-6">
          <!-- Upcoming Schedules -->
          <div v-if="upcomingSchedules.length > 0" class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-blue-50 px-6 py-4 border-b border-blue-200">
              <h3 class="text-lg font-semibold text-blue-900">Próximos Envíos Programados</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="upcoming in upcomingSchedules" 
                  :key="upcoming.id"
                  class="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h4 class="font-medium text-blue-900 mb-2">{{ upcoming.surveyTitle }}</h4>
                  <div class="space-y-1 text-sm text-blue-700">
                    <div class="flex items-center">
                      <Clock class="h-4 w-4 mr-2" />
                      <span>{{ formatearFechaCompleta(upcoming.nextSendDate) }}</span>
                    </div>
                    <div class="flex items-center">
                      <Users class="h-4 w-4 mr-2" />
                      <span>{{ upcoming.recipientCount }} destinatarios</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Scheduled Surveys -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Todas las Programaciones</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Encuesta
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frecuencia
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próximo Envío
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enviadas
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="schedule in scheduledSurveys" :key="schedule.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ schedule.surveyTitle }}</div>
                        <div class="text-sm text-gray-500">ID: {{ schedule.surveyId }}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm text-gray-900">{{ getFrequencyLabel(schedule.frequency) }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="schedule.nextSendDate" class="text-sm text-gray-900">
                        {{ formatearFecha(schedule.nextSendDate) }}
                      </div>
                      <div v-else class="text-sm text-gray-500">-</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          schedule.status === 'active' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                          schedule.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ getStatusLabel(schedule.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ schedule.totalSent || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        @click="editSchedule(schedule.id)"
                        class="text-blue-600 hover:text-blue-900"
                        :disabled="schedule.status === 'cancelled'"
                      >
                        Editar
                      </button>
                      <button 
                        @click="pauseResumeSchedule(schedule)"
                        class="text-yellow-600 hover:text-yellow-900"
                        :disabled="schedule.status === 'cancelled'"
                      >
                        {{ schedule.status === 'active' ? 'Pausar' : 'Reanudar' }}
                      </button>
                      <button 
                        @click="cancelScheduleConfirm(schedule.id, schedule.surveyTitle)"
                        class="text-red-600 hover:text-red-900"
                        :disabled="schedule.status === 'cancelled'"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useSchedulingStore } from '@/stores/scheduling.store';
import Button from '@/components/common/Button.vue';
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  Calendar,
  Plus,
  Clock,
  Users
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const schedulingStore = useSchedulingStore();

// Store state
const { scheduledSurveys, upcomingSchedules, loading, error } = storeToRefs(schedulingStore);
const { 
  loadScheduledSurveys, 
  loadUpcomingSchedules, 
  updateScheduleConfig, 
  cancelScheduleById 
} = schedulingStore;

// Computed properties
const activeSchedules = computed(() => {
  return scheduledSurveys.value.filter(s => s.status === 'active').length;
});

const totalSentThisMonth = computed(() => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  return scheduledSurveys.value.reduce((total, schedule) => {
    if (schedule.lastSentDate) {
      const sentDate = new Date(schedule.lastSentDate);
      if (sentDate.getMonth() === thisMonth && sentDate.getFullYear() === thisYear) {
        return total + (schedule.totalSent || 0);
      }
    }
    return total;
  }, 0);
});

// Methods
const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const crearNuevaEncuesta = () => {
  router.push('/admin/encuestas/crear');
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatearFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFrequencyLabel = (frequency) => {
  const labels = {
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
    quarterly: 'Trimestral',
    yearly: 'Anual',
    custom: 'Personalizado'
  };
  return labels[frequency] || frequency;
};

const getStatusLabel = (status) => {
  const labels = {
    active: 'Activa',
    paused: 'Pausada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  };
  return labels[status] || status;
};

const editSchedule = (scheduleId) => {
  toast.add({
    severity: 'info',
    summary: 'Función en desarrollo',
    detail: 'La edición de programaciones estará disponible próximamente',
    life: 4000
  });
};

const pauseResumeSchedule = async (schedule) => {
  const newStatus = schedule.status === 'active' ? 'paused' : 'active';
  const action = newStatus === 'active' ? 'reanudar' : 'pausar';
  
  try {
    await updateScheduleConfig(schedule.id, { status: newStatus });
    
    toast.add({
      severity: 'success',
      summary: `Programación ${action === 'pausar' ? 'pausada' : 'reanudada'}`,
      detail: `La encuesta "${schedule.surveyTitle}" ha sido ${action === 'pausar' ? 'pausada' : 'reanudada'}`,
      life: 4000
    });
    
    // Reload data
    await loadScheduledSurveys();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `No se pudo ${action} la programación`,
      life: 5000
    });
  }
};

const cancelScheduleConfirm = async (scheduleId, surveyTitle) => {
  const confirmed = confirm(
    `¿Estás seguro de que quieres cancelar la programación de "${surveyTitle}"?\n\nEsta acción no se puede deshacer.`
  );
  
  if (confirmed) {
    try {
      await cancelScheduleById(scheduleId);
      
      toast.add({
        severity: 'success',
        summary: 'Programación cancelada',
        detail: `La programación de "${surveyTitle}" ha sido cancelada`,
        life: 4000
      });
      
      // Reload data
      await loadScheduledSurveys();
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo cancelar la programación',
        life: 5000
      });
    }
  }
};

// Load data on mount
onMounted(async () => {
  await loadScheduledSurveys();
  await loadUpcomingSchedules();
});
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