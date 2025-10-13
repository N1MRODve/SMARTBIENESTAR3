<template>
  <div class="min-h-screen bg-gray-50">
    <Header subtitulo="Panel de Participación" />

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Panel de Participación</h1>
          <p class="text-gray-600 mt-2">Monitorea en tiempo real el avance de las encuestas y la tasa de respuesta por área</p>
        </div>

        <!-- Estadísticas Globales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Tasa Promedio -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Tasa Promedio</p>
                <p class="text-3xl font-bold text-primary">{{ estadisticas.tasaPromedio }}%</p>
                <p class="text-xs text-gray-500 mt-1">En todas las encuestas</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <TrendingUp class="h-7 w-7 text-primary" />
              </div>
            </div>
          </div>

          <!-- Total Respuestas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Total Respuestas</p>
                <p class="text-3xl font-bold text-green-600">{{ estadisticas.totalRespondidos }}</p>
                <p class="text-xs text-gray-500 mt-1">de {{ estadisticas.totalEnviados }} enviadas</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle class="h-7 w-7 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Encuestas Activas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Encuestas Activas</p>
                <p class="text-3xl font-bold text-blue-600">{{ estadisticas.encuestasActivas }}</p>
                <p class="text-xs text-gray-500 mt-1">En curso ahora mismo</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <Activity class="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- Total Encuestas -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Total Encuestas</p>
                <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalEncuestas }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ estadisticas.encuestasCerradas }} cerradas</p>
              </div>
              <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText class="h-7 w-7 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico de Evolución Temporal -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 class="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Evolución de Participación</h2>
              <p class="text-sm text-gray-600">Histórico de tasas de respuesta por encuesta</p>
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(item, index) in evolucion"
              :key="index"
              class="flex items-center gap-4"
            >
              <div class="w-32 flex-shrink-0">
                <p class="text-xs font-medium text-gray-500">{{ formatearFecha(item.fecha) }}</p>
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-medium text-gray-900">{{ item.encuesta }}</p>
                  <span class="text-sm font-bold" :class="getTasaColor(item.tasa)">
                    {{ item.tasa }}%
                  </span>
                </div>
                <div class="relative w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-500"
                    :class="getTasaColorBg(item.tasa)"
                    :style="{ width: `${item.tasa}%` }"
                  >
                    <span class="absolute right-2 top-0 text-xs font-semibold text-white leading-3">
                      {{ item.respondidos }}/{{ item.enviados }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Participación por Departamento -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <Building2 class="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Participación por Departamento</h2>
              <p class="text-sm text-gray-600">Consolidado de todas las encuestas</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="dept in departamentos"
              :key="dept.nombre"
              class="border-2 rounded-xl p-5 transition-all hover:shadow-md"
              :class="getBorderColorClass(dept.tasa)"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                    :class="getBgColorClass(dept.tasa)"
                  >
                    <Users class="h-5 w-5" :class="getIconColorClass(dept.tasa)" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ dept.nombre }}</h3>
                    <p class="text-xs text-gray-500">{{ dept.enviados }} invitaciones</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold" :class="getTasaColor(dept.tasa)">{{ dept.tasa }}%</p>
                </div>
              </div>

              <div class="relative w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getTasaColorBg(dept.tasa)"
                  :style="{ width: `${dept.tasa}%` }"
                ></div>
              </div>

              <p class="text-xs text-gray-600 text-center">
                {{ dept.respondidos }} de {{ dept.enviados }} respuestas
              </p>
            </div>
          </div>
        </div>

        <!-- Detalle por Encuesta -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center mr-3">
                <ClipboardList class="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Detalle por Encuesta</h2>
                <p class="text-sm text-gray-600">Vista detallada de participación por departamento</p>
              </div>
            </div>
          </div>

          <div class="divide-y divide-gray-200">
            <div
              v-for="encuesta in participacionData"
              :key="encuesta.id"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <!-- Header de Encuesta -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-bold text-gray-900">{{ encuesta.encuesta }}</h3>
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      :class="encuesta.estado === 'activa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                    >
                      {{ encuesta.estado === 'activa' ? 'Activa' : 'Cerrada' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Enviada: {{ formatearFecha(encuesta.fecha_envio) }} •
                    Cierre: {{ formatearFecha(encuesta.fecha_cierre) }}
                  </p>
                </div>
                <div class="text-right ml-4">
                  <p class="text-3xl font-bold" :class="getTasaColor(calcularTasa(encuesta.enviados, encuesta.respondidos))">
                    {{ calcularTasa(encuesta.enviados, encuesta.respondidos) }}%
                  </p>
                  <p class="text-xs text-gray-500">{{ encuesta.respondidos }}/{{ encuesta.enviados }}</p>
                </div>
              </div>

              <!-- Barra Global -->
              <div class="mb-4">
                <div class="relative w-full bg-gray-200 rounded-full h-3">
                  <div
                    class="h-3 rounded-full transition-all duration-500"
                    :class="getTasaColorBg(calcularTasa(encuesta.enviados, encuesta.respondidos))"
                    :style="{ width: `${calcularTasa(encuesta.enviados, encuesta.respondidos)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Departamentos -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  v-for="dept in encuesta.departamentos"
                  :key="dept.nombre"
                  class="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <p class="text-xs font-medium text-gray-700 mb-1">{{ dept.nombre }}</p>
                  <div class="flex items-center justify-between">
                    <p class="text-lg font-bold" :class="getTasaColor(calcularTasa(dept.enviados, dept.respondidos))">
                      {{ calcularTasa(dept.enviados, dept.respondidos) }}%
                    </p>
                    <p class="text-xs text-gray-500">{{ dept.respondidos }}/{{ dept.enviados }}</p>
                  </div>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all"
                      :class="getTasaColorBg(calcularTasa(dept.enviados, dept.respondidos))"
                      :style="{ width: `${calcularTasa(dept.enviados, dept.respondidos)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Insights y Recomendaciones -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Mejor Departamento -->
          <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <Award class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-green-900 mb-2">Mejor Participación</h3>
                <p class="text-sm text-green-800 mb-3">
                  <strong>{{ extremos.mejor?.nombre }}</strong> lidera con una tasa de
                  <strong>{{ extremos.mejor?.tasa }}%</strong> de participación.
                </p>
                <p class="text-xs text-green-700">
                  ¡Excelente compromiso! Considera compartir sus prácticas con otros departamentos.
                </p>
              </div>
            </div>
          </div>

          <!-- Departamento que Necesita Atención -->
          <div class="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
            <div class="flex items-start">
              <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                <AlertTriangle class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-orange-900 mb-2">Requiere Atención</h3>
                <p class="text-sm text-orange-800 mb-3">
                  <strong>{{ extremos.peor?.nombre }}</strong> tiene una tasa de
                  <strong>{{ extremos.peor?.tasa }}%</strong> de participación.
                </p>
                <p class="text-xs text-orange-700">
                  Considera enviar recordatorios personalizados o investigar posibles barreras de participación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/common/Header.vue';
import {
  TrendingUp,
  CheckCircle,
  Activity,
  FileText,
  BarChart3,
  Building2,
  Users,
  ClipboardList,
  Award,
  AlertTriangle
} from 'lucide-vue-next';
import {
  participacionMock,
  calcularTasaParticipacion,
  getParticipacionPorDepartamento,
  getEvolucionTemporal,
  getEstadisticasGlobales,
  getDepartamentosExtremos
} from '@/utils/participacionMock.js';

// TODO: conectar con tablas "encuestas", "respuestas" y "departamentos" en futuras iteraciones.

// Estado
const participacionData = ref(participacionMock);
const estadisticas = ref(getEstadisticasGlobales());
const departamentos = ref(getParticipacionPorDepartamento());
const evolucion = ref(getEvolucionTemporal());
const extremos = ref(getDepartamentosExtremos());

// Métodos
const calcularTasa = (enviados, respondidos) => {
  return calcularTasaParticipacion(enviados, respondidos);
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTasaColor = (tasa) => {
  if (tasa >= 80) return 'text-green-600';
  if (tasa >= 60) return 'text-blue-600';
  if (tasa >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getTasaColorBg = (tasa) => {
  if (tasa >= 80) return 'bg-green-500';
  if (tasa >= 60) return 'bg-blue-500';
  if (tasa >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const getBgColorClass = (tasa) => {
  if (tasa >= 80) return 'bg-green-100';
  if (tasa >= 60) return 'bg-blue-100';
  if (tasa >= 40) return 'bg-orange-100';
  return 'bg-red-100';
};

const getIconColorClass = (tasa) => {
  if (tasa >= 80) return 'text-green-600';
  if (tasa >= 60) return 'text-blue-600';
  if (tasa >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getBorderColorClass = (tasa) => {
  if (tasa >= 80) return 'border-green-200 bg-green-50/50';
  if (tasa >= 60) return 'border-blue-200 bg-blue-50/50';
  if (tasa >= 40) return 'border-orange-200 bg-orange-50/50';
  return 'border-red-200 bg-red-50/50';
};

onMounted(() => {
  console.log('Panel de Participación cargado');
});
</script>
