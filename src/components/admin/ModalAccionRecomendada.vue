<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
        @click.self="cerrarModal"
        @keydown.esc="cerrarModal"
      >
        <div
          ref="modalContent"
          class="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'modal-title-' + alerta?.categoria"
        >
          <!-- Header del Modal -->
          <div class="px-6 pt-6 pb-4 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="getIconClasses()"
                  >
                    <component :is="getIcon()" class="h-6 w-6 text-white" />
                  </div>
                  <h2
                    :id="'modal-title-' + alerta?.categoria"
                    class="text-xl font-bold text-gray-900"
                  >
                    Recomendaciones para mejorar
                  </h2>
                </div>
                <p class="text-lg font-semibold" :class="getTitleColorClass()">
                  {{ alerta?.categoria }}
                </p>
              </div>
              <button
                @click="cerrarModal"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar modal"
              >
                <X class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Contenido del Modal -->
          <div class="px-6 py-5">
            <!-- Indicador de Nivel -->
            <div class="mb-4 p-3 rounded-lg" :class="getBadgeClasses()">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Nivel actual:</span>
                <span class="text-2xl font-bold">{{ alerta?.valor }}%</span>
              </div>
            </div>

            <!-- Sección SMART (solo si es recomendación de BD) -->
            <div v-if="esRecomendacionSmart && alerta?.objetivo_smart" class="mb-4 space-y-3">
              <!-- Objetivo Específico (S) -->
              <div class="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 class="text-xs font-semibold text-purple-800 mb-1 flex items-center gap-1">
                  <Target class="h-3.5 w-3.5" />
                  Objetivo SMART
                </h4>
                <p class="text-sm text-purple-900">{{ alerta.objetivo_smart }}</p>
              </div>

              <!-- Métrica y Plazo (M + T) -->
              <div class="grid grid-cols-2 gap-2">
                <div v-if="alerta.metrica_exito" class="p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <h4 class="text-xs font-semibold text-green-800 mb-1 flex items-center gap-1">
                    <BarChart3 class="h-3.5 w-3.5" />
                    Métrica de Éxito
                  </h4>
                  <p class="text-xs text-green-900">{{ alerta.metrica_exito }}</p>
                </div>
                <div v-if="alerta.plazo_dias" class="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 class="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                    <Clock class="h-3.5 w-3.5" />
                    Plazo
                  </h4>
                  <p class="text-xs text-amber-900">{{ alerta.plazo_dias }} días</p>
                </div>
              </div>
            </div>

            <!-- Recomendaciones (clásicas si no es SMART) -->
            <div v-if="!esRecomendacionSmart" class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Lightbulb class="h-4 w-4 text-yellow-500" />
                  Recomendaciones
                </h3>
                <p class="text-sm text-gray-700 leading-relaxed">
                  {{ getRecomendacionTexto() }}
                </p>
              </div>
            </div>

            <!-- Acciones Sugeridas -->
            <div
              class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <h4 class="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Target class="h-4 w-4" />
                Acciones sugeridas:
              </h4>
              <ul class="text-sm text-blue-800 space-y-1.5">
                <li
                  v-for="(accion, index) in getAccionesParaMostrar()"
                  :key="index"
                  class="flex items-start gap-2"
                >
                  <span class="text-blue-600 mt-0.5">•</span>
                  <span>{{ typeof accion === 'string' ? accion : accion.accion }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Footer del Modal -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3">
            <button
              @click="cerrarModal"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cerrar
            </button>
            <button
              @click="marcarComoGestionado"
              :disabled="guardando"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="getButtonClasses()"
            >
              <span v-if="guardando" class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else>
                <CheckCircle class="h-4 w-4 inline mr-2" />
                {{ esRecomendacionSmart ? 'Iniciar plan de acción' : 'Marcar como gestionado' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import {
  X,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Target,
  Brain,
  Zap,
  Megaphone,
  Heart,
  Calendar,
  BarChart3,
  Clock
} from 'lucide-vue-next';
import { recomendacionesService } from '@/services/recomendaciones.service';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  alerta: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'marcar-gestionado']);

// Estado para persistir
const guardando = ref(false);

// Detectar si es una recomendación SMART (desde BD) o alerta clásica
const esRecomendacionSmart = computed(() => {
  return props.alerta?.recomendacion_id || props.alerta?.objetivo_smart;
});

const modalContent = ref(null);

// Cerrar modal
const cerrarModal = () => {
  emit('update:modelValue', false);
};

// Marcar como gestionado - persiste en BD si es recomendación SMART
const marcarComoGestionado = async () => {
  if (esRecomendacionSmart.value && props.alerta?.recomendacion_id) {
    guardando.value = true;
    try {
      await recomendacionesService.marcarComoGestionada(
        props.alerta.recomendacion_id,
        `Marcado como gestionado desde modal de acciones`
      );
    } catch (error) {
      console.error('Error al persistir estado:', error);
      // Continuar aunque falle - el emit notificará al padre
    } finally {
      guardando.value = false;
    }
  }

  emit('marcar-gestionado', props.alerta);
  cerrarModal();
};

// Obtener ícono según categoría
const getIcon = () => {
  if (!props.alerta) return AlertTriangle;

  const categoria = props.alerta.categoria.toLowerCase();
  if (categoria.includes('estrés')) return Brain;
  if (categoria.includes('herramientas') || categoria.includes('recursos')) return Zap;
  if (categoria.includes('comunicación')) return Megaphone;
  if (categoria.includes('vida') || categoria.includes('trabajo')) return Heart;

  return props.alerta.tipo === 'critica' ? AlertTriangle : ShieldAlert;
};

// Clases de estilo según tipo
const getIconClasses = () => {
  if (!props.alerta) return 'bg-gray-500';

  if (props.alerta.tipo === 'critica') return 'bg-red-500';
  if (props.alerta.tipo === 'moderada') return 'bg-orange-500';
  return 'bg-green-500';
};

const getTitleColorClass = () => {
  if (!props.alerta) return 'text-gray-700';

  if (props.alerta.tipo === 'critica') return 'text-red-700';
  if (props.alerta.tipo === 'moderada') return 'text-orange-700';
  return 'text-green-700';
};

const getBadgeClasses = () => {
  if (!props.alerta) return 'bg-gray-50 border border-gray-200';

  if (props.alerta.tipo === 'critica') return 'bg-red-50 border border-red-200 text-red-800';
  if (props.alerta.tipo === 'moderada') return 'bg-orange-50 border border-orange-200 text-orange-800';
  return 'bg-green-50 border border-green-200 text-green-800';
};

const getButtonClasses = () => {
  if (!props.alerta) return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';

  if (props.alerta.tipo === 'critica') return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
  if (props.alerta.tipo === 'moderada') return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500';
  return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
};

// Obtener texto de recomendación según valor
const getRecomendacionTexto = () => {
  if (!props.alerta) return '';

  const valor = props.alerta.valor;

  if (valor < 60) {
    return `Recomendamos implementar un programa de intervención inmediata: talleres de gestión del estrés o sesiones 1:1 de apoyo psicológico. La situación actual requiere acción urgente para evitar un mayor deterioro en esta área.`;
  } else if (valor >= 60 && valor <= 80) {
    return `Sugerimos realizar acciones preventivas: encuestas rápidas o sesiones de comunicación interna. Esta es una oportunidad para mejorar antes de que la situación se vuelva crítica.`;
  } else {
    return `No se requieren acciones urgentes. Mantén las buenas prácticas actuales y continúa monitoreando esta área para asegurar que se mantenga en niveles óptimos.`;
  }
};

// Obtener acciones a mostrar - usa SMART si está disponible, sino las clásicas
const getAccionesParaMostrar = () => {
  // Si es recomendación SMART con acciones de BD
  if (esRecomendacionSmart.value && props.alerta?.acciones_sugeridas?.length > 0) {
    return props.alerta.acciones_sugeridas;
  }
  // Fallback a acciones clásicas
  return getAccionesSugeridas();
};

// Obtener acciones sugeridas según categoría y valor
const getAccionesSugeridas = () => {
  if (!props.alerta) return [];

  const categoria = props.alerta.categoria.toLowerCase();
  const valor = props.alerta.valor;

  // Gestión del Estrés
  if (categoria.includes('estrés')) {
    if (valor < 60) {
      return [
        'Programar talleres de mindfulness y gestión del estrés',
        'Ofrecer sesiones 1:1 de apoyo psicológico',
        'Implementar días de salud mental',
        'Revisar cargas de trabajo del equipo'
      ];
    } else {
      return [
        'Realizar encuestas de pulso más frecuentes',
        'Ofrecer pausas activas durante la jornada',
        'Compartir recursos de gestión del estrés',
        'Monitorear indicadores de bienestar semanalmente'
      ];
    }
  }

  // Herramientas y Recursos
  if (categoria.includes('herramientas') || categoria.includes('recursos')) {
    if (valor < 60) {
      return [
        'Realizar auditoría de herramientas actuales',
        'Invertir en tecnología y capacitación',
        'Reuniones 1:1 para identificar necesidades',
        'Implementar nuevas soluciones inmediatamente'
      ];
    } else {
      return [
        'Encuestas sobre necesidades de herramientas',
        'Actualizar software y equipos',
        'Capacitaciones sobre herramientas existentes',
        'Mantener canales de feedback abiertos'
      ];
    }
  }

  // Comunicación Interna
  if (categoria.includes('comunicación')) {
    if (valor < 60) {
      return [
        'Implementar reuniones de equipo regulares',
        'Crear canales de comunicación transparentes',
        'Capacitación en comunicación efectiva',
        'Establecer protocolos de comunicación claros'
      ];
    } else {
      return [
        'Reforzar canales de comunicación existentes',
        'Town halls mensuales con el equipo',
        'Promover feedback bidireccional',
        'Celebrar logros y compartir actualizaciones'
      ];
    }
  }

  // Balance Vida-Trabajo
  if (categoria.includes('vida') || categoria.includes('trabajo')) {
    if (valor < 60) {
      return [
        'Revisar políticas de horarios y flexibilidad',
        'Implementar horarios flexibles o trabajo remoto',
        'Establecer límites claros de disponibilidad',
        'Promover desconexión fuera del horario laboral'
      ];
    } else {
      return [
        'Mantener políticas de flexibilidad actuales',
        'Promover vacaciones y días de descanso',
        'Compartir mejores prácticas de balance',
        'Reconocer a quienes mantienen un buen balance'
      ];
    }
  }

  // Acciones genéricas por defecto
  if (valor < 60) {
    return [
      'Realizar diagnóstico detallado del área',
      'Implementar plan de intervención inmediata',
      'Asignar responsables y recursos',
      'Monitorear progreso semanalmente'
    ];
  } else {
    return [
      'Realizar encuestas de seguimiento',
      'Implementar mejoras incrementales',
      'Compartir buenas prácticas',
      'Mantener monitoreo continuo'
    ];
  }
};

// Focus trap y manejo de teclado
const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
  }
};

// Prevenir scroll del body cuando el modal está abierto
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    // Focus en el contenido del modal
    setTimeout(() => {
      modalContent.value?.focus();
    }, 100);
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
