<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Resultados de Encuesta" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando resultados de la encuesta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los resultados</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarResultados" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Results Content -->
        <div v-else-if="encuesta" class="space-y-8">
          <!-- Breadcrumb -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <button @click="volverAtras" class="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <ArrowLeft class="h-5 w-5" />
                </button>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRight class="h-5 w-5 text-gray-400 mr-4" />
                  <span class="text-sm font-medium text-gray-500">Encuestas</span>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRight class="h-5 w-5 text-gray-400 mr-4" />
                  <span class="text-sm font-medium text-gray-900">{{ encuesta.titulo }}</span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Header de Resultados -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ encuesta.titulo }}</h1>
                <div class="flex items-center space-x-6 text-sm text-gray-500">
                  <div class="flex items-center">
                    <Users class="h-4 w-4 mr-1" />
                    <span>{{ encuesta.totalParticipantes }} participantes</span>
                  </div>
                  <div class="flex items-center">
                    <TrendingUp class="h-4 w-4 mr-1" />
                    <span>{{ Math.round((encuesta.totalParticipantes / 50) * 100) }}% tasa de participación</span>
                  </div>
                  <div class="flex items-center">
                    <Calendar class="h-4 w-4 mr-1" />
                    <span>{{ encuesta.estado }}</span>
                  </div>
                </div>
              </div>
              <div class="flex space-x-3">
                <Button @click="exportarResultados" variant="outline">
                  <Download class="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button @click="crearComunicado" variant="primary">
                  <Megaphone class="h-4 w-4 mr-2" />
                  Crear Comunicado
                </Button>
              </div>
            </div>
          </div>

          <!-- Resultados por Pregunta -->
          <div v-if="encuesta.preguntas" class="space-y-8">
            <div 
              v-for="(pregunta, index) in encuesta.preguntas" 
              :key="pregunta.id"
              class="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <!-- Header de la Pregunta -->
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">
                  Pregunta {{ index + 1 }}: {{ pregunta.texto }}
                </h3>
              </div>

              <!-- Contenido de Resultados -->
              <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Gráfico -->
                  <div>
                    <h4 class="text-md font-medium text-gray-900 mb-4">Distribución de Respuestas</h4>
                    <div class="bg-gray-50 rounded-lg p-6">
                      <div class="relative h-64 w-full">
                        <canvas :id="`chart-${pregunta.id}`" class="w-full h-full"></canvas>
                      </div>
                    </div>
                  </div>

                  <!-- Análisis e Insights -->
                  <div class="space-y-6">
                    <!-- Insight -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Análisis del Resultado</h4>
                      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div class="flex items-start">
                          <BarChart3 class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <p class="text-blue-800 font-medium">{{ pregunta.insight }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Recomendación -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Acción Recomendada</h4>
                      <div v-if="pregunta.recomendacion" class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <div class="flex items-start">
                              <Lightbulb class="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h5 class="font-semibold text-orange-900 mb-1">{{ pregunta.recomendacion.titulo }}</h5>
                                <p class="text-orange-800 text-sm">{{ pregunta.recomendacion.descripcion }}</p>
                              </div>
                            </div>
                          </div>
                          <Button 
                            @click="handleSolicitarServicio(pregunta.recomendacion.id)"
                            class="ml-4 flex-shrink-0"
                          >
                            <Send class="h-4 w-4 mr-2" />
                            Solicitar Servicio
                          </Button>
                        </div>
                      </div>
                      <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div class="flex items-center">
                          <CheckCircle class="h-5 w-5 text-green-600 mr-3" />
                          <p class="text-green-800 font-medium">¡Excelente! No se requiere acción inmediata para esta área.</p>
                        </div>
                      </div>
                    </div>

                    <!-- Estadísticas Detalladas -->
                    <div>
                      <h4 class="text-md font-medium text-gray-900 mb-3">Estadísticas Detalladas</h4>
                      <div class="space-y-2">
                        <div 
                          v-for="(valor, labelIndex) in pregunta.resultados.data" 
                          :key="labelIndex"
                          class="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span class="text-sm text-gray-700">{{ pregunta.resultados.labels[labelIndex] }}</span>
                          <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900 mr-2">{{ valor }} respuestas</span>
                            <span class="text-xs text-gray-500">
                              ({{ Math.round((valor / encuesta.totalParticipantes) * 100) }}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen General -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Resumen Ejecutivo</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-2xl font-bold text-blue-600">{{ encuesta.totalParticipantes }}</p>
                <p class="text-sm text-blue-800">Total Participantes</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ Math.round((encuesta.totalParticipantes / 50) * 100) }}%</p>
                <p class="text-sm text-green-800">Tasa de Participación</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-2xl font-bold text-purple-600">{{ encuesta.preguntas?.length || 0 }}</p>
                <p class="text-sm text-purple-800">Preguntas Analizadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getResultadosEncuestaById } from '@/services/mock/encuestas.service.js';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
  Download,
  Megaphone,
  BarChart3,
  Lightbulb,
  Send,
  CheckCircle
} from 'lucide-vue-next';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Estado reactivo
const encuesta = ref(null);
const loading = ref(true);
const error = ref(null);
const charts = ref({});

// Métodos
const cargarResultados = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const encuestaId = route.params.encuestaId;
    const resultados = await getResultadosEncuestaById(encuestaId);
    encuesta.value = resultados;
    
    // Crear gráficos después de que el DOM se actualice
    await nextTick();
    crearGraficos();
    
  } catch (err) {
    error.value = err.message || 'Error al cargar los resultados';
    console.error('Error cargando resultados:', err);
  } finally {
    loading.value = false;
  }
};

const crearGraficos = () => {
  if (!encuesta.value?.preguntas) return;
  
  encuesta.value.preguntas.forEach(pregunta => {
    if (pregunta.resultados) {
      // Usar setTimeout para asegurar que el DOM esté listo
      setTimeout(() => {
        const canvas = document.getElementById(`chart-${pregunta.id}`);
        if (canvas) {
          // Destruir gráfico existente si existe
          if (charts.value[pregunta.id]) {
            charts.value[pregunta.id].destroy();
          }
          
          const ctx = canvas.getContext('2d');
          
          // Configurar colores dinámicos
          const colors = [
            '#3B82F6',   // Blue
            '#10B981',   // Green
            '#F59E0B',   // Yellow
            '#EF4444',   // Red
            '#8B5CF6',   // Purple
          ];
          
          charts.value[pregunta.id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: pregunta.resultados.labels,
              datasets: [{
                data: pregunta.resultados.data,
                backgroundColor: colors.slice(0, pregunta.resultados.labels.length),
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 8
              }]
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
                    pointStyle: 'circle',
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
                  borderColor: '#ffffff',
                  borderWidth: 1,
                  callbacks: {
                    label: function(context) {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((context.parsed / total) * 100);
                      return `${context.label}: ${context.parsed} respuestas (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '65%',
              animation: {
                animateRotate: true,
                duration: 1000
              }
            }
          });
        }
      }, 100);
    }
  });
};

const volverAtras = () => {
  router.push('/admin/encuestas');
};

const handleSolicitarServicio = (servicioId) => {
  router.push({ name: 'admin-servicio-detalle', params: { id: servicioId } });
};

const exportarResultados = () => {
  toast.add({
    severity: 'info',
    summary: 'Exportando resultados',
    detail: 'Los resultados se están preparando para descarga...',
    life: 4000
  });
};

const crearComunicado = () => {
  router.push('/admin/crear-comunicado');
};

// Cargar resultados al montar el componente
onMounted(() => {
  cargarResultados();
});
</script>

<style scoped>
/* Asegurar que los canvas tengan el tamaño correcto */
canvas {
  max-width: 100% !important;
  height: auto !important;
}
</style>