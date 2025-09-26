<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Resultados de Encuesta" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando resultados de la encuesta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los resultados</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex justify-center space-x-4">
            <Button @click="recargarResultados" variant="outline">
              <RefreshCw class="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button @click="volverAlDashboard" variant="outline">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>

        <!-- Results Content -->
        <div v-else-if="selectedSurvey" class="space-y-8">
          <!-- Header -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ selectedSurvey.titulo }}
                </h1>
                <p v-if="selectedSurvey.descripcion" class="text-lg text-gray-600 mb-4">
                  {{ selectedSurvey.descripcion }}
                </p>
                <div class="flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center">
                    <Calendar class="h-4 w-4 mr-1" />
                    <span>Creada el {{ formatearFecha(selectedSurvey.fechaCreacion) }}</span>
                  </div>
                  <div class="flex items-center">
                    <Users class="h-4 w-4 mr-1" />
                    <span>{{ selectedSurvey.respuestas?.length || 0 }} respuestas</span>
                  </div>
                  <div class="flex items-center">
                    <HelpCircle class="h-4 w-4 mr-1" />
                    <span>{{ selectedSurvey.preguntas?.length || 0 }} preguntas</span>
                  </div>
                </div>
              </div>
              <Button @click="volverAlDashboard" variant="outline">
                <ArrowLeft class="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 bg-blue-100 rounded-full">
                  <MessageSquare class="h-6 w-6 text-blue-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Total Respuestas</p>
                  <p class="text-2xl font-bold text-gray-900">{{ selectedSurvey.respuestas?.length || 0 }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 bg-green-100 rounded-full">
                  <TrendingUp class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Tasa de Respuesta</p>
                  <p class="text-2xl font-bold text-gray-900">{{ tasaRespuesta }}%</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center">
                <div class="p-3 bg-purple-100 rounded-full">
                  <Clock class="h-6 w-6 text-purple-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Estado</p>
                  <p class="text-2xl font-bold text-gray-900 capitalize">{{ selectedSurvey.estado }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Questions Results -->
          <div class="space-y-8">
            <div 
              v-for="(pregunta, index) in selectedSurvey.preguntas" 
              :key="pregunta.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <!-- Question Header -->
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                  Pregunta {{ index + 1 }}: {{ pregunta.texto }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Tipo: {{ getTipoLabel(pregunta.tipo) }}
                </p>
              </div>

              <!-- Chart Container -->
              <div class="p-6">
                <div class="h-80">
                  <!-- Bar Chart for Multiple Choice -->
                  <Bar 
                    v-if="pregunta.tipo === 'opcion_multiple'"
                    :data="getChartData(pregunta)"
                    :options="barChartOptions"
                  />
                  
                  <!-- Pie Chart for Yes/No -->
                  <Pie 
                    v-else-if="pregunta.tipo === 'si_no'"
                    :data="getChartData(pregunta)"
                    :options="pieChartOptions"
                  />
                  
                  <!-- Bar Chart for Scale 1-5 -->
                  <Bar 
                    v-else-if="pregunta.tipo === 'escala_1_5'"
                    :data="getChartData(pregunta)"
                    :options="scaleChartOptions"
                  />
                </div>

                <!-- Summary Stats -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getResponseCount(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Respuestas</p>
                    </div>
                    <div v-if="pregunta.tipo === 'escala_1_5'" class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getAverageScore(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Promedio</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getMostPopularAnswer(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Más Popular</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getResponseRate(pregunta) }}%</p>
                      <p class="text-sm text-gray-500">Tasa Respuesta</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import { 
  Bar, 
  Pie 
} from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Users, 
  HelpCircle,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-vue-next';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const route = useRoute();
const router = useRouter();
const encuestasStore = useEncuestasStore();
const { selectedSurvey, isLoading, error } = storeToRefs(encuestasStore);
const { fetchSurveyById } = encuestasStore;

// Chart options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.label}: ${context.parsed.y} respuestas`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${context.parsed} (${percentage}%)`;
        }
      }
    }
  }
};

const scaleChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Puntuación ${context.label}: ${context.parsed.y} respuestas`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    },
    x: {
      title: {
        display: true,
        text: 'Puntuación (1 = Muy insatisfecho, 5 = Muy satisfecho)'
      }
    }
  }
};

// Computed properties
const tasaRespuesta = computed(() => {
  if (!selectedSurvey.value?.respuestas) return 0;
  const totalEmpleados = 120; // Simulado
  return Math.round((selectedSurvey.value.respuestas.length / totalEmpleados) * 100);
});

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getTipoLabel = (tipo) => {
  const labels = {
    'opcion_multiple': 'Opción Múltiple',
    'si_no': 'Sí / No',
    'escala_1_5': 'Escala 1-5'
  };
  return labels[tipo] || tipo;
};

const getChartData = (pregunta) => {
  if (!selectedSurvey.value?.respuestas) return { labels: [], datasets: [] };

  const respuestas = selectedSurvey.value.respuestas
    .map(r => r.respuestas[pregunta.id])
    .filter(r => r !== undefined);

  if (pregunta.tipo === 'opcion_multiple') {
    const counts = {};
    pregunta.opciones.forEach(opcion => {
      counts[opcion] = respuestas.filter(r => r === opcion).length;
    });

    return {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4'
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED',
          '#0891B2'
        ],
        borderWidth: 1
      }]
    };
  }

  if (pregunta.tipo === 'si_no') {
    const siCount = respuestas.filter(r => r === 'Sí').length;
    const noCount = respuestas.filter(r => r === 'No').length;

    return {
      labels: ['Sí', 'No'],
      datasets: [{
        data: [siCount, noCount],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 2
      }]
    };
  }

  if (pregunta.tipo === 'escala_1_5') {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    respuestas.forEach(r => {
      if (counts[r] !== undefined) {
        counts[r]++;
      }
    });

    return {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        data: Object.values(counts),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1
      }]
    };
  }

  return { labels: [], datasets: [] };
};

const getResponseCount = (pregunta) => {
  if (!selectedSurvey.value?.respuestas) return 0;
  return selectedSurvey.value.respuestas
    .filter(r => r.respuestas[pregunta.id] !== undefined).length;
};

const getAverageScore = (pregunta) => {
  if (pregunta.tipo !== 'escala_1_5' || !selectedSurvey.value?.respuestas) return '-';
  
  const scores = selectedSurvey.value.respuestas
    .map(r => r.respuestas[pregunta.id])
    .filter(r => r !== undefined && typeof r === 'number');
  
  if (scores.length === 0) return '-';
  
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return average.toFixed(1);
};

const getMostPopularAnswer = (pregunta) => {
  if (!selectedSurvey.value?.respuestas) return '-';
  
  const respuestas = selectedSurvey.value.respuestas
    .map(r => r.respuestas[pregunta.id])
    .filter(r => r !== undefined);
  
  if (respuestas.length === 0) return '-';
  
  const counts = {};
  respuestas.forEach(r => {
    counts[r] = (counts[r] || 0) + 1;
  });
  
  const mostPopular = Object.keys(counts).reduce((a, b) => 
    counts[a] > counts[b] ? a : b
  );
  
  return mostPopular;
};

const getResponseRate = (pregunta) => {
  if (!selectedSurvey.value?.respuestas) return 0;
  
  const totalRespuestas = selectedSurvey.value.respuestas.length;
  const respuestasAPregunta = selectedSurvey.value.respuestas
    .filter(r => r.respuestas[pregunta.id] !== undefined).length;
  
  if (totalRespuestas === 0) return 0;
  
  return Math.round((respuestasAPregunta / totalRespuestas) * 100);
};

const volverAlDashboard = () => {
  router.push('/admin/dashboard');
};

const recargarResultados = () => {
  fetchSurveyById(route.params.id);
};

// Load survey data on mount
onMounted(() => {
  const surveyId = route.params.id;
  if (surveyId) {
    fetchSurveyById(surveyId);
  }
});
</script>

<style scoped>
/* Estilos específicos para los gráficos si son necesarios */
</style>