<template>
  <div class="bg-gray-50 p-6 rounded-xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles class="h-6 w-6 text-white" />
          </div>
          Recomendaciones SMART
        </h3>
        <p class="text-sm text-gray-600 mt-2">
          Programas y servicios sugeridos según los resultados del diagnóstico
        </p>
      </div>
      <div v-if="recomendaciones.length > 0" class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
        <Target class="h-5 w-5 text-indigo-600" />
        <span class="text-sm font-semibold text-indigo-700">
          {{ recomendaciones.length }} recomendación{{ recomendaciones.length !== 1 ? 'es' : '' }}
        </span>
      </div>
    </div>

    <!-- Recomendaciones -->
    <div v-if="recomendaciones.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(servicio, index) in recomendaciones"
        :key="servicio.id"
        class="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4"
        :class="obtenerColorCategoria(servicio.categoria).border"
        :style="{ animationDelay: `${index * 0.1}s` }"
        style="animation: slideInUp 0.5s ease-out forwards; opacity: 0;"
      >
        <div class="flex items-start gap-4">
          <!-- Icono -->
          <div class="flex-shrink-0">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm"
              :class="obtenerColorCategoria(servicio.categoria).bg"
            >
              {{ servicio.icono }}
            </div>
          </div>

          <!-- Contenido -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="text-base font-semibold text-gray-900">
                {{ servicio.nombre }}
              </h4>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                :class="[obtenerTextoPrioridad(servicio.prioridad).bg, obtenerTextoPrioridad(servicio.prioridad).color]"
              >
                {{ obtenerTextoPrioridad(servicio.prioridad).texto }}
              </span>
            </div>

            <p class="text-sm text-gray-600 mb-3">
              {{ servicio.descripcion }}
            </p>

            <!-- Dimensiones Afectadas -->
            <div class="mb-3">
              <p class="text-xs font-medium text-gray-500 mb-1">Áreas a mejorar:</p>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="dimension in servicio.dimensionesAfectadas.slice(0, 3)"
                  :key="dimension"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {{ dimension }}
                </span>
                <span
                  v-if="servicio.dimensionesAfectadas.length > 3"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  +{{ servicio.dimensionesAfectadas.length - 3 }} más
                </span>
              </div>
            </div>

            <!-- Botón -->
            <button
              @click="verPrograma(servicio)"
              class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Eye class="h-4 w-4" />
              Ver programa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="bg-white rounded-lg p-8 text-center">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle class="h-8 w-8 text-green-600" />
      </div>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">
        Excelentes resultados
      </h4>
      <p class="text-gray-600">
        No se detectaron áreas que requieran programas de mejora inmediatos.
        El equipo muestra un buen nivel de bienestar en todas las dimensiones.
      </p>
    </div>

    <!-- Texto Interpretativo -->
    <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <Info class="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-indigo-900">
          <span class="font-semibold">Nota:</span> Estas recomendaciones se generan automáticamente según los resultados obtenidos en el diagnóstico Clima360 Insight. Cada programa está diseñado para abordar las áreas específicas que presentan oportunidades de mejora.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import {
  Sparkles,
  Target,
  Eye,
  CheckCircle,
  Info
} from 'lucide-vue-next';
import {
  obtenerRecomendaciones,
  obtenerTextoPrioridad,
  obtenerColorCategoria
} from '@/utils/serviciosSmart.js';

// TODO: conectar con tabla "servicios" y lógica de recomendaciones personalizada en futuras iteraciones.

const router = useRouter();
const toast = useToast();

// Props
const props = defineProps({
  resultados: {
    type: Object,
    required: true
  }
});

// Computed
const recomendaciones = computed(() => {
  return obtenerRecomendaciones(props.resultados);
});

// Métodos
const verPrograma = (servicio) => {
  const servicioIdMap = {
    'clima-laboral': 'trabajo_equipo',
    'liderazgo-efectivo': 'liderazgo_consciente',
    'balance-vida': 'balance_vida_trabajo',
    'comunicacion-interna': 'comunicacion_interna',
    'reconocimiento': 'cultura_feedback',
    'desarrollo-profesional': 'retencion_talento',
    'salud-mental': 'bienestar_mental',
    'trabajo-equipo': 'trabajo_equipo',
    'gestion-conflictos': 'trabajo_equipo',
    'autonomia-empoderamiento': 'retencion_talento',
    'recursos-condiciones': 'trabajo_equipo',
    'cultura-innovacion': 'retencion_talento'
  };

  const servicioMockId = servicioIdMap[servicio.id] || 'liderazgo_consciente';

  router.push({
    name: 'admin-servicios',
    query: { servicio: servicioMockId }
  });
};
</script>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
