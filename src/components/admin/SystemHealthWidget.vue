<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { AlertTriangle, CheckCircle, FileText, ClipboardList, Users, ArrowRight } from 'lucide-vue-next';

const router = useRouter();

const props = defineProps({
  encuestasActivas: {
    type: Number,
    default: 0
  },
  solicitudesPendientes: {
    type: Number,
    default: 0
  },
  empleadosSinResponder: {
    type: Number,
    default: 0
  },
  encuestasCerrandoPronto: {
    type: Array,
    default: () => []
  },
  participacionBaja: {
    type: Array,
    default: () => []
  }
});

const pendingActions = computed(() => {
  const actions = [];

  // Encuestas con baja participación
  if (props.participacionBaja && props.participacionBaja.length > 0) {
    props.participacionBaja.forEach(encuesta => {
      if (encuesta.participacion < 50) {
        actions.push({
          id: `low-participation-${encuesta.id}`,
          icon: FileText,
          title: `${encuesta.totalPendientes} empleados sin responder encuesta`,
          description: `"${encuesta.titulo}" tiene ${encuesta.participacion}% de participación`,
          actionLabel: 'Ver encuesta',
          priority: 'high',
          onAction: () => router.push(`/admin/encuestas/${encuesta.id}/resultados`)
        });
      }
    });
  }

  // Encuestas cerrando pronto
  if (props.encuestasCerrandoPronto && props.encuestasCerrandoPronto.length > 0) {
    props.encuestasCerrandoPronto.forEach(encuesta => {
      actions.push({
        id: `closing-soon-${encuesta.id}`,
        icon: FileText,
        title: `Encuesta cierra en ${encuesta.diasRestantes} día${encuesta.diasRestantes !== 1 ? 's' : ''}`,
        description: `"${encuesta.titulo}" - ${encuesta.participacion}% de participación`,
        actionLabel: 'Enviar recordatorio',
        priority: 'medium',
        onAction: () => router.push(`/admin/encuestas/${encuesta.id}/resultados`)
      });
    });
  }

  // Solicitudes pendientes
  if (props.solicitudesPendientes > 0) {
    actions.push({
      id: 'pending-requests',
      icon: ClipboardList,
      title: `${props.solicitudesPendientes} solicitud${props.solicitudesPendientes !== 1 ? 'es' : ''} de servicio pendiente${props.solicitudesPendientes !== 1 ? 's' : ''}`,
      description: 'Requieren revisión y aprobación',
      actionLabel: 'Revisar solicitudes',
      priority: 'medium',
      onAction: () => router.push('/admin/solicitudes')
    });
  }

  return actions;
});

const pendingActionsCount = computed(() => pendingActions.value.length);

const systemStatus = computed(() => {
  if (pendingActionsCount.value === 0) {
    return {
      label: 'Todo en orden',
      color: 'green',
      icon: CheckCircle,
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50/50',
      textColor: 'text-green-900'
    };
  } else if (pendingActionsCount.value <= 2) {
    return {
      label: 'Atención recomendada',
      color: 'yellow',
      icon: AlertTriangle,
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50/50',
      textColor: 'text-amber-900'
    };
  } else {
    return {
      label: 'Requiere atención',
      color: 'orange',
      icon: AlertTriangle,
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-50/50',
      textColor: 'text-orange-900'
    };
  }
});

const getPriorityColor = (priority) => {
  const colors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-blue-500'
  };
  return colors[priority] || 'border-l-gray-300';
};
</script>

<template>
  <!-- Estado del Sistema -->
  <div :class="[
    'border rounded-xl p-6 mb-6 transition-all duration-200',
    systemStatus.borderColor,
    systemStatus.bgColor
  ]">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center">
        <div :class="[
          'w-12 h-12 rounded-full flex items-center justify-center mr-4',
          systemStatus.color === 'green' ? 'bg-green-100/80' :
          systemStatus.color === 'yellow' ? 'bg-amber-100/80' :
          'bg-orange-100/80'
        ]">
          <component :is="systemStatus.icon" :class="[
            'h-6 w-6',
            systemStatus.color === 'green' ? 'text-green-700' :
            systemStatus.color === 'yellow' ? 'text-amber-700' :
            'text-orange-700'
          ]" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Estado del Sistema</h2>
          <p class="text-sm text-gray-600 mt-0.5">
            <span v-if="pendingActionsCount === 0">No hay acciones pendientes</span>
            <span v-else>{{ pendingActionsCount }} acción{{ pendingActionsCount !== 1 ? 'es' : '' }} {{ pendingActionsCount !== 1 ? 'requieren' : 'requiere' }} tu atención</span>
          </p>
        </div>
      </div>
      <div :class="[
        'px-3 py-1.5 rounded-lg text-xs font-medium',
        systemStatus.color === 'green' ? 'bg-green-100/80 text-green-800' :
        systemStatus.color === 'yellow' ? 'bg-amber-100/80 text-amber-800' :
        'bg-orange-100/80 text-orange-800'
      ]">
        {{ systemStatus.label }}
      </div>
    </div>

    <!-- Lista de acciones pendientes -->
    <div v-if="pendingActionsCount > 0" class="space-y-3">
      <div
        v-for="action in pendingActions"
        :key="action.id"
        :class="['flex items-start p-4 bg-white rounded-lg border-l-4 border-gray-200 hover:shadow-md transition-all', getPriorityColor(action.priority)]"
      >
        <component :is="action.icon" class="h-5 w-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900">{{ action.title }}</p>
          <p class="text-xs text-gray-600 mt-1">{{ action.description }}</p>
        </div>
        <button
          @click="action.onAction"
          class="ml-4 px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap inline-flex items-center"
        >
          {{ action.actionLabel }}
          <ArrowRight class="h-3 w-3 ml-1" />
        </button>
      </div>
    </div>

    <!-- Estado positivo -->
    <div v-else class="p-6 bg-white border border-green-200 rounded-lg text-center">
      <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-3" />
      <p class="text-sm font-medium text-gray-900 mb-1">Sistema funcionando correctamente</p>
      <p class="text-xs text-gray-600">
        Todas las encuestas tienen buena participación y no hay solicitudes pendientes
      </p>
    </div>
  </div>
</template>
