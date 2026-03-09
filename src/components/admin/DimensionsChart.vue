<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Dimensiones del Bienestar</h3>
        <p class="text-sm text-gray-600">Desglose de las métricas que componen el índice general</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-bold text-primary">{{ overallScore.toFixed(1) }}</div>
        <div class="text-sm text-gray-500">Puntuación Global</div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!hasDimensions" class="text-center py-8 text-gray-500">
      <p class="text-sm">No hay datos de dimensiones disponibles aún.</p>
      <p class="text-xs mt-1">Los datos se mostrarán cuando se procesen respuestas de encuestas.</p>
    </div>

    <!-- Dimensions Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="dimension in dimensions" 
        :key="dimension.id"
        class="relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
      >
        <!-- Dimension Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div class="text-2xl mr-3">{{ dimension.icon }}</div>
            <div>
              <h4 class="font-medium text-gray-900">{{ dimension.name }}</h4>
              <p class="text-xs text-gray-500">{{ dimension.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <div :class="['text-lg font-bold', getScoreColorClass(dimension.score)]">
              {{ dimension.score.toFixed(1) }}
            </div>
            <div class="text-xs text-gray-500">/10</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="relative">
          <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              :class="['h-2 rounded-full transition-all duration-1000 ease-out', getProgressColorClass(dimension.score)]"
              :style="{ width: `${Math.min((dimension.score / 10) * 100, 100)}%` }"
            ></div>
          </div>
          
          <!-- Score Labels -->
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <!-- Trend Indicator -->
        <div v-if="dimension.trend" class="flex items-center mt-2">
          <TrendingUp v-if="dimension.trend > 0" class="h-3 w-3 text-green-500 mr-1" />
          <TrendingDown v-else-if="dimension.trend < 0" class="h-3 w-3 text-red-500 mr-1" />
          <Minus v-else class="h-3 w-3 text-gray-400 mr-1" />
          <span 
            :class="[
              'text-xs font-medium',
              dimension.trend > 0 ? 'text-green-600' :
              dimension.trend < 0 ? 'text-red-600' :
              'text-gray-500'
            ]"
          >
            {{ dimension.trend > 0 ? '+' : '' }}{{ dimension.trend.toFixed(1) }} vs. anterior
          </span>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="mt-8">
      <h4 class="text-md font-medium text-gray-900 mb-4">Comparativa Visual</h4>
      <div class="relative h-64">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
      </div>
    </div>

    <!-- Summary Insights -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Strongest Dimension -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <TrendingUp class="h-4 w-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-green-800">Fortaleza Principal</p>
              <p class="text-green-700">{{ strongestDimension.name }} ({{ strongestDimension.score.toFixed(1) }})</p>
            </div>
          </div>
        </div>

        <!-- Weakest Dimension -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle class="h-4 w-4 text-white" />
            </div>
            <div>
              <p class="text-sm font-medium text-orange-800">Área de Mejora</p>
              <p class="text-orange-700">{{ weakestDimension.name }} ({{ weakestDimension.score.toFixed(1) }})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-vue-next';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Props — dimensiones se reciben del componente padre (datos reales de encuestas)
const props = defineProps({
  dimensionsData: {
    type: Array,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

// Dimensiones desde props (datos reales)
const dimensions = computed(() => {
  if (props.dimensionsData && props.dimensionsData.length > 0) {
    return props.dimensionsData;
  }
  // Retornar array vacío si no hay datos
  return [];
});

// Computed properties
const hasDimensions = computed(() => dimensions.value.length > 0);

const overallScore = computed(() => {
  if (!hasDimensions.value) return 0;
  return dimensions.value.reduce((total, dim) => {
    return total + (dim.score * (dim.weight || 1 / dimensions.value.length));
  }, 0);
});

const strongestDimension = computed(() => {
  if (!hasDimensions.value) return { name: '—', score: 0 };
  return dimensions.value.reduce((max, dim) =>
    dim.score > max.score ? dim : max
  );
});

const weakestDimension = computed(() => {
  if (!hasDimensions.value) return { name: '—', score: 0 };
  return dimensions.value.reduce((min, dim) =>
    dim.score < min.score ? dim : min
  );
});

// Methods
const getScoreColorClass = (score) => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  if (score >= 4) return 'text-orange-600';
  return 'text-red-600';
};

const getProgressColorClass = (score) => {
  if (score >= 8) return 'bg-green-500';
  if (score >= 6) return 'bg-yellow-500';
  if (score >= 4) return 'bg-orange-500';
  return 'bg-red-500';
};

const createChart = () => {
  if (!chartCanvas.value || !hasDimensions.value) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  
  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: dimensions.value.map(d => d.name),
      datasets: [
        {
          label: 'Puntuación Actual',
          data: dimensions.value.map(d => d.score),
          backgroundColor: 'rgba(42, 75, 140, 0.1)',
          borderColor: 'rgba(42, 75, 140, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(42, 75, 140, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Objetivo (8.0)',
          data: dimensions.value.map(() => 8.0),
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#ffffff',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const dimension = dimensions.value[context.dataIndex];
              if (context.datasetIndex === 0) {
                return `${context.label}: ${context.parsed.r.toFixed(1)}/10 (Peso: ${(dimension.weight * 100).toFixed(0)}%)`;
              } else {
                return `Objetivo: ${context.parsed.r.toFixed(1)}/10`;
              }
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 2,
            font: {
              size: 11
            },
            color: '#6B7280'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          pointLabels: {
            font: {
              size: 12,
              weight: '500'
            },
            color: '#374151'
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
  });
};

// Lifecycle
onMounted(async () => {
  await nextTick();
  if (hasDimensions.value) {
    setTimeout(() => createChart(), 100);
  }
});

// Recrear chart cuando cambien los datos
watch(() => props.dimensionsData, async () => {
  await nextTick();
  createChart();
}, { deep: true });
</script>

<style scoped>
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>