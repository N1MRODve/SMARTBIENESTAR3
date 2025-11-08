<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-300 rounded-lg p-8 text-center">
      <AlertCircle class="h-12 w-12 text-gray-700 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button
        @click="cargarDatos"
        class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Reintentar
      </button>
    </div>

    <div v-else class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Analítica Ejecutiva Consolidada</h1>
          <p class="text-gray-600 mt-2">Resumen general de bienestar y participación organizacional</p>
        </div>
        <button
          @click="abrirPresentacion"
          class="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Monitor class="h-5 w-5" />
          Modo Presentación
        </button>
      </div>

      <!-- Grid KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Índice Global de Bienestar -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <Heart class="h-6 w-6 text-white" />
            </div>
            <div :class="[estadoGlobal.border, 'px-3 py-1 rounded-full border-2']">
              <span class="text-xs font-semibold text-gray-900">{{ estadoGlobal.label }}</span>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 mb-1">Índice Global de Bienestar</p>
          <p class="text-4xl font-bold text-gray-900">{{ analitica.bienestar_global.toFixed(1) }}</p>
          <p class="text-xs text-gray-500 mt-1">de 5.0</p>
        </div>

        <!-- Variación Trimestral -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <TrendingUp class="h-6 w-6 text-white" />
            </div>
            <component
              :is="analitica.variacion_trimestral > 0 ? TrendingUp : analitica.variacion_trimestral < 0 ? TrendingDown : Minus"
              class="h-6 w-6 text-gray-900"
            />
          </div>
          <p class="text-sm font-medium text-gray-500 mb-1">Variación Trimestral</p>
          <p class="text-4xl font-bold text-gray-900">
            {{ analitica.variacion_trimestral > 0 ? '+' : '' }}{{ analitica.variacion_trimestral.toFixed(1) }}
          </p>
          <p class="text-xs text-gray-500 mt-1">vs. trimestre anterior</p>
        </div>

        <!-- Participación Global -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <Users class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-sm font-medium text-gray-500 mb-1">Participación Global</p>
          <p class="text-4xl font-bold text-gray-900">{{ analitica.participacion_global }}%</p>
          <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-gray-900 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${analitica.participacion_global}%` }"
            ></div>
          </div>
        </div>

        <!-- Alertas Activas -->
        <div class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="h-6 w-6 text-white" />
            </div>
            <span v-if="analitica.alertas_activas > 0" class="flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-gray-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-gray-900"></span>
            </span>
          </div>
          <p class="text-sm font-medium text-gray-500 mb-1">Alertas Activas</p>
          <p class="text-4xl font-bold text-gray-900">
            {{ analitica.alertas_activas }}
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ analitica.alertas_activas === 0 ? 'Sin alertas' : 'Requieren atención' }}</p>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Encuestas Activas</p>
              <p class="text-3xl font-bold text-gray-900">{{ analitica.encuestas_activas }}</p>
            </div>
            <FileText class="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Encuestas Completadas</p>
              <p class="text-3xl font-bold text-gray-900">{{ analitica.encuestas_completadas }}</p>
            </div>
            <CheckCircle class="h-10 w-10 text-gray-400" />
          </div>
        </div>

        <div class="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 mb-1">Empleados Totales</p>
              <p class="text-3xl font-bold text-gray-900">{{ analitica.empleados_totales }}</p>
            </div>
            <Building2 class="h-10 w-10 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Departamentos Fuertes y Críticos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top 3 Áreas Fuertes -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div class="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <Award class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Top 3 Áreas Fuertes</h2>
                <p class="text-sm text-gray-600">Departamentos con mejor clima laboral</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3">
            <div
              v-for="(dept, index) in analitica.departamentos_fuertes"
              :key="dept.nombre"
              class="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-gray-600">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">{{ dept.promedio.toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingUp v-if="dept.tendencia === 'up'" class="h-4 w-4 text-gray-900 mr-1" />
                    <Minus v-else class="h-4 w-4 text-gray-400 mr-1" />
                    <span class="text-xs text-gray-500">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Áreas Críticas -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div class="bg-gray-100 px-6 py-4 border-b border-gray-200">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Áreas Críticas</h2>
                <p class="text-sm text-gray-600">Departamentos que requieren atención</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3">
            <div
              v-for="(dept, index) in analitica.departamentos_criticos"
              :key="dept.nombre"
              class="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                    !
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-gray-600">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">{{ dept.promedio.toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingDown class="h-4 w-4 text-gray-900 mr-1" />
                    <span class="text-xs text-gray-500">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay áreas críticas -->
            <div v-if="analitica.departamentos_criticos.length === 0" class="text-center py-8 text-gray-500">
              <CheckCircle class="h-12 w-12 text-gray-900 mx-auto mb-3" />
              <p class="text-sm">No hay departamentos en estado crítico</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Evolución -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
            <LineChart class="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Evolución del Bienestar Global</h2>
            <p class="text-sm text-gray-600">Últimos 6 meses</p>
          </div>
        </div>

        <!-- Gráfico Simple con Barras -->
        <div class="space-y-4">
          <div
            v-for="dato in evolucion"
            :key="dato.mes"
            class="flex items-center gap-4"
          >
            <div class="w-24 flex-shrink-0">
              <p class="text-sm font-medium text-gray-700">{{ dato.mes }}</p>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div class="flex-1 relative">
                  <div class="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                    <div
                      class="h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3 bg-gray-900"
                      :style="{ width: `${(dato.valor / 5) * 100}%` }"
                    >
                      <span class="text-white font-bold text-sm">{{ dato.valor.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-20 text-right">
                  <p class="text-xs text-gray-500">{{ dato.participacion }}% part.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categorías de Bienestar -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-8 border border-gray-200">
        <div class="flex items-center mb-6">
          <div class="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
            <BarChart3 class="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Categorías de Bienestar</h2>
            <p class="text-sm text-gray-600">Desglose por dimensión</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            v-for="cat in categorias"
            :key="cat.categoria"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-400 transition-colors"
          >
            <p class="text-xs font-medium text-gray-600 mb-2">{{ cat.categoria }}</p>
            <p class="text-2xl font-bold text-gray-900 mb-1">{{ cat.valor.toFixed(1) }}</p>
            <div class="flex items-center">
              <component
                :is="cat.variacion > 0 ? TrendingUp : cat.variacion < 0 ? TrendingDown : Minus"
                class="h-4 w-4 mr-1 text-gray-900"
              />
              <span class="text-sm font-medium text-gray-900">
                {{ cat.variacion > 0 ? '+' : '' }}{{ cat.variacion.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Ejecutivo -->
      <div class="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-900">
        <div class="flex items-start">
          <div class="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <Info class="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Resumen Ejecutivo</h3>
            <p class="text-gray-700 text-sm leading-relaxed italic">
              {{ resumenEjecutivo }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { analiticaService } from '@/services/analitica.service';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  AlertTriangle,
  FileText,
  CheckCircle,
  Building2,
  Award,
  AlertCircle,
  LineChart,
  BarChart3,
  Info,
  Monitor
} from 'lucide-vue-next';
import {
  generarResumenEjecutivo,
  obtenerEstadoGlobal
} from '@/utils/analiticaMock.js';

const router = useRouter();
const authStore = useAuthStore();

// Estado
const analitica = ref({
  bienestar_global: 0,
  variacion_trimestral: 0,
  participacion_global: 0,
  alertas_activas: 0,
  encuestas_activas: 0,
  encuestas_completadas: 0,
  empleados_totales: 0,
  departamentos_fuertes: [],
  departamentos_criticos: []
});
const evolucion = ref([]);
const categorias = ref([]);
const loading = ref(true);
const error = ref(null);

// Computed
const estadoGlobal = computed(() => {
  const estado = obtenerEstadoGlobal(analitica.value.bienestar_global);
  return {
    ...estado,
    border: 'border-gray-300'
  };
});
const resumenEjecutivo = computed(() => generarResumenEjecutivo(analitica.value));

// Cargar datos
onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [analiticaData, evolucionData, categoriasData] = await Promise.all([
      analiticaService.getAnalytics(authStore.empresaId),
      analiticaService.getEvolution(authStore.empresaId),
      analiticaService.getCategorias(authStore.empresaId)
    ]);

    analitica.value = analiticaData;
    evolucion.value = evolucionData;
    categorias.value = categoriasData;
  } catch (err) {
    console.error('Error cargando analítica:', err);
    error.value = 'No se pudieron cargar los datos';
  } finally {
    loading.value = false;
  }
};

// Métodos
const abrirPresentacion = () => {
  router.push('/admin/presentacion');
};
</script>
