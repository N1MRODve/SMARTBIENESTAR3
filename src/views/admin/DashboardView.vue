<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Dashboard Ejecutivo de Bienestar" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Índice de Bienestar Corporativo</h1>
              <p class="mt-2 text-lg text-gray-600">
                Análisis integral del bienestar de tus {{ analyticsData.totalResponses }} empleados
              </p>
              <div class="flex items-center mt-2 text-sm text-gray-500">
                <Clock class="h-4 w-4 mr-1" />
                <span>Última actualización: {{ formatLastUpdated }}</span>
              </div>
            </div>
            <div class="flex space-x-4">
              <router-link 
                to="/admin/servicios"
                class="inline-flex items-center px-4 py-2 bg-accent text-gray-900 rounded-lg hover:bg-accent/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <Calendar class="h-5 w-5 mr-2" />
                Gestionar Servicios
              </router-link>
              <router-link 
                to="/admin/recompensas"
                class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Gift class="h-5 w-5 mr-2" />
                Gestionar Recompensas
              </router-link>
              <router-link 
                to="/admin/comunicados"
                class="inline-flex items-center px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                <Megaphone class="h-5 w-5 mr-2" />
                Crear Comunicado
              </router-link>
              <router-link 
                to="/admin/crear-encuesta"
                class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Plus class="h-5 w-5 mr-2" />
                Nueva Encuesta
              </router-link>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Analizando datos de bienestar...</h3>
          <p class="text-gray-600">Calculando métricas y generando insights</p>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-8">
          <!-- Main Metrics Row -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Overall Wellness Score - Main Gauge -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <ScoreGauge
                  :score="analyticsData.overallScore"
                  title="Índice General de Bienestar"
                  :description="getScoreRecommendations(analyticsData.overallScore)"
                  :trend="analyticsData.trends.available ? analyticsData.trends.overallChange : null"
                />
              </div>
            </div>

            <!-- Key Stats -->
            <div class="lg:col-span-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <!-- Response Rate -->
                <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                  <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users class="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Tasa de Participación</p>
                    <p class="text-3xl font-bold text-gray-900">{{ analyticsData.responseRate }}%</p>
                    <p class="text-sm text-gray-600">{{ analyticsData.totalResponses }} de 120 empleados</p>
                  </div>
                </div>

                <!-- Trend Indicator -->
                <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
                  <div class="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp class="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Tendencia General</p>
                    <div class="flex items-center">
                      <p class="text-3xl font-bold text-gray-900">
                        {{ analyticsData.trends.available ? 
                            (analyticsData.trends.overallChange > 0 ? '+' : '') + 
                            analyticsData.trends.overallChange.toFixed(1) : 'N/A' }}
                      </p>
                      <TrendingUp v-if="analyticsData.trends.available && analyticsData.trends.overallChange > 0" 
                                 class="h-5 w-5 text-green-500 ml-2" />
                      <TrendingDown v-else-if="analyticsData.trends.available && analyticsData.trends.overallChange < 0" 
                                   class="h-5 w-5 text-red-500 ml-2" />
                    </div>
                    <p class="text-sm text-gray-600">vs. encuesta anterior</p>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="md:col-span-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900 mb-2">Acciones Recomendadas</h4>
                      <p class="text-gray-600">Basado en el análisis actual del bienestar</p>
                    </div>
                    <div class="flex space-x-3">
                      <router-link 
                        to="/admin/encuesta/1/resultados"
                        class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <BarChart3 class="h-4 w-4 mr-2" />
                        Ver Análisis Detallado
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dimension Scores -->
          <div class="bg-white rounded-lg shadow-sm p-8">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Puntuaciones por Dimensión</h2>
              <p class="text-gray-600">Desglose detallado del bienestar por áreas clave</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                v-for="(dimension, key) in analyticsData.dimensionScores" 
                :key="key"
                class="text-center"
              >
                <div class="mb-4">
                  <div class="w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center"
                       :style="{ backgroundColor: getScoreColor(dimension.score).color + '20' }">
                    <span class="text-2xl">{{ dimension.icon }}</span>
                  </div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ dimension.name }}</h3>
                  <div class="text-3xl font-bold mb-2" 
                       :style="{ color: getScoreColor(dimension.score).color }">
                    {{ dimension.score.toFixed(1) }}
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-1000 ease-out"
                      :style="{ 
                        width: `${(dimension.score / 10) * 100}%`,
                        backgroundColor: getScoreColor(dimension.score).color
                      }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ getScoreColor(dimension.score).label }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Insights Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Strengths -->
            <div>
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <ThumbsUp class="h-6 w-6 text-green-600 mr-2" />
                  Fortalezas Principales
                </h2>
                <p class="text-gray-600">Áreas donde tu empresa destaca</p>
              </div>
              <div class="space-y-4">
                <InsightCard 
                  v-for="insight in strengths" 
                  :key="insight.title"
                  :insight="insight"
                />
              </div>
            </div>

            <!-- Areas for Improvement -->
            <div>
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Target class="h-6 w-6 text-orange-600 mr-2" />
                  Áreas de Oportunidad
                </h2>
                <p class="text-gray-600">Aspectos que requieren atención</p>
              </div>
              <div class="space-y-4">
                <InsightCard 
                  v-for="insight in weaknesses" 
                  :key="insight.title"
                  :insight="insight"
                />
              </div>
            </div>
          </div>

          <!-- Recent Surveys Overview -->
          <div class="bg-white rounded-lg shadow-sm p-8">
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Encuestas Recientes</h2>
                <p class="text-gray-600">Historial de mediciones de bienestar</p>
              </div>
              <router-link 
                to="/admin/crear-encuesta"
                class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                <Plus class="h-4 w-4 mr-2" />
                Nueva Encuesta
              </router-link>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="survey in recentSurveys" 
                :key="survey.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex justify-between items-start mb-3">
                  <h3 class="font-semibold text-gray-900 line-clamp-2">{{ survey.titulo }}</h3>
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      survey.estado === 'activa' ? 'bg-green-100 text-green-800' :
                      survey.estado === 'finalizada' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ survey.estado }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar class="h-4 w-4 mr-1" />
                  <span>{{ formatearFecha(survey.fechaCreacion) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">
                    {{ survey.respuestas?.length || 0 }} respuestas
                  </span>
                  <router-link
                    :to="{ name: 'admin-resultados-encuesta', params: { id: survey.id } }"
                    class="text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Ver resultados →
                  </router-link>
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
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import { calculateWellnessScore, getScoreColor, getScoreRecommendations } from '@/services/mock/analytics.service';
import Header from '@/components/common/Header.vue';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
import InsightCard from '@/components/admin/InsightCard.vue';
import { 
  Plus, 
  Calendar, 
  Megaphone,
  Gift,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ThumbsUp,
  Target
} from 'lucide-vue-next';

// Store
const encuestasStore = useEncuestasStore();
const { surveys } = storeToRefs(encuestasStore);
const { fetchAllSurveys } = encuestasStore;

// Local state
const loading = ref(true);
const analyticsData = ref({
  overallScore: 0,
  dimensionScores: {},
  insights: [],
  trends: { available: false },
  totalResponses: 0,
  responseRate: 0,
  lastUpdated: new Date().toISOString()
});

// Computed properties
const formatLastUpdated = computed(() => {
  return new Date(analyticsData.value.lastUpdated).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const strengths = computed(() => 
  analyticsData.value.insights.filter(insight => insight.type === 'strength')
);

const weaknesses = computed(() => 
  analyticsData.value.insights.filter(insight => insight.type === 'weakness')
);

const recentSurveys = computed(() => 
  surveys.value.slice(0, 3)
);

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const loadDashboardData = async () => {
  loading.value = true;
  
  try {
    // Load surveys and analytics data in parallel
    await Promise.all([
      fetchAllSurveys(),
      loadAnalyticsData()
    ]);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const loadAnalyticsData = async () => {
  try {
    const data = await calculateWellnessScore();
    analyticsData.value = data;
  } catch (error) {
    console.error('Error loading analytics data:', error);
  }
};

// Load data on mount
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>