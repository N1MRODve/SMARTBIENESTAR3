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
          Objetivos específicos, medibles, alcanzables, relevantes y temporales
        </p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Indicador de carga -->
        <div v-if="loading" class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <Loader2 class="h-4 w-4 text-gray-500 animate-spin" />
          <span class="text-sm text-gray-600">Generando...</span>
        </div>
        <!-- Badge de recomendaciones -->
        <div v-else-if="recomendacionesVisuales.length > 0" class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
          <Target class="h-5 w-5 text-indigo-600" />
          <span class="text-sm font-semibold text-indigo-700">
            {{ recomendacionesVisuales.length }} recomendación{{ recomendacionesVisuales.length !== 1 ? 'es' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="bg-white rounded-lg p-8 text-center">
      <Loader2 class="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
      <p class="text-gray-600">Analizando resultados y generando recomendaciones...</p>
    </div>

    <!-- Recomendaciones SMART (desde BD) -->
    <div v-else-if="recomendacionesBD.length > 0" class="space-y-4">
      <div
        v-for="(rec, index) in recomendacionesBD"
        :key="rec.id"
        class="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4"
        :class="obtenerColorNivelRiesgo(rec.nivel_riesgo).border"
        :style="{ animationDelay: `${index * 0.1}s` }"
        style="animation: slideInUp 0.5s ease-out forwards; opacity: 0;"
      >
        <div class="flex items-start gap-4">
          <!-- Indicador de prioridad -->
          <div class="flex-shrink-0">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
              :class="obtenerColorNivelRiesgo(rec.nivel_riesgo).bg"
            >
              <span class="text-2xl font-bold" :class="obtenerColorNivelRiesgo(rec.nivel_riesgo).text">
                {{ rec.prioridad }}
              </span>
            </div>
          </div>

          <!-- Contenido SMART -->
          <div class="flex-1 min-w-0">
            <!-- Header -->
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="text-base font-semibold text-gray-900">
                {{ rec.titulo }}
              </h4>
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="obtenerColorNivelRiesgo(rec.nivel_riesgo).badge"
                >
                  {{ formatearNivelRiesgo(rec.nivel_riesgo) }}
                </span>
                <span
                  v-if="rec.estado !== 'pendiente'"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="obtenerColorEstado(rec.estado)"
                >
                  {{ formatearEstado(rec.estado) }}
                </span>
              </div>
            </div>

            <!-- Descripción -->
            <p class="text-sm text-gray-600 mb-3">
              {{ rec.descripcion }}
            </p>

            <!-- Objetivo SMART -->
            <div class="bg-indigo-50 rounded-lg p-3 mb-3">
              <p class="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                <Target class="h-3.5 w-3.5" />
                OBJETIVO SMART
              </p>
              <p class="text-sm text-indigo-900">{{ rec.objetivo_especifico }}</p>
            </div>

            <!-- Métricas y Plazo -->
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="bg-gray-50 rounded p-2">
                <p class="text-xs font-medium text-gray-500">Métrica de éxito</p>
                <p class="text-sm text-gray-800">{{ rec.metrica_exito }}</p>
              </div>
              <div class="bg-gray-50 rounded p-2">
                <p class="text-xs font-medium text-gray-500">Plazo</p>
                <p class="text-sm text-gray-800 flex items-center gap-1">
                  <Clock class="h-3.5 w-3.5" />
                  {{ rec.plazo_dias }} días
                </p>
              </div>
            </div>

            <!-- Acciones sugeridas (preview) -->
            <div v-if="rec.acciones_sugeridas && rec.acciones_sugeridas.length > 0" class="mb-3">
              <p class="text-xs font-medium text-gray-500 mb-1">Acciones principales:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li v-for="accion in rec.acciones_sugeridas.slice(0, 2)" :key="accion.orden" class="flex items-start gap-2">
                  <CheckCircle class="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{{ accion.accion }}</span>
                </li>
                <li v-if="rec.acciones_sugeridas.length > 2" class="text-gray-500 text-xs pl-6">
                  +{{ rec.acciones_sugeridas.length - 2 }} acciones más...
                </li>
              </ul>
            </div>

            <!-- Botones -->
            <div class="flex gap-2">
              <button
                @click="verDetalleRecomendacion(rec)"
                class="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Eye class="h-4 w-4" />
                Ver plan completo
              </button>
              <button
                v-if="rec.estado === 'pendiente'"
                @click="marcarEnProgreso(rec)"
                class="flex items-center justify-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm font-medium"
              >
                <Play class="h-4 w-4" />
                Iniciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fallback: Recomendaciones estáticas (serviciosSmart.js) -->
    <div v-else-if="recomendacionesFallback.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="(servicio, index) in recomendacionesFallback"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  Sparkles,
  Target,
  Eye,
  CheckCircle,
  Info,
  Loader2,
  Clock,
  Play
} from 'lucide-vue-next';
import {
  obtenerRecomendaciones,
  obtenerTextoPrioridad,
  obtenerColorCategoria
} from '@/utils/serviciosSmart.js';
import { recomendacionesService } from '@/services/recomendaciones.service';

const router = useRouter();

// Props
const props = defineProps({
  resultados: {
    type: Object,
    required: true
  },
  encuestaId: {
    type: String,
    default: null
  },
  empresaId: {
    type: String,
    default: null
  },
  categoriasInterpretadas: {
    type: Array,
    default: () => []
  },
  indiceBienestarGlobal: {
    type: Number,
    default: 50
  }
});

// Emits
const emit = defineEmits(['ver-detalle', 'recomendacion-actualizada']);

// Estado
const loading = ref(false);
const recomendacionesBD = ref([]);
const yaGeneradas = ref(false);

// Computed: Recomendaciones estáticas (fallback)
const recomendacionesFallback = computed(() => {
  return obtenerRecomendaciones(props.resultados);
});

// Computed: Recomendaciones para mostrar en UI
const recomendacionesVisuales = computed(() => {
  return recomendacionesBD.value.length > 0 ? recomendacionesBD.value : recomendacionesFallback.value;
});

// Cargar recomendaciones existentes de BD
const cargarRecomendaciones = async () => {
  if (!props.encuestaId) return;

  try {
    const data = await recomendacionesService.getRecomendaciones(props.encuestaId);
    if (data.length > 0) {
      recomendacionesBD.value = data;
      yaGeneradas.value = true;
      console.log('[RecomendacionesSmart] Recomendaciones cargadas:', data.length);
    }
  } catch (error) {
    console.error('[RecomendacionesSmart] Error cargando recomendaciones:', error);
  }
};

// Generar nuevas recomendaciones
const generarRecomendaciones = async () => {
  if (!props.encuestaId || !props.empresaId) {
    console.warn('[RecomendacionesSmart] Faltan props para generar recomendaciones');
    return;
  }

  loading.value = true;
  try {
    const resultado = await recomendacionesService.generarRecomendacionesAutomaticas(
      props.encuestaId,
      {
        empresa_id: props.empresaId,
        indiceBienestarGlobal: props.indiceBienestarGlobal,
        categoriasInterpretadas: props.categoriasInterpretadas
      }
    );

    console.log('[RecomendacionesSmart] Resultado generación:', resultado);

    if (resultado.success && resultado.recomendaciones_generadas > 0) {
      await cargarRecomendaciones();
    }
  } catch (error) {
    console.error('[RecomendacionesSmart] Error generando recomendaciones:', error);
  } finally {
    loading.value = false;
  }
};

// Colores por nivel de riesgo
const obtenerColorNivelRiesgo = (nivel) => {
  const colores = {
    critico: {
      border: 'border-red-500',
      bg: 'bg-red-100',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-800'
    },
    alto: {
      border: 'border-orange-500',
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800'
    },
    moderado: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    saludable: {
      border: 'border-green-500',
      bg: 'bg-green-100',
      text: 'text-green-700',
      badge: 'bg-green-100 text-green-800'
    },
    optimo: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800'
    }
  };
  return colores[nivel] || colores.moderado;
};

// Colores por estado
const obtenerColorEstado = (estado) => {
  const colores = {
    pendiente: 'bg-gray-100 text-gray-700',
    en_progreso: 'bg-blue-100 text-blue-700',
    completada: 'bg-green-100 text-green-700',
    descartada: 'bg-red-100 text-red-700'
  };
  return colores[estado] || colores.pendiente;
};

// Formatear nivel de riesgo
const formatearNivelRiesgo = (nivel) => {
  const nombres = {
    critico: 'Crítico',
    alto: 'Riesgo Alto',
    moderado: 'Moderado',
    saludable: 'Saludable',
    optimo: 'Óptimo'
  };
  return nombres[nivel] || nivel;
};

// Formatear estado
const formatearEstado = (estado) => {
  const nombres = {
    pendiente: 'Pendiente',
    en_progreso: 'En progreso',
    completada: 'Completada',
    descartada: 'Descartada'
  };
  return nombres[estado] || estado;
};

// Ver detalle de recomendación SMART
const verDetalleRecomendacion = (recomendacion) => {
  emit('ver-detalle', recomendacion);
};

// Marcar recomendación como en progreso
const marcarEnProgreso = async (recomendacion) => {
  try {
    await recomendacionesService.marcarComoGestionada(recomendacion.id);
    recomendacion.estado = 'en_progreso';
    emit('recomendacion-actualizada', recomendacion);
    console.log('[RecomendacionesSmart] Recomendación marcada en progreso:', recomendacion.id);
  } catch (error) {
    console.error('[RecomendacionesSmart] Error actualizando estado:', error);
  }
};

// Ver programa (fallback para servicios estáticos)
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

// Watch: regenerar si cambian las props
watch(
  () => [props.encuestaId, props.categoriasInterpretadas],
  async () => {
    if (props.encuestaId && props.categoriasInterpretadas.length > 0) {
      await cargarRecomendaciones();
      if (!yaGeneradas.value && recomendacionesBD.value.length === 0) {
        await generarRecomendaciones();
      }
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(async () => {
  if (props.encuestaId) {
    await cargarRecomendaciones();
    // Si no hay recomendaciones y tenemos datos, generar automáticamente
    if (!yaGeneradas.value && props.categoriasInterpretadas.length > 0) {
      await generarRecomendaciones();
    }
  }
});
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
