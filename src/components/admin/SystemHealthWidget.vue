<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { AlertTriangle, CheckCircle, FileText, ClipboardList, Users, ArrowRight, Clock, Activity, Calendar } from 'lucide-vue-next';

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
  },
  totalEmpleados: {
    type: Number,
    default: 0
  },
  comunicadosHoy: {
    type: Number,
    default: 0
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
  <!-- Estado del Sistema - Versión Condensada -->
  <div :class="[
    'border rounded-xl transition-all duration-200',
    systemStatus.borderColor,
    systemStatus.bgColor
  ]">
    <!-- Header compacto con resumen -->
    <div class="px-5 py-4 flex items-center justify-between">
      <!-- Estado principal -->
      <div class="flex items-center gap-3">
        <div :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center',
          systemStatus.color === 'green' ? 'bg-green-100' :
          systemStatus.color === 'yellow' ? 'bg-amber-100' :
          'bg-orange-100'
        ]">
          <component :is="systemStatus.icon" :class="[
            'h-5 w-5',
            systemStatus.color === 'green' ? 'text-green-600' :
            systemStatus.color === 'yellow' ? 'text-amber-600' :
            'text-orange-600'
          ]" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span :class="[
              'text-sm font-semibold',
              systemStatus.color === 'green' ? 'text-green-800' :
              systemStatus.color === 'yellow' ? 'text-amber-800' :
              'text-orange-800'
            ]">{{ systemStatus.label }}</span>
            <span class="text-xs text-gray-500">
              Última actualización: {{ new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Indicadores rápidos -->
      <div class="hidden sm:flex items-center gap-4 text-sm">
        <div class="flex items-center gap-1.5 text-gray-600">
          <Users class="w-4 h-4" />
          <span><strong class="text-gray-900">{{ totalEmpleados || '-' }}</strong> activos</span>
        </div>
        <div class="flex items-center gap-1.5 text-gray-600">
          <FileText class="w-4 h-4" />
          <span><strong class="text-gray-900">{{ encuestasActivas }}</strong> encuesta{{ encuestasActivas !== 1 ? 's' : '' }}</span>
        </div>
        <div v-if="encuestasCerrandoPronto.length > 0" class="flex items-center gap-1.5 text-amber-600">
          <Clock class="w-4 h-4" />
          <span class="font-medium">{{ encuestasCerrandoPronto.length }} por cerrar</span>
        </div>
      </div>
    </div>

    <!-- Acciones pendientes (solo si hay) -->
    <div v-if="pendingActionsCount > 0" class="border-t border-gray-200/50">
      <div class="px-5 py-3 flex flex-wrap gap-2">
        <button
          v-for="action in pendingActions.slice(0, 3)"
          :key="action.id"
          @click="action.onAction"
          :class="[
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:shadow-sm',
            action.priority === 'high' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' :
            action.priority === 'medium' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' :
            'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
          ]"
        >
          <component :is="action.icon" class="w-3.5 h-3.5" />
          <span class="max-w-[200px] truncate">{{ action.title }}</span>
          <ArrowRight class="w-3 h-3 opacity-60" />
        </button>
        <span v-if="pendingActionsCount > 3" class="text-xs text-gray-500 self-center ml-1">
          +{{ pendingActionsCount - 3 }} más
        </span>
      </div>
    </div>
  </div>
</template>
