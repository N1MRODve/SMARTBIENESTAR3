<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Panel de Administración" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
          <p class="mt-2 text-lg text-gray-600">Vista general de tu empresa</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Empleados"
            :value="stats.totalEmpleados"
            icon="Users"
            trend="up"
            description="Empleados registrados"
          />
          <StatsCard
            title="Encuestas Activas"
            :value="stats.encuestasActivas"
            icon="FileText"
            trend="neutral"
            description="Encuestas en curso"
          />
          <StatsCard
            title="Tasa de Respuesta"
            :value="`${stats.tasaRespuesta}%`"
            icon="TrendingUp"
            trend="up"
            description="Participación promedio"
          />
          <StatsCard
            title="Wellness Score"
            :value="stats.wellnessScore"
            icon="Heart"
            trend="up"
            description="Puntuación de bienestar"
          />
        </div>

        <!-- Quick Actions Grid -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Crear Encuesta -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-blue-100 rounded-full">
                    <FileText class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Crear Encuesta</h3>
                    <p class="text-sm text-gray-600">Diseña una nueva encuesta de bienestar</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="router.push('/admin/crear-encuesta')" class="w-full">
                    <Plus class="h-4 w-4 mr-2" />
                    Crear Nueva Encuesta
                  </Button>
                </div>
              </div>
            </div>

            <!-- Gestionar Empleados -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-green-100 rounded-full">
                    <Users class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Gestionar Empleados</h3>
                    <p class="text-sm text-gray-600">Administra tu equipo e invita nuevos miembros</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="router.push('/admin/empleados')" class="w-full">
                    <Users class="h-4 w-4 mr-2" />
                    Ver Empleados
                  </Button>
                </div>
              </div>
            </div>

            <!-- Programar Servicios -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-purple-100 rounded-full">
                    <Calendar class="h-6 w-6 text-purple-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Programar Servicios</h3>
                    <p class="text-sm text-gray-600">Organiza sesiones de bienestar</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="router.push('/admin/servicios')" class="w-full">
                    <Calendar class="h-4 w-4 mr-2" />
                    Gestionar Servicios
                  </Button>
                </div>
              </div>
            </div>

            <!-- Gestionar Recompensas -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-yellow-100 rounded-full">
                    <Gift class="h-6 w-6 text-yellow-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Gestionar Recompensas</h3>
                    <p class="text-sm text-gray-600">Administra el catálogo de recompensas</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="router.push('/admin/recompensas')" class="w-full">
                    <Gift class="h-4 w-4 mr-2" />
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </div>

            <!-- Crear Comunicado -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-orange-100 rounded-full">
                    <Megaphone class="h-6 w-6 text-orange-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Crear Comunicado</h3>
                    <p class="text-sm text-gray-600">Informa sobre acciones tomadas</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="router.push('/admin/comunicados')" class="w-full">
                    <Megaphone class="h-4 w-4 mr-2" />
                    Nuevo Comunicado
                  </Button>
                </div>
              </div>
            </div>

            <!-- Analytics -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="p-3 bg-indigo-100 rounded-full">
                    <BarChart3 class="h-6 w-6 text-indigo-600" />
                  </div>
                  <div class="ml-4 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">Analytics</h3>
                    <p class="text-sm text-gray-600">Métricas y análisis detallados</p>
                  </div>
                </div>
                <div class="mt-4">
                  <Button @click="verAnalytics" variant="outline" class="w-full">
                    <BarChart3 class="h-4 w-4 mr-2" />
                    Ver Métricas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Encuestas Recientes -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Encuestas Recientes</h3>
            </div>
            <div class="p-6">
              <div v-if="encuestasRecientes.length === 0" class="text-center py-8">
                <FileText class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500">No hay encuestas recientes</p>
                <Button @click="router.push('/admin/crear-encuesta')" variant="outline" class="mt-4">
                  Crear Primera Encuesta
                </Button>
              </div>
              <div v-else class="space-y-4">
                <div 
                  v-for="encuesta in encuestasRecientes" 
                  :key="encuesta.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div class="flex-1">
                    <h4 class="font-medium text-gray-900">{{ encuesta.titulo }}</h4>
                    <p class="text-sm text-gray-500">{{ encuesta.totalRespuestas }} respuestas</p>
                  </div>
                  <div class="flex space-x-2">
                    <Button 
                      @click="router.push(`/admin/encuesta/${encuesta.id}/resultados`)"
                      variant="outline"
                      class="text-sm"
                    >
                      Ver Resultados
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Wellness Score -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Wellness Score General</h3>
            </div>
            <div class="p-6">
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">{{ wellnessScore }}/10</div>
                <p class="text-gray-600 mb-4">Puntuación general de bienestar</p>
                <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    class="bg-primary h-3 rounded-full transition-all duration-1000"
                    :style="{ width: `${(wellnessScore / 10) * 100}%` }"
                  ></div>
                </div>
                <p class="text-sm text-gray-500">
                  {{ getScoreDescription(wellnessScore) }}
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import StatsCard from '@/components/common/StatsCard.vue';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Heart,
  Plus,
  Calendar,
  Gift,
  Megaphone,
  BarChart3
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Store state
const { encuestas, loading } = storeToRefs(encuestasStore);
const { cargarEncuestas } = encuestasStore;

// Local state
const stats = ref({
  totalEmpleados: 50,
  encuestasActivas: 1,
  tasaRespuesta: 85,
  wellnessScore: 7.2
});

const encuestasRecientes = ref([]);
const wellnessScore = ref(7.2);

// Methods
const verAnalytics = () => {
  toast.add({
    severity: 'info',
    summary: 'Próximamente',
    detail: 'La sección de analytics estará disponible pronto',
    life: 3000
  });
};

const getScoreDescription = (score) => {
  if (score >= 8) return 'Excelente nivel de bienestar';
  if (score >= 6.5) return 'Buen nivel de bienestar';
  if (score >= 5) return 'Nivel moderado, hay oportunidades de mejora';
  return 'Requiere atención inmediata';
};

const cargarDatosDashboard = async () => {
  try {
    await cargarEncuestas();
    
    // Simular datos del dashboard
    encuestasRecientes.value = encuestas.value.slice(0, 3).map(encuesta => ({
      ...encuesta,
      totalRespuestas: Math.floor(Math.random() * 50) + 10
    }));
    
    // Actualizar stats
    stats.value = {
      totalEmpleados: 50,
      encuestasActivas: encuestas.value.filter(e => e.estado === 'activa').length,
      tasaRespuesta: 85,
      wellnessScore: 7.2
    };
    
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los datos del dashboard',
      life: 4000
    });
  }
};

// Load data on mount
onMounted(() => {
  cargarDatosDashboard();
});
</script>

<style scoped>
/* Estilos específicos para el dashboard */
</style>