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
                <p v-if="previousSurvey" class="text-sm text-gray-500 mb-2">
                  Comparando: {{ formatearRangoFechas() }}
                </p>
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

          <!-- Feedback Cualitativo Section -->
          <div v-if="comentariosDeLaEncuesta.length > 0" class="mt-12">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Feedback Cualitativo</h2>
              <p class="text-gray-600">
                Comentarios y sugerencias anónimas de los empleados
              </p>
            </div>
            <!-- <ComentariosAnonimos 
              :comentarios="comentariosDeLaEncuesta" 
              :total-respuestas="selectedSurvey.respuestas?.length || 0"
            /> -->
          </div>
          <!-- Questions Results -->
          <div class="space-y-8">
            <div 
              v-for="(pregunta, index) in selectedSurvey.preguntas" 
              :key="pregunta.id"
              :class="[
                'bg-white rounded-lg shadow-sm overflow-hidden',
                pregunta.tipo === 'texto_abierto' ? 'hidden' : ''
              ]"
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
                <!-- Chart Description -->
                <div class="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-700">
                        <span class="font-medium">Cómo leer este gráfico:</span>
                        <span v-if="previousSurvey">
                          Las barras azules representan las respuestas de la semana actual, mientras que las barras verdes muestran las respuestas de la semana anterior. Compara las alturas para ver las tendencias.
                        </span>
                        <span v-else>
                          Cada barra representa el número de empleados que seleccionó esa opción de respuesta.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="h-80">
                  <!-- Bar Chart for Multiple Choice -->
                  <Bar 
                    v-if="pregunta.tipo === 'opcion_multiple'"
                    :data="getChartData(pregunta)"
                    :options="barChartOptions"
                  />
                  
                  <!-- Bar Chart for Yes/No -->
                  <Bar 
                    v-else-if="pregunta.tipo === 'si_no'"
                    :data="getChartData(pregunta)"
                    :options="barChartOptions"
                  />
                  
                  <!-- Bar Chart for Scale 1-5 -->
                  <Bar 
                    v-else-if="pregunta.tipo === 'escala_1_5'"
                    :data="getChartData(pregunta)"
                    :options="scaleChartOptions"
                  />
                </div>

                <!-- Insight Clave -->
                <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-start">
                    <TrendingUp class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 class="text-sm font-medium text-blue-800 mb-1">Insight Clave</h4>
                      <p class="text-sm text-blue-700">{{ getInsightClave(pregunta) }}</p>
                    </div>
                  </div>
                </div>

                <!-- Summary Stats -->
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <h5 class="text-sm font-medium text-gray-900 mb-3">Estadísticas Detalladas</h5>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getResponseCount(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Total Respuestas</p>
                    </div>
                    <div v-if="pregunta.tipo === 'escala_1_5'" class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getAverageScore(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Puntuación Promedio</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getMostPopularAnswer(pregunta) }}</p>
                      <p class="text-sm text-gray-500">Respuesta Más Común</p>
                    </div>
                    <div class="text-center">
                      <p class="text-2xl font-bold text-gray-900">{{ getResponseRate(pregunta) }}%</p>
                      <p class="text-sm text-gray-500">Tasa de Respuesta</p>
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
import ComentariosAnonimos from '@/components/admin/results/ComentariosAnonimos.vue';
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
const { selectedSurvey, previousSurvey, isLoading, error } = storeToRefs(encuestasStore);
const { fetchSurveyById } = encuestasStore;

// Chart options
const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    title: {
      display: true,
      text: 'Comparación de Respuestas',
      font: {
        size: 14,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const datasetLabel = context.dataset.label || '';
          const value = context.parsed.y;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${datasetLabel}: ${value} respuestas (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Número de Respuestas',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      title: {
        display: true,
        text: 'Opciones de Respuesta',
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    }
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    title: {
      display: true,
      text: 'Distribución de Respuestas',
      font: {
        size: 14,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${context.parsed} respuestas (${percentage}%)`;
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
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    title: {
      display: true,
      text: 'Distribución por Puntuación',
      font: {
        size: 14,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const datasetLabel = context.dataset.label || '';
          const value = context.parsed.y;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${datasetLabel} - Puntuación ${context.label}: ${value} respuestas (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Número de Respuestas',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      title: {
        display: true,
        text: 'Puntuación (1 = Muy insatisfecho, 5 = Muy satisfecho)',
        font: {
          size: 12,
          weight: 'bold'
        }
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

// Extraer comentarios de texto abierto
const comentariosDeLaEncuesta = computed(() => {
  if (!selectedSurvey.value?.respuestas || !selectedSurvey.value?.preguntas) return [];
  
  // Encontrar preguntas de tipo texto_abierto
  const preguntasTextoAbierto = selectedSurvey.value.preguntas.filter(p => p.tipo === 'texto_abierto');
  
  if (preguntasTextoAbierto.length === 0) return [];
  
  // Extraer todas las respuestas de texto abierto
  const comentarios = [];
  selectedSurvey.value.respuestas.forEach(respuesta => {
    preguntasTextoAbierto.forEach(pregunta => {
      const comentario = respuesta.respuestas[pregunta.id];
      if (comentario && typeof comentario === 'string') {
        comentarios.push(comentario);
      }
    });
  });
  
  return comentarios;
});
// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatearRangoFechas = () => {
  if (!selectedSurvey.value || !previousSurvey.value) return '';
  const fechaActual = new Date(selectedSurvey.value.fechaCreacion);
  const fechaAnterior = new Date(previousSurvey.value.fechaCreacion);
  return `${formatearFecha(fechaAnterior)} - ${formatearFecha(fechaActual)}`;
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

  // Skip chart generation for text questions
  if (pregunta.tipo === 'texto_abierto') {
    return { labels: [], datasets: [] };
  }
  const respuestas = selectedSurvey.value.respuestas
    .map(r => r.respuestas[pregunta.id])
    .filter(r => r !== undefined);

  // Obtener respuestas de la encuesta anterior si existe
  let respuestasAnteriores = [];
  let preguntaAnterior = null;
  
  if (previousSurvey.value?.respuestas) {
    // Encontrar la pregunta correspondiente en la encuesta anterior
    const indexPregunta = selectedSurvey.value.preguntas.findIndex(p => p.id === pregunta.id);
    if (indexPregunta !== -1 && previousSurvey.value.preguntas[indexPregunta]) {
      preguntaAnterior = previousSurvey.value.preguntas[indexPregunta];
      respuestasAnteriores = previousSurvey.value.respuestas
        .map(r => r.respuestas[preguntaAnterior.id])
        .filter(r => r !== undefined);
    }
  }
  if (pregunta.tipo === 'opcion_multiple') {
    const counts = {};
    const countsAnteriores = {};
    
    pregunta.opciones.forEach(opcion => {
      counts[opcion] = respuestas.filter(r => r === opcion).length;
      countsAnteriores[opcion] = respuestasAnteriores.filter(r => r === opcion).length;
    });

    const datasets = [{
      label: 'Semana Actual',
      data: Object.values(counts),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }];

    if (respuestasAnteriores.length > 0) {
      datasets.push({
        label: 'Semana Anterior',
        data: Object.values(countsAnteriores),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      });
    }

    return {
      labels: Object.keys(counts),
      datasets
    };
  }

  if (pregunta.tipo === 'si_no') {
    const siCount = respuestas.filter(r => r === 'Sí').length;
    const noCount = respuestas.filter(r => r === 'No').length;

    const datasets = [{
      label: 'Semana Actual',
      data: [siCount, noCount],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 2
    }];

    if (respuestasAnteriores.length > 0) {
      const siCountAnterior = respuestasAnteriores.filter(r => r === 'Sí').length;
      const noCountAnterior = respuestasAnteriores.filter(r => r === 'No').length;
      
      datasets.push({
        label: 'Semana Anterior',
        data: [siCountAnterior, noCountAnterior],
        backgroundColor: ['#34D399', '#F87171'],
        borderColor: ['#10B981', '#EF4444'],
        borderWidth: 2
      });
    }

    return {
      labels: ['Sí', 'No'],
      datasets
    };
  }

  if (pregunta.tipo === 'escala_1_5') {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const countsAnteriores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    respuestas.forEach(r => {
      if (counts[r] !== undefined) {
        counts[r]++;
      }
    });

    respuestasAnteriores.forEach(r => {
      if (countsAnteriores[r] !== undefined) {
        countsAnteriores[r]++;
      }
    });

    const datasets = [{
      label: 'Semana Actual',
      data: Object.values(counts),
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }];

    if (respuestasAnteriores.length > 0) {
      datasets.push({
        label: 'Semana Anterior',
        data: Object.values(countsAnteriores),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      });
    }

    return {
      labels: ['1', '2', '3', '4', '5'],
      datasets
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

const getInsightClave = (pregunta) => {
  if (!selectedSurvey.value?.respuestas || !previousSurvey.value?.respuestas) {
    return 'Sin datos de comparación disponibles';
  }

  const indexPregunta = selectedSurvey.value.preguntas.findIndex(p => p.id === pregunta.id);
  if (indexPregunta === -1 || !previousSurvey.value.preguntas[indexPregunta]) {
    return 'Sin datos de comparación disponibles';
  }

  const preguntaAnterior = previousSurvey.value.preguntas[indexPregunta];
  
  if (pregunta.tipo === 'escala_1_5') {
    // Calcular promedios
    const respuestasActuales = selectedSurvey.value.respuestas
      .map(r => r.respuestas[pregunta.id])
      .filter(r => r !== undefined && typeof r === 'number');
    
    const respuestasAnteriores = previousSurvey.value.respuestas
      .map(r => r.respuestas[preguntaAnterior.id])
      .filter(r => r !== undefined && typeof r === 'number');
    
    if (respuestasActuales.length === 0 || respuestasAnteriores.length === 0) {
      return 'Sin suficientes datos para comparar';
    }
    
    const promedioActual = respuestasActuales.reduce((a, b) => a + b, 0) / respuestasActuales.length;
    const promedioAnterior = respuestasAnteriores.reduce((a, b) => a + b, 0) / respuestasAnteriores.length;
    
    const diferencia = promedioActual - promedioAnterior;
    const porcentajeCambio = Math.abs((diferencia / promedioAnterior) * 100);
    
    if (Math.abs(diferencia) < 0.1) {
      return 'Se mantiene estable respecto a la semana anterior';
    } else if (diferencia > 0) {
      return `Ha mejorado un ${porcentajeCambio.toFixed(1)}% respecto a la semana anterior`;
    } else {
      return `Ha disminuido un ${porcentajeCambio.toFixed(1)}% respecto a la semana anterior`;
    }
  }
  
  if (pregunta.tipo === 'si_no') {
    const siActual = selectedSurvey.value.respuestas.filter(r => r.respuestas[pregunta.id] === 'Sí').length;
    const totalActual = selectedSurvey.value.respuestas.length;
    const porcentajeSiActual = (siActual / totalActual) * 100;
    
    const siAnterior = previousSurvey.value.respuestas.filter(r => r.respuestas[preguntaAnterior.id] === 'Sí').length;
    const totalAnterior = previousSurvey.value.respuestas.length;
    const porcentajeSiAnterior = (siAnterior / totalAnterior) * 100;
    
    const diferencia = porcentajeSiActual - porcentajeSiAnterior;
    
    if (Math.abs(diferencia) < 2) {
      return 'Se mantiene estable respecto a la semana anterior';
    } else if (diferencia > 0) {
      return `Las respuestas positivas aumentaron ${diferencia.toFixed(1)}% respecto a la semana anterior`;
    } else {
      return `Las respuestas positivas disminuyeron ${Math.abs(diferencia).toFixed(1)}% respecto a la semana anterior`;
    }
  }
  
  if (pregunta.tipo === 'opcion_multiple') {
    // Para opción múltiple, comparar la opción más popular
    const respuestasActuales = selectedSurvey.value.respuestas
      .map(r => r.respuestas[pregunta.id])
      .filter(r => r !== undefined);
    
    const respuestasAnteriores = previousSurvey.value.respuestas
      .map(r => r.respuestas[preguntaAnterior.id])
      .filter(r => r !== undefined);
    
    const countsActual = {};
    const countsAnterior = {};
    
    pregunta.opciones.forEach(opcion => {
      countsActual[opcion] = respuestasActuales.filter(r => r === opcion).length;
      countsAnterior[opcion] = respuestasAnteriores.filter(r => r === opcion).length;
    });
    
    const opcionMasPopularActual = Object.keys(countsActual).reduce((a, b) => 
      countsActual[a] > countsActual[b] ? a : b
    );
    
    const opcionMasPopularAnterior = Object.keys(countsAnterior).reduce((a, b) => 
      countsAnterior[a] > countsAnterior[b] ? a : b
    );
    
    if (opcionMasPopularActual === opcionMasPopularAnterior) {
      const porcentajeActual = (countsActual[opcionMasPopularActual] / respuestasActuales.length) * 100;
      const porcentajeAnterior = (countsAnterior[opcionMasPopularAnterior] / respuestasAnteriores.length) * 100;
      const diferencia = porcentajeActual - porcentajeAnterior;
      
      if (Math.abs(diferencia) < 2) {
        return `"${opcionMasPopularActual}" sigue siendo la respuesta más común`;
      } else if (diferencia > 0) {
        return `"${opcionMasPopularActual}" aumentó ${diferencia.toFixed(1)}% como respuesta más común`;
      } else {
        return `"${opcionMasPopularActual}" disminuyó ${Math.abs(diferencia).toFixed(1)}% como respuesta más común`;
      }
    } else {
      return `La respuesta más común cambió de "${opcionMasPopularAnterior}" a "${opcionMasPopularActual}"`;
    }
  }
  
  return 'Sin análisis disponible para este tipo de pregunta';
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