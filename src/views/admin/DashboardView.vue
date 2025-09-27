<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
      <p class="mt-2 text-lg text-gray-600">Vista general del bienestar de tu empresa</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
      <p class="text-gray-600">Cargando datos del dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar el dashboard</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="cargarDatos" variant="outline">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Fila 1: Índice de Bienestar General -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Índice de Bienestar General</h2>
            <ScoreGauge
              :score="analyticsData.overallScore"
              title="Puntuación Global"
              description="Basado en las respuestas de la encuesta activa"
              :trend="analyticsData.trends?.overallChange || null"
            />
          </div>
        </div>
        
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Resumen Ejecutivo</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div class="flex items-center">
                    <Users class="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p class="text-sm font-medium text-blue-900">Participación</p>
                      <p class="text-lg font-bold text-blue-800">{{ analyticsData.responseRate }}%</p>
                    </div>
                  </div>
                </div>
                <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div class="flex items-center">
                    <MessageSquare class="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p class="text-sm font-medium text-green-900">Respuestas</p>
                      <p class="text-lg font-bold text-green-800">{{ analyticsData.totalResponses }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-700 leading-relaxed">
                  <strong>Estado actual:</strong> 
                  {{ getScoreRecommendations(analyticsData.overallScore) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fila 2: Desglose del Índice (NUEVA) -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Desglose del Índice de Bienestar</h2>
          <p class="text-gray-600">
            Análisis detallado por dimensiones clave del bienestar organizacional
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SubScoreCard
            v-for="subScore in analyticsData.subScores"
            :key="subScore.titulo"
            :titulo="subScore.titulo"
            :puntuacion="subScore.puntuacion"
            :descripcion="subScore.descripcion"
            :icono="subScore.icono"
            :tendencia="subScore.tendencia"
          />
        </div>
      </div>

      <!-- Fila 3: Insights Clave -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center mb-6">
            <Lightbulb class="h-6 w-6 text-yellow-600 mr-3" />
            <h2 class="text-xl font-semibold text-gray-900">Insights Clave</h2>
          </div>
          <div class="space-y-4">
            <InsightCard
              v-for="insight in analyticsData.insights"
              :key="insight.title"
              :insight="insight"
              :show-progress-bar="false"
            />
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center mb-6">
            <Zap class="h-6 w-6 text-blue-600 mr-3" />
            <h2 class="text-xl font-semibold text-gray-900">Recomendaciones Accionables</h2>
          </div>
          <div v-if="recomendaciones.length > 0" class="space-y-4">
            <div 
              v-for="servicio in recomendaciones" 
              :key="servicio.id"
              class="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="font-medium text-blue-900 mb-1">{{ servicio.titulo }}</h4>
                  <p class="text-sm text-blue-700">{{ servicio.descripcion }}</p>
                </div>
                <router-link :to="{ name: 'admin-servicio-detalle', params: { id: servicio.id } }">
                  <Button variant="outline" class="text-sm ml-4">
                    <ExternalLink class="h-4 w-4" />
                  </Button>
                </router-link>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <CheckCircle class="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p class="text-gray-600">¡Excelente! No hay recomendaciones urgentes en este momento.</p>
          </div>
        </div>
      </div>

      <!-- Fila 4: Accesos Directos -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center mb-6">
          <Zap class="h-6 w-6 text-purple-600 mr-3" />
          <h2 class="text-xl font-semibold text-gray-900">Accesos Directos</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            @click="crearEncuesta"
            variant="outline" 
            class="w-full h-20 flex flex-col items-center justify-center space-y-2"
          >
            <FileText class="h-6 w-6" />
            <span class="text-sm">Crear Encuesta</span>
          </Button>
          
          <Button 
            @click="gestionarEmpleados"
            variant="outline" 
            class="w-full h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Users class="h-6 w-6" />
            <span class="text-sm">Gestionar Empleados</span>
          </Button>
          
          <Button 
            @click="gestionarRecompensas"
            variant="outline" 
            class="w-full h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Gift class="h-6 w-6" />
            <span class="text-sm">Gestionar Recompensas</span>
          </Button>
          
          <Button 
            @click="crearComunicado"
            variant="outline" 
            class="w-full h-20 flex flex-col items-center justify-center space-y-2"
          >
            <Megaphone class="h-6 w-6" />
            <span class="text-sm">Crear Comunicado</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { calculateWellnessScore, getScoreRecommendations } from '@/services/mock/analytics.service';
import { getServicios } from '@/services/mock/servicios.service';
import ScoreGauge from '@/components/admin/ScoreGauge.vue';
import SubScoreCard from '@/components/admin/SubScoreCard.vue';
import InsightCard from '@/components/admin/InsightCard.vue';
import Button from '@/components/common/Button.vue';
import { 
  AlertCircle, 
  RefreshCw, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  Zap, 
  CheckCircle,
  ExternalLink,
  FileText,
  Gift,
  Megaphone
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();

// Estado reactivo
const loading = ref(true);
const error = ref(null);
const analyticsData = ref({
  overallScore: 0,
  subScores: [],
  insights: [],
  trends: { available: false },
  totalResponses: 0,
  responseRate: 0
});
const recomendaciones = ref([]);

// Métodos
const cargarDatos = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Cargar datos de analytics
    const analytics = await calculateWellnessScore();
    analyticsData.value = analytics;
    
    // Cargar servicios para recomendaciones (simulado)
    const servicios = getServicios();
    // Simular lógica de recomendaciones basada en el score
    if (analytics.overallScore < 7) {
      recomendaciones.value = servicios.slice(0, 2); // Mostrar 2 servicios recomendados
    } else {
      recomendaciones.value = []; // No hay recomendaciones urgentes
    }
    
  } catch (err) {
    error.value = err.message || 'Error al cargar los datos del dashboard';
    console.error('Error cargando dashboard:', err);
  } finally {
    loading.value = false;
  }
};

// Métodos de navegación
const crearEncuesta = () => {
  router.push('/admin/crear-encuesta');
};

const gestionarEmpleados = () => {
  router.push('/admin/empleados');
};

const gestionarRecompensas = () => {
  router.push('/admin/recompensas');
};

const crearComunicado = () => {
  router.push('/admin/crear-comunicado');
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatos();
});
</script>

<style scoped>
/* Estilos específicos para el dashboard */
.grid {
  display: grid;
}

.space-y-8 > * + * {
  margin-top: 2rem;
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>