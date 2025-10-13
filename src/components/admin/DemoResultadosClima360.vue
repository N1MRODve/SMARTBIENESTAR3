<template>
  <div class="p-8 max-h-[90vh] overflow-y-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-800">Resultados del Diagnóstico Clima360</h2>
          <p class="text-gray-600 mt-2">Análisis integral del clima laboral de tu organización</p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Puntuación Global -->
    <div :class="['rounded-xl shadow-sm p-8 mb-8', colorClaseGlobal]">
      <div class="text-center">
        <div class="text-6xl font-bold mb-2" :class="colorTextoGlobal">
          {{ resultados.total }}
        </div>
        <div class="text-xl font-semibold text-gray-700 mb-2">Puntuación Total</div>
        <div class="text-lg font-medium" :class="colorTextoGlobal">
          {{ interpretacionGlobal.titulo }}
        </div>
        <p class="text-gray-600 mt-3 max-w-2xl mx-auto">
          {{ interpretacionGlobal.descripcion }}
        </p>
      </div>
    </div>

    <!-- Gráfico de Radar -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Análisis por Dimensión</h3>
      <div class="relative h-96">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
      </div>
    </div>

    <!-- Desglose de Variables -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Desglose Detallado</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="variable in variablesConValores"
          :key="variable.nombre"
          class="bg-gray-50 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-800">{{ variable.label }}</span>
            <span :class="['text-lg font-bold', getColorPorValor(variable.valor)]">
              {{ variable.valor }}/5
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="['h-2 rounded-full transition-all duration-1000', getColorBarraPorValor(variable.valor)]"
              :style="{ width: `${(variable.valor / 5) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Métricas Organizacionales -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-6">Métricas Organizacionales</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="metrica in metricasConValores"
          :key="metrica.nombre"
          class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center"
        >
          <div :class="['text-3xl font-bold mb-2', getColorPorValor(metrica.valor)]">
            {{ metrica.valor }}/5
          </div>
          <div class="text-sm font-medium text-gray-700">{{ metrica.label }}</div>
        </div>
      </div>
    </div>

    <!-- Recomendaciones -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8 border border-blue-200">
      <div class="flex items-start">
        <div class="flex-shrink-0 bg-blue-500 rounded-full p-3 mr-4">
          <Lightbulb class="h-6 w-6 text-white" />
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Recomendaciones Estratégicas</h3>
          <ul class="space-y-3">
            <li v-for="(recomendacion, index) in recomendaciones" :key="index" class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                {{ index + 1 }}
              </span>
              <span class="text-gray-700">{{ recomendacion }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="flex justify-between items-center pt-6 border-t">
      <button
        @click="$emit('volver')"
        class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Volver a la Encuesta
      </button>
      <button
        @click="$emit('close')"
        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
      >
        Cerrar Demo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { X, Lightbulb } from 'lucide-vue-next';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  resultados: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'volver']);

// TODO: conectar con tabla "encuestas" y "respuestas_encuestas" cuando la BD esté activa.

const chartCanvas = ref(null);
let chartInstance = null;

const variablesLabels = {
  rotacion: 'Tasa de Rotación',
  absentismo: 'Absentismo',
  productividad: 'Productividad',
  liderazgo: 'Liderazgo',
  comunicacion: 'Comunicación',
  desarrollo: 'Desarrollo Profesional',
  reconocimiento: 'Reconocimiento',
  bienestar: 'Bienestar',
  adaptabilidad: 'Adaptabilidad',
  pertenencia: 'Pertenencia'
};

const variablesConValores = computed(() => {
  return Object.keys(variablesLabels).map(key => ({
    nombre: key,
    label: variablesLabels[key],
    valor: props.resultados[key] || 0
  }));
});

const metricasConValores = computed(() => [
  { nombre: 'rotacion', label: 'Rotación Anual', valor: props.resultados.metricas[11] || 0 },
  { nombre: 'absentismo', label: 'Absentismo', valor: props.resultados.metricas[12] || 0 },
  { nombre: 'productividad', label: 'Productividad', valor: props.resultados.metricas[13] || 0 }
]);

const interpretacionGlobal = computed(() => {
  const total = props.resultados.total;

  if (total <= 32) {
    return {
      titulo: 'Alto Riesgo',
      descripcion: 'Requiere intervención inmediata. Se identifican áreas críticas que necesitan atención prioritaria para mejorar el clima laboral.',
      color: 'red'
    };
  } else if (total <= 42) {
    return {
      titulo: 'Riesgo Moderado',
      descripcion: 'Necesidad de mejoras significativas. Hay oportunidades importantes para fortalecer el ambiente laboral y la satisfacción del equipo.',
      color: 'orange'
    };
  } else if (total <= 52) {
    return {
      titulo: 'Clima Laboral Estable',
      descripcion: 'Oportunidades de mejora continua. El clima laboral es positivo, pero existen áreas específicas donde se puede seguir avanzando.',
      color: 'yellow'
    };
  } else {
    return {
      titulo: 'Clima Laboral Sólido',
      descripcion: 'Fortalezas a mantener y potenciar. Excelente ambiente laboral con indicadores muy positivos en todas las dimensiones evaluadas.',
      color: 'green'
    };
  }
});

const colorClaseGlobal = computed(() => {
  const color = interpretacionGlobal.value.color;
  const clases = {
    red: 'bg-red-50 border-2 border-red-200',
    orange: 'bg-orange-50 border-2 border-orange-200',
    yellow: 'bg-yellow-50 border-2 border-yellow-200',
    green: 'bg-green-50 border-2 border-green-200'
  };
  return clases[color];
});

const colorTextoGlobal = computed(() => {
  const color = interpretacionGlobal.value.color;
  const clases = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600'
  };
  return clases[color];
});

const recomendaciones = computed(() => {
  const total = props.resultados.total;
  const recos = [];

  if (total <= 32) {
    recos.push('Realizar una auditoría completa del clima laboral con entrevistas individuales.');
    recos.push('Implementar un plan de acción inmediato en las áreas más críticas identificadas.');
    recos.push('Establecer canales de comunicación abiertos y confidenciales para el equipo.');
    recos.push('Considerar apoyo externo especializado en clima organizacional.');
  } else if (total <= 42) {
    recos.push('Priorizar las dimensiones con puntuaciones más bajas para intervenciones dirigidas.');
    recos.push('Desarrollar programas de bienestar y balance vida-trabajo.');
    recos.push('Fortalecer los canales de comunicación interna y feedback continuo.');
    recos.push('Implementar iniciativas de reconocimiento y desarrollo profesional.');
  } else if (total <= 52) {
    recos.push('Mantener las fortalezas actuales con seguimiento periódico.');
    recos.push('Enfocarse en las áreas de oportunidad identificadas con planes específicos.');
    recos.push('Promover espacios de participación y co-creación con el equipo.');
    recos.push('Establecer métricas de seguimiento para evaluar el progreso continuo.');
  } else {
    recos.push('Documentar y compartir las mejores prácticas que han llevado a estos resultados.');
    recos.push('Mantener los programas y políticas que han demostrado ser efectivos.');
    recos.push('Implementar un sistema de reconocimiento que celebre estos logros.');
    recos.push('Considerar benchmarking externo para seguir elevando los estándares.');
  }

  return recos;
});

const getColorPorValor = (valor) => {
  if (valor >= 4.5) return 'text-green-600';
  if (valor >= 3.5) return 'text-yellow-600';
  if (valor >= 2.5) return 'text-orange-600';
  return 'text-red-600';
};

const getColorBarraPorValor = (valor) => {
  if (valor >= 4.5) return 'bg-green-500';
  if (valor >= 3.5) return 'bg-yellow-500';
  if (valor >= 2.5) return 'bg-orange-500';
  return 'bg-red-500';
};

const crearGrafico = () => {
  if (!chartCanvas.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  const labels = variablesConValores.value.map(v => v.label);
  const valores = variablesConValores.value.map(v => v.valor);

  chartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Puntuación Actual',
          data: valores,
          backgroundColor: 'rgba(42, 75, 140, 0.2)',
          borderColor: 'rgba(42, 75, 140, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(42, 75, 140, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Objetivo Ideal (4.0)',
          data: Array(valores.length).fill(4),
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.5)',
          borderWidth: 2,
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
              size: 13,
              weight: '500'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          padding: 12,
          borderColor: '#ffffff',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              if (context.datasetIndex === 0) {
                return `${context.label}: ${context.parsed.r.toFixed(1)}/5`;
              } else {
                return `Objetivo: ${context.parsed.r.toFixed(1)}/5`;
              }
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          min: 0,
          ticks: {
            stepSize: 1,
            font: {
              size: 12
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
              weight: '600'
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

onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    crearGrafico();
  }, 100);
});
</script>
