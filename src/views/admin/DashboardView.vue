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
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
            <p class="mt-2 text-lg text-gray-600">Gestiona las encuestas de bienestar de tu empresa</p>
          </div>
          <Button 
            @click="navegarACrearEncuesta"
            class="bg-primary hover:bg-primary-dark"
          >
            <Plus class="h-5 w-5 mr-2" />
            Nueva Encuesta
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
              <FileText class="h-6 w-6 text-blue-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Encuestas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ encuestas.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
              <CheckCircle class="h-6 w-6 text-green-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Encuestas Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ encuestasActivas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-full">
              <Users class="h-6 w-6 text-yellow-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Respuestas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalRespuestas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
              <TrendingUp class="h-6 w-6 text-purple-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tasa Participación</p>
              <p class="text-2xl font-semibold text-gray-900">{{ tasaParticipacion }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando encuestas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las encuestas</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="cargarDatos" variant="outline">
          <RefreshCw class="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>

      <!-- Encuestas Grid -->
      <div v-else-if="encuestas && encuestas.length > 0" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-900">Mis Encuestas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="encuesta in encuestas" 
            :key="encuesta.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <!-- Card Header -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                  {{ encuesta.titulo }}
                </h3>
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getEstadoClasses(encuesta.estado)
                  ]"
                >
                  {{ getEstadoTexto(encuesta.estado) }}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 line-clamp-2 mb-4">
                {{ encuesta.descripcion }}
              </p>

              <div class="flex items-center text-sm text-gray-500">
                <Calendar class="h-4 w-4 mr-1" />
                <span>Creada el {{ formatearFecha(encuesta.fechaCreacion) }}</span>
              </div>
            </div>

            <!-- Card Body - Stats -->
            <div class="p-6">
              <div class="space-y-4">
                <!-- Respuestas -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <MessageSquare class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Respuestas</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-semibold text-gray-900">
                      {{ encuesta.totalRespuestas }}
                    </span>
                    <span class="text-sm text-gray-500">
                      / {{ encuesta.totalEmpleados }}
                    </span>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${getProgreso(encuesta)}%` }"
                  ></div>
                </div>

                <!-- Preguntas -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <HelpCircle class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Preguntas</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ encuesta.preguntas }}
                  </span>
                </div>

                <!-- Tasa de Participación -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <BarChart3 class="h-4 w-4 text-gray-400 mr-2" />
                    <span class="text-sm text-gray-600">Participación</span>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ getProgreso(encuesta) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Footer - Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div class="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  @click="verDetalles(encuesta.id)"
                >
                  <Eye class="h-4 w-4 mr-1" />
                  Ver Detalles
                </Button>
                
                <div class="flex space-x-2">
                  <Button 
                    v-if="encuesta.estado === 'borrador'"
                    variant="outline" 
                    size="sm"
                    @click="editarEncuesta(encuesta.id)"
                  >
                    <Edit class="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button 
                    v-if="encuesta.estado === 'activa'"
                    variant="outline" 
                    size="sm"
                    @click="verResultados(encuesta.id)"
                  >
                    <BarChart3 class="h-4 w-4 mr-1" />
                    Resultados
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg shadow-sm p-12 text-center">
        <FileText class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay encuestas creadas</h3>
        <p class="text-gray-500 mb-6">Comienza creando tu primera encuesta de bienestar</p>
        <Button @click="navegarACrearEncuesta">
          <Plus class="h-5 w-5 mr-2" />
          Crear Primera Encuesta
        </Button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useEncuestasStore } from '@/stores/encuestas.store';
import Button from '@/components/ui/Button.vue';
import Header from '@/components/common/Header.vue';
import { Plus, FileText, CheckCircle, Users, TrendingUp, AlertCircle, RefreshCw, Calendar, MessageSquare, HelpCircle, BarChart3, Eye, CreditCard as Edit } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const encuestasStore = useEncuestasStore();

// Estados reactivos
const { encuestas, loading, error } = storeToRefs(encuestasStore);

// Computed properties para estadísticas
const encuestasActivas = computed(() => {
  return (encuestas.value || []).filter(e => e.estado === 'activa').length;
});

const totalRespuestas = computed(() => {
  return (encuestas.value || []).reduce((total, encuesta) => total + encuesta.totalRespuestas, 0);
});

const tasaParticipacion = computed(() => {
  if (!encuestas.value || encuestas.value.length === 0) return 0;
  
  const totalPosiblesRespuestas = (encuestas.value || []).reduce((total, encuesta) => {
    return total + (encuesta.estado === 'activa' ? encuesta.totalEmpleados : 0);
  }, 0);
  
  const totalRespuestasActivas = (encuestas.value || []).reduce((total, encuesta) => {
    return total + (encuesta.estado === 'activa' ? encuesta.totalRespuestas : 0);
  }, 0);
  
  return totalPosiblesRespuestas > 0 ? Math.round((totalRespuestasActivas / totalPosiblesRespuestas) * 100) : 0;
});

// Métodos
const cargarDatos = async () => {
  await encuestasStore.cargarEncuestas();
};

const navegarACrearEncuesta = () => {
  router.push('/admin/crear-encuesta');
  
  // Feedback visual para confirmar navegación
  toast.add({
    severity: 'info',
    summary: 'Navegando...',
    detail: 'Redirigiendo a crear nueva encuesta',
    life: 2000
  });
};

const getEstadoClasses = (estado) => {
  const classes = {
    'activa': 'bg-green-100 text-green-800',
    'finalizada': 'bg-blue-100 text-blue-800',
    'borrador': 'bg-yellow-100 text-yellow-800',
    'pausada': 'bg-gray-100 text-gray-800'
  };
  return classes[estado] || 'bg-gray-100 text-gray-800';
};

const getEstadoTexto = (estado) => {
  const textos = {
    'activa': 'Activa',
    'finalizada': 'Finalizada',
    'borrador': 'Borrador',
    'pausada': 'Pausada'
  };
  return textos[estado] || 'Desconocido';
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getProgreso = (encuesta) => {
  if (encuesta.totalEmpleados === 0) return 0;
  return Math.round((encuesta.totalRespuestas / encuesta.totalEmpleados) * 100);
};

const verDetalles = (encuestaId) => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad en desarrollo',
    detail: `Ver detalles de encuesta ${encuestaId}`,
    life: 3000
  });
};

const editarEncuesta = (encuestaId) => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad en desarrollo',
    detail: `Editar encuesta ${encuestaId}`,
    life: 3000
  });
};

const verResultados = (encuestaId) => {
  toast.add({
    severity: 'info',
    summary: 'Funcionalidad en desarrollo',
    detail: `Ver resultados de encuesta ${encuestaId}`,
    life: 3000
  });
};

// Lifecycle
onMounted(() => {
  cargarDatos();
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