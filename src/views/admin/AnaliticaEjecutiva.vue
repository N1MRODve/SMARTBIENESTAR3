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
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-emerald-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <Heart class="h-6 w-6 text-white" />
            </div>
            <div :class="[estadoGlobal.border, 'px-3 py-1 rounded-full border-2 bg-white shadow-sm']">
              <span class="text-xs font-semibold text-emerald-700">{{ estadoGlobal.label }}</span>
            </div>
          </div>
          <p class="text-sm font-semibold text-emerald-700 mb-1">Índice Global de Bienestar</p>
          <p class="text-4xl font-bold text-emerald-900">{{ analitica.bienestar_global.toFixed(1) }}</p>
          <p class="text-xs text-emerald-600 mt-1">de 5.0</p>
        </div>

        <!-- Variación Trimestral -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp class="h-6 w-6 text-white" />
            </div>
            <component
              :is="analitica.variacion_trimestral > 0 ? TrendingUp : analitica.variacion_trimestral < 0 ? TrendingDown : Minus"
              :class="analitica.variacion_trimestral > 0 ? 'text-emerald-600' : analitica.variacion_trimestral < 0 ? 'text-red-600' : 'text-gray-600'"
              class="h-6 w-6"
            />
          </div>
          <p class="text-sm font-semibold text-blue-700 mb-1">Variación Trimestral</p>
          <p class="text-4xl font-bold text-blue-900">
            {{ analitica.variacion_trimestral > 0 ? '+' : '' }}{{ analitica.variacion_trimestral.toFixed(1) }}
          </p>
          <p class="text-xs text-blue-600 mt-1">vs. trimestre anterior</p>
        </div>

        <!-- Participación Global -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
              <Users class="h-6 w-6 text-white" />
            </div>
          </div>
          <p class="text-sm font-semibold text-purple-700 mb-1">Participación Global</p>
          <p class="text-4xl font-bold text-purple-900">{{ analitica.participacion_global }}%</p>
          <div class="mt-3 w-full bg-purple-200 rounded-full h-2.5 shadow-inner">
            <div
              class="bg-gradient-to-r from-purple-500 to-pink-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              :style="{ width: `${analitica.participacion_global}%` }"
            ></div>
          </div>
        </div>

        <!-- Alertas Activas -->
        <div :class="analitica.alertas_activas === 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'" class="rounded-lg p-6 shadow-lg hover:shadow-xl transition-all border-2">
          <div class="flex items-center justify-between mb-4">
            <div :class="analitica.alertas_activas === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'" class="w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
              <AlertTriangle class="h-6 w-6 text-white" />
            </div>
            <span v-if="analitica.alertas_activas > 0" class="flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-600"></span>
            </span>
            <span v-else class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <CheckCircle class="h-5 w-5 text-green-600" />
            </span>
          </div>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-700' : 'text-amber-700'" class="text-sm font-semibold mb-1">Alertas Activas</p>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-900' : 'text-amber-900'" class="text-4xl font-bold">
            {{ analitica.alertas_activas }}
          </p>
          <p :class="analitica.alertas_activas === 0 ? 'text-green-600' : 'text-amber-600'" class="text-xs mt-1 font-medium">{{ analitica.alertas_activas === 0 ? 'Sin alertas' : 'Requieren atención' }}</p>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-5 border-2 border-orange-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-orange-700 mb-1">Encuestas Activas</p>
              <p class="text-3xl font-bold text-orange-900">{{ analitica.encuestas_activas }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
              <FileText class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-lg p-5 border-2 border-cyan-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-cyan-700 mb-1">Encuestas Completadas</p>
              <p class="text-3xl font-bold text-cyan-900">{{ analitica.encuestas_completadas }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-5 border-2 border-slate-200 shadow-md hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-slate-700 mb-1">Empleados Totales</p>
              <p class="text-3xl font-bold text-slate-900">{{ analitica.empleados_totales }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-lg flex items-center justify-center shadow-md">
              <Building2 class="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Departamentos Fuertes y Críticos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Top 3 Áreas Fuertes -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-emerald-200">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                <Award class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-white">Top 3 Áreas Fuertes</h2>
                <p class="text-sm text-emerald-50">Departamentos con mejor clima laboral</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
            <div
              v-for="(dept, index) in analitica.departamentos_fuertes"
              :key="dept.nombre"
              class="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all border-2 border-emerald-100 hover:border-emerald-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-emerald-700 font-medium">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-emerald-700">{{ dept.promedio.toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingUp v-if="dept.tendencia === 'up'" class="h-4 w-4 text-emerald-600 mr-1" />
                    <Minus v-else class="h-4 w-4 text-gray-400 mr-1" />
                    <span class="text-xs text-emerald-600 font-medium">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Áreas Críticas -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-200">
          <div class="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mr-3">
                <AlertCircle class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-white">Áreas Críticas</h2>
                <p class="text-sm text-amber-50">Departamentos que requieren atención</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-3 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
            <div
              v-for="(dept, index) in analitica.departamentos_criticos"
              :key="dept.nombre"
              class="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-all border-2 border-amber-100 hover:border-amber-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    !
                  </div>
                  <div>
                    <p class="font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-xs text-amber-700 font-medium">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-amber-700">{{ dept.promedio.toFixed(1) }}</p>
                  <div class="flex items-center justify-end mt-1">
                    <TrendingDown class="h-4 w-4 text-amber-600 mr-1" />
                    <span class="text-xs text-amber-600 font-medium">de 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay áreas críticas -->
            <div v-if="analitica.departamentos_criticos.length === 0" class="text-center py-8 bg-white rounded-lg border-2 border-green-200">
              <CheckCircle class="h-16 w-16 text-green-600 mx-auto mb-3" />
              <p class="text-sm font-semibold text-green-700">¡Excelente! No hay departamentos en estado crítico</p>
              <p class="text-xs text-green-600 mt-1">Todos los equipos están funcionando bien</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Evolución -->
      <div class="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-blue-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <LineChart class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Evolución del Bienestar Global</h2>
            <p class="text-sm text-blue-600 font-medium">Últimos 6 meses</p>
          </div>
        </div>

        <!-- Gráfico Simple con Barras -->
        <div class="space-y-3">
          <div
            v-for="(dato, index) in evolucion"
            :key="dato.mes"
            class="flex items-center gap-4"
          >
            <div class="w-24 flex-shrink-0">
              <p class="text-sm font-bold text-gray-700">{{ dato.mes }}</p>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <div class="flex-1 relative">
                  <div class="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-10 relative overflow-hidden shadow-inner">
                    <div
                      class="h-10 rounded-full transition-all duration-700 flex items-center justify-end pr-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-md"
                      :style="{ width: `${(dato.valor / 5) * 100}%` }"
                    >
                      <span class="text-white font-bold text-sm">{{ dato.valor.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
                <div class="w-24 text-right">
                  <p class="text-xs font-semibold text-blue-600">{{ dato.participacion }} personas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categorías de Bienestar -->
      <div class="bg-white rounded-xl p-6 shadow-lg mb-8 border-2 border-purple-200">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <BarChart3 class="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Categorías de Bienestar</h2>
            <p class="text-sm text-purple-600 font-medium">Desglose por dimensión</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            v-for="(cat, index) in categorias"
            :key="cat.categoria"
            :class="[
              index === 0 ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300' : '',
              index === 1 ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-300' : '',
              index === 2 ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300' : '',
              index === 3 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' : '',
              index === 4 ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300' : ''
            ]"
            class="rounded-lg p-4 border-2 hover:shadow-md transition-all"
          >
            <p class="text-xs font-bold mb-2" :class="[
              index === 0 ? 'text-rose-700' : '',
              index === 1 ? 'text-violet-700' : '',
              index === 2 ? 'text-emerald-700' : '',
              index === 3 ? 'text-amber-700' : '',
              index === 4 ? 'text-blue-700' : ''
            ]">{{ cat.categoria }}</p>
            <p class="text-3xl font-bold mb-1" :class="[
              index === 0 ? 'text-rose-900' : '',
              index === 1 ? 'text-violet-900' : '',
              index === 2 ? 'text-emerald-900' : '',
              index === 3 ? 'text-amber-900' : '',
              index === 4 ? 'text-blue-900' : ''
            ]">{{ cat.valor.toFixed(1) }}</p>
            <div class="flex items-center">
              <component
                :is="cat.variacion > 0 ? TrendingUp : cat.variacion < 0 ? TrendingDown : Minus"
                :class="cat.variacion > 0 ? 'text-emerald-600' : cat.variacion < 0 ? 'text-red-600' : 'text-gray-400'"
                class="h-4 w-4 mr-1"
              />
              <span class="text-sm font-bold" :class="[
                cat.variacion > 0 ? 'text-emerald-600' : '',
                cat.variacion < 0 ? 'text-red-600' : '',
                cat.variacion === 0 ? 'text-gray-600' : ''
              ]">
                {{ cat.variacion > 0 ? '+' : '' }}{{ cat.variacion.toFixed(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Ejecutivo -->
      <div class="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-6 shadow-lg border-l-4 border-slate-700">
        <div class="flex items-start">
          <div class="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
            <Info class="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Resumen Ejecutivo</h3>
            <p class="text-slate-700 text-sm leading-relaxed italic font-medium">
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
  const valor = analitica.value.bienestar_global;
  if (valor >= 4.0) return { label: 'Excelente', bg: 'bg-green-100', text: 'text-green-800', border: 'border-gray-300' };
  if (valor >= 3.5) return { label: 'Bueno', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-gray-300' };
  if (valor >= 3.0) return { label: 'Regular', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-gray-300' };
  return { label: 'Crítico', bg: 'bg-red-100', text: 'text-red-800', border: 'border-gray-300' };
});

const resumenEjecutivo = computed(() => {
  const valor = analitica.value.bienestar_global;
  const participacion = analitica.value.participacion_global;

  if (valor >= 4.0 && participacion >= 80) {
    return 'La organización presenta indicadores excelentes de bienestar con alta participación. Se recomienda mantener las prácticas actuales y continuar monitoreando.';
  } else if (valor >= 3.5) {
    return 'Los indicadores de bienestar son buenos. Existen oportunidades de mejora en áreas específicas que pueden potenciar aún más el clima laboral.';
  } else if (valor >= 3.0) {
    return 'Se identifican áreas de mejora importantes. Se recomienda implementar acciones correctivas en los departamentos con menor desempeño.';
  } else {
    return 'Los indicadores requieren atención inmediata. Es fundamental desarrollar un plan de acción integral para mejorar el bienestar organizacional.';
  }
});

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
