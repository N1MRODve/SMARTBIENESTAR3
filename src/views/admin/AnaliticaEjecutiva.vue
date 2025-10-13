<template>
  <div class="min-h-screen bg-gray-50">
    <Header subtitulo="Analítica Ejecutiva" />

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Analítica Ejecutiva Consolidada</h1>
            <p class="text-gray-600 mt-2">Resumen general de bienestar y participación organizacional</p>
          </div>
          <button
            @click="abrirPresentacion"
            class="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Monitor class="h-5 w-5" />
            Modo Presentación
          </button>
        </div>

        <!-- Grid KPIs Principales 2x2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Índice Global de Bienestar -->
          <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart class="h-6 w-6 text-white" />
              </div>
              <div :class="estadoGlobal.bg" class="px-3 py-1 rounded-full">
                <span :class="[estadoGlobal.text, 'text-xs font-semibold']">{{ estadoGlobal.label }}</span>
              </div>
            </div>
            <p class="text-sm font-medium text-gray-500 mb-1">Índice Global de Bienestar</p>
            <p class="text-4xl font-bold text-gray-900">{{ analitica.bienestar_global.toFixed(1) }}</p>
            <p class="text-xs text-gray-500 mt-1">de 5.0</p>
          </div>

          <!-- Variación Trimestral -->
          <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp class="h-6 w-6 text-white" />
              </div>
              <component
                :is="analitica.variacion_trimestral > 0 ? TrendingUp : analitica.variacion_trimestral < 0 ? TrendingDown : Minus"
                :class="[obtenerColorVariacion(analitica.variacion_trimestral), 'h-6 w-6']"
              />
            </div>
            <p class="text-sm font-medium text-gray-500 mb-1">Variación Trimestral</p>
            <p class="text-4xl font-bold" :class="obtenerColorVariacion(analitica.variacion_trimestral)">
              {{ analitica.variacion_trimestral > 0 ? '+' : '' }}{{ analitica.variacion_trimestral.toFixed(1) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">vs. trimestre anterior</p>
          </div>

          <!-- Participación Global -->
          <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Users class="h-6 w-6 text-white" />
              </div>
            </div>
            <p class="text-sm font-medium text-gray-500 mb-1">Participación Global</p>
            <p class="text-4xl font-bold text-gray-900">{{ analitica.participacion_global }}%</p>
            <div class="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: `${analitica.participacion_global}%` }"
              ></div>
            </div>
          </div>

          <!-- Alertas Activas -->
          <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle class="h-6 w-6 text-white" />
              </div>
              <span v-if="analitica.alertas_activas > 0" class="flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <p class="text-sm font-medium text-gray-500 mb-1">Alertas Activas</p>
            <p class="text-4xl font-bold" :class="analitica.alertas_activas > 0 ? 'text-red-600' : 'text-green-600'">
              {{ analitica.alertas_activas }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ analitica.alertas_activas === 0 ? 'Sin alertas' : 'Requieren atención' }}</p>
          </div>
        </div>

        <!-- Estadísticas Adicionales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-700 mb-1">Encuestas Activas</p>
                <p class="text-3xl font-bold text-blue-900">{{ analitica.encuestas_activas }}</p>
              </div>
              <FileText class="h-10 w-10 text-blue-600 opacity-50" />
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-green-700 mb-1">Encuestas Completadas</p>
                <p class="text-3xl font-bold text-green-900">{{ analitica.encuestas_completadas }}</p>
              </div>
              <CheckCircle class="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-purple-700 mb-1">Empleados Totales</p>
                <p class="text-3xl font-bold text-purple-900">{{ analitica.empleados_totales }}</p>
              </div>
              <Building2 class="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        <!-- Departamentos Fuertes y Críticos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Top 3 Áreas Fuertes -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
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
                class="bg-green-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-green-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {{ index + 1 }}
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ dept.nombre }}</p>
                      <p class="text-xs text-gray-600">{{ dept.empleados }} empleados</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-green-600">{{ dept.promedio.toFixed(1) }}</p>
                    <div class="flex items-center justify-end mt-1">
                      <TrendingUp v-if="dept.tendencia === 'up'" class="h-4 w-4 text-green-600 mr-1" />
                      <Minus v-else class="h-4 w-4 text-gray-400 mr-1" />
                      <span class="text-xs text-gray-500">de 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Áreas Críticas -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-200">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
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
                class="bg-red-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-red-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      !
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900">{{ dept.nombre }}</p>
                      <p class="text-xs text-gray-600">{{ dept.empleados }} empleados</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-red-600">{{ dept.promedio.toFixed(1) }}</p>
                    <div class="flex items-center justify-end mt-1">
                      <TrendingDown class="h-4 w-4 text-red-600 mr-1" />
                      <span class="text-xs text-gray-500">de 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mensaje si no hay áreas críticas -->
              <div v-if="analitica.departamentos_criticos.length === 0" class="text-center py-8 text-gray-500">
                <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p class="text-sm">No hay departamentos en estado crítico</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de Evolución -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
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
                        class="h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        :class="obtenerColorBarra(dato.valor)"
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

          <!-- Leyenda -->
          <div class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-6">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span class="text-xs text-gray-600">Crítico (&lt;3.0)</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span class="text-xs text-gray-600">Regular (3.0-3.5)</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span class="text-xs text-gray-600">Bueno (3.5-4.0)</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span class="text-xs text-gray-600">Excelente (≥4.0)</span>
            </div>
          </div>
        </div>

        <!-- Categorías de Bienestar -->
        <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
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
              class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors"
            >
              <p class="text-xs font-medium text-gray-600 mb-2">{{ cat.categoria }}</p>
              <p class="text-2xl font-bold text-gray-900 mb-1">{{ cat.valor.toFixed(1) }}</p>
              <div class="flex items-center">
                <component
                  :is="cat.variacion > 0 ? TrendingUp : cat.variacion < 0 ? TrendingDown : Minus"
                  :class="[obtenerColorVariacion(cat.variacion), 'h-4 w-4 mr-1']"
                />
                <span :class="[obtenerColorVariacion(cat.variacion), 'text-sm font-medium']">
                  {{ cat.variacion > 0 ? '+' : '' }}{{ cat.variacion.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen Ejecutivo -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 shadow-sm border-l-4 border-indigo-500">
          <div class="flex items-start">
            <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/common/Header.vue';
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
  analiticaMock,
  evolucionMock,
  categoriasBienestarMock,
  generarResumenEjecutivo,
  obtenerEstadoGlobal
} from '@/utils/analiticaMock.js';

// TODO: conectar con "resultados_encuestas" y "departamentos" cuando BD esté activa.

const router = useRouter();

// Estado
const analitica = ref(analiticaMock);
const evolucion = ref(evolucionMock);
const categorias = ref(categoriasBienestarMock);

// Computed
const estadoGlobal = computed(() => obtenerEstadoGlobal(analitica.value.bienestar_global));
const resumenEjecutivo = computed(() => generarResumenEjecutivo(analitica.value));

// Métodos
const obtenerColorVariacion = (variacion) => {
  if (variacion > 0) return 'text-green-600';
  if (variacion < 0) return 'text-red-600';
  return 'text-gray-600';
};

const obtenerColorBarra = (valor) => {
  if (valor >= 4.0) return 'bg-green-500';
  if (valor >= 3.5) return 'bg-blue-500';
  if (valor >= 3.0) return 'bg-orange-500';
  return 'bg-red-500';
};

const abrirPresentacion = () => {
  router.push('/admin/presentacion');
};
</script>
