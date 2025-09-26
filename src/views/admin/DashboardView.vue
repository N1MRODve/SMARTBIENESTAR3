<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Panel de Administración" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Panel de Encuestas</h1>
              <p class="mt-2 text-lg text-gray-600">Gestiona las encuestas de bienestar de tu empresa</p>
            </div>
            <router-link 
              to="/admin/crear-encuesta"
              class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Plus class="h-5 w-5 mr-2" />
              Crear Nueva Encuesta
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando encuestas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las encuestas</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchAllSurveys" 
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="surveys.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aún no has creado ninguna encuesta</h3>
          <p class="text-gray-500 mb-6">¡Crea la primera encuesta de bienestar para tus empleados!</p>
          <router-link 
            to="/admin/crear-encuesta"
            class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus class="h-5 w-5 mr-2" />
            Crear Primera Encuesta
          </router-link>
        </div>

        <!-- Encuestas Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="survey in surveys" 
            :key="survey.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <!-- Card Header -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                  {{ survey.titulo }}
                </h3>
                <span 
                  v-if="survey.estado === 'activa'"
                  class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                >
                  Activa
                </span>
                <span 
                  v-else-if="survey.estado === 'finalizada'"
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                >
                  Finalizada
                </span>
                <span 
                  v-else
                  class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
                >
                  {{ survey.estado }}
                </span>
              </div>
              
              <p v-if="survey.descripcion" class="text-sm text-gray-600 line-clamp-2 mb-4">
                {{ survey.descripcion }}
              </p>

              <div class="flex items-center text-sm text-gray-500">
                <Calendar class="h-4 w-4 mr-1" />
                <span>Creada el {{ formatearFecha(survey.fechaCreacion) }}</span>
              </div>
            </div>

            <!-- Card Body - Stats -->
            <div class="p-6">
              <div class="space-y-4">
                <!-- Respuestas -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <MessageSquare class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Respuestas recibidas</span>
                  </div>
                  <span class="text-lg font-semibold text-gray-900">
                    {{ survey.respuestas?.length || 0 }}
                  </span>
                </div>

                <!-- Preguntas -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <HelpCircle class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Preguntas</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ survey.preguntas?.length || 0 }}
                  </span>
                </div>

                <!-- Estado -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <Activity class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Estado</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900 capitalize">
                    {{ survey.estado }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Footer - Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div class="flex justify-between items-center">
                <router-link
                  :to="`/admin/encuesta/${survey.id}/resultados`"
                  class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <Eye class="h-4 w-4 mr-1" />
                  Ver Detalles
                </router-link>
                
                <div class="flex space-x-2">
                  <button 
                    v-if="survey.estado === 'activa'"
                    class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    @click="$router.push(`/admin/encuesta/${survey.id}/resultados`)"
                  >
                    <BarChart3 class="h-4 w-4 mr-1" />
                    Resultados
                  </button>
                  
                  <button 
                    class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    @click="editarEncuesta(survey.id)"
                  >
                    <Edit class="h-4 w-4 mr-1" />
                    Editar
                  </button>
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Header from '@/components/common/Header.vue';
import { Plus, FileText, AlertCircle, RefreshCw, Calendar, MessageSquare, HelpCircle, Activity, Eye, BarChart3, CreditCard as Edit } from 'lucide-vue-next';

// --- Lógica del Store ---
const encuestasStore = useEncuestasStore();
const { surveys, isLoading, error } = storeToRefs(encuestasStore);
const { fetchAllSurveys } = encuestasStore;

// --- Cargar datos al montar el componente ---
onMounted(() => {
  fetchAllSurveys();
});

// --- Funciones auxiliares ---
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const editarEncuesta = (surveyId) => {
  console.log('Editar encuesta:', surveyId);
  // TODO: Implementar navegación a edición
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>