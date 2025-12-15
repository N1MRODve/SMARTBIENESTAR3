<template>
  <div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-indigo-500">
        <div class="flex items-center justify-center mb-3">
          <Send class="h-8 w-8 text-indigo-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Comunicados enviados</p>
        <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalEnviados }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-yellow-500">
        <div class="flex items-center justify-center mb-3">
          <Clock class="h-8 w-8 text-yellow-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Programados</p>
        <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalProgramados }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-green-500">
        <div class="flex items-center justify-center mb-3">
          <TrendingUp class="h-8 w-8 text-green-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Tasa promedio de lectura</p>
        <p class="text-3xl font-bold text-green-700">{{ estadisticas.promedioLectura }}%</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-purple-500">
        <div class="flex items-center justify-center mb-3">
          <Building class="h-8 w-8 text-purple-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Departamentos activos</p>
        <p class="text-sm font-bold text-gray-900 mt-2">{{ estadisticas.departamentosActivos }}</p>
      </div>
    </div>

    <!-- Gráfico de Barras -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-6">
        Interacciones por Comunicado
      </h3>

      <div v-if="estadisticas.datosGrafico.length > 0" class="space-y-4">
        <div
          v-for="(dato, index) in estadisticas.datosGrafico"
          :key="index"
          class="space-y-2"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-gray-700">{{ dato.titulo }}</span>
            <span
              class="font-bold"
              :class="dato.interacciones >= 80 ? 'text-green-600' : dato.interacciones >= 60 ? 'text-orange-600' : 'text-red-600'"
            >
              {{ dato.interacciones }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :class="dato.interacciones >= 80 ? 'bg-green-500' : dato.interacciones >= 60 ? 'bg-orange-500' : 'bg-red-500'"
              :style="{ width: `${dato.interacciones}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600">No hay datos de interacciones disponibles</p>
      </div>
    </div>

    <!-- Tarjetas de Resumen Adicionales -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Distribución por Estado -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Distribución por Estado
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Enviados</span>
            </div>
            <span class="text-lg font-bold text-green-700">{{ estadisticas.totalEnviados }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Programados</span>
            </div>
            <span class="text-lg font-bold text-yellow-700">{{ estadisticas.totalProgramados }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Borradores</span>
            </div>
            <span class="text-lg font-bold text-gray-700">{{ estadisticas.totalBorradores }}</span>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Insights y Recomendaciones
        </h3>
        <div class="space-y-4">
          <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Info class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-900">
                Departamentos más activos
              </p>
              <p class="text-xs text-blue-700 mt-1">
                {{ estadisticas.departamentosActivos }} lideran en interacciones
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle class="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-green-900">
                Tasa de lectura promedio
              </p>
              <p class="text-xs text-green-700 mt-1">
                {{ estadisticas.promedioLectura }}% de interacción es
                {{ estadisticas.promedioLectura >= 80 ? 'excelente' : estadisticas.promedioLectura >= 60 ? 'bueno' : 'mejorable' }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <Target class="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-purple-900">
                Recomendación
              </p>
              <p class="text-xs text-purple-700 mt-1">
                Mantén comunicación regular para optimizar engagement
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
import {
  Send,
  Clock,
  TrendingUp,
  Building,
  BarChart3,
  Info,
  CheckCircle,
  Target
} from 'lucide-vue-next';

const estadisticas = computed(() => ({
  totalEnviados: 0,
  totalProgramados: 0,
  promedioLectura: 0,
  totalBorradores: 0,
  departamentosActivos: 0,
  datosGrafico: []
}));
</script>
