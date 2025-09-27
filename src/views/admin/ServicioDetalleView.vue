<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <Header subtitulo="Detalle del Servicio" />
    
    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando detalles del servicio...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar el servicio</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <div class="flex justify-center space-x-4">
            <Button @click="cargarServicio" variant="outline">
              <RefreshCw class="h-4 w-4 mr-2" />
              Reintentar
            </Button>
            <Button @click="volverAtras" variant="outline">
              <ArrowLeft class="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>

        <!-- Service Detail Content -->
        <div v-else-if="servicio" class="space-y-8">
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
                  <span class="text-sm font-medium text-gray-500">Servicios</span>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRight class="h-5 w-5 text-gray-400 mr-4" />
                  <span class="text-sm font-medium text-gray-900">{{ servicio.titulo }}</span>
                </div>
              </li>
            </ol>
          </nav>

          <!-- Hero Section -->
          <div class="bg-gradient-to-r from-primary to-primary-dark rounded-2xl shadow-xl overflow-hidden">
            <div class="px-8 py-12 text-white">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-4">
                    <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Zap class="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2">
                        Servicio de Bienestar
                      </span>
                    </div>
                  </div>
                  <h1 class="text-4xl font-bold mb-4">{{ servicio.titulo }}</h1>
                  <p class="text-xl text-white/90 leading-relaxed max-w-3xl">
                    {{ servicio.descripcion }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Details -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Beneficios -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center mb-6">
                  <CheckCircle class="h-6 w-6 text-green-600 mr-3" />
                  <h2 class="text-2xl font-bold text-gray-900">Beneficios para tu Equipo</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="(beneficio, index) in servicio.beneficios" 
                    :key="index"
                    class="flex items-start p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div class="flex-shrink-0 mr-3">
                      <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <Check class="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <p class="text-sm text-green-800 font-medium">{{ beneficio }}</p>
                  </div>
                </div>
              </div>

              <!-- Detalles del Servicio -->
              <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex items-center mb-6">
                  <Info class="h-6 w-6 text-blue-600 mr-3" />
                  <h2 class="text-2xl font-bold text-gray-900">Detalles del Servicio</h2>
                </div>
                <div class="space-y-6">
                  <!-- Impartido por -->
                  <div class="flex items-start">
                    <User class="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-1">Impartido por</h3>
                      <p class="text-gray-600">{{ servicio.impartidoPor }}</p>
                    </div>
                  </div>

                  <!-- Duración -->
                  <div class="flex items-start">
                    <Clock class="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-1">Duración</h3>
                      <p class="text-gray-600">{{ servicio.duracion }}</p>
                    </div>
                  </div>

                  <!-- Modalidad -->
                  <div class="flex items-start">
                    <Monitor class="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-1">Modalidad</h3>
                      <p class="text-gray-600">{{ servicio.modalidad }}</p>
                    </div>
                  </div>

                  <!-- Disponibilidad -->
                  <div class="flex items-start">
                    <Calendar class="h-5 w-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-1">Disponibilidad</h3>
                      <p class="text-gray-600">{{ servicio.disponibilidad }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column - Action Card -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div class="text-center mb-6">
                  <div class="text-3xl font-bold text-gray-900 mb-2">{{ servicio.precio }}</div>
                  <p class="text-sm text-gray-500">Precio orientativo</p>
                </div>

                <div class="space-y-4 mb-6">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Modalidad:</span>
                    <span class="font-medium text-gray-900">{{ servicio.modalidad }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Duración:</span>
                    <span class="font-medium text-gray-900">{{ servicio.duracion }}</span>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">Disponibilidad:</span>
                    <span class="font-medium text-green-600">{{ servicio.disponibilidad }}</span>
                  </div>
                </div>

                <!-- Botón Principal de Acción -->
                <Button 
                  @click="solicitarServicio"
                  :loading="solicitando"
                  class="w-full text-lg py-4 mb-4"
                >
                  <Send class="h-5 w-5 mr-2" />
                  Solicitar este Servicio
                </Button>

                <Button 
                  @click="contactarEspecialista"
                  variant="outline"
                  class="w-full"
                >
                  <MessageCircle class="h-4 w-4 mr-2" />
                  Contactar Especialista
                </Button>

                <!-- Información adicional -->
                <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div class="flex items-start">
                    <Info class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 class="text-sm font-medium text-blue-800 mb-1">¿Necesitas más información?</h4>
                      <p class="text-sm text-blue-700">
                        Nuestro equipo puede personalizar este servicio según las necesidades específicas de tu empresa.
                      </p>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getServicioById } from '@/services/mock/servicios.service.js';
import Header from '@/components/common/Header.vue';
import Button from '@/components/common/Button.vue';
import { 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight,
  Zap,
  CheckCircle,
  Check,
  Info,
  User,
  Clock,
  Monitor,
  Calendar,
  Send,
  MessageCircle
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Estado reactivo
const servicio = ref(null);
const loading = ref(true);
const error = ref(null);
const solicitando = ref(false);

// Métodos
const cargarServicio = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const servicioId = route.params.id;
    const servicioData = await getServicioById(servicioId);
    servicio.value = servicioData;
  } catch (err) {
    error.value = err.message || 'Error al cargar el servicio';
    console.error('Error cargando servicio:', err);
  } finally {
    loading.value = false;
  }
};

const volverAtras = () => {
  router.back();
};

const solicitarServicio = async () => {
  solicitando.value = true;
  
  try {
    // Simular proceso de solicitud
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.add({
      severity: 'success',
      summary: '¡Solicitud Enviada!',
      detail: `Tu solicitud para "${servicio.value.titulo}" ha sido enviada. Nos contactaremos contigo pronto.`,
      life: 6000
    });
    
    // Opcional: redirigir a una página de confirmación
    // router.push('/admin/solicitudes');
    
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error al enviar solicitud',
      detail: 'No se pudo procesar tu solicitud. Intenta de nuevo.',
      life: 5000
    });
  } finally {
    solicitando.value = false;
  }
};

const contactarEspecialista = () => {
  toast.add({
    severity: 'info',
    summary: 'Contactando especialista',
    detail: 'Te redirigiremos al formulario de contacto especializado.',
    life: 4000
  });
  
  // Aquí podrías abrir un modal de contacto o redirigir
  console.log('Contactar especialista para:', servicio.value.titulo);
};

// Cargar servicio al montar el componente
onMounted(() => {
  cargarServicio();
});
</script>

<style scoped>
/* Estilos específicos para la vista de detalle */
.sticky {
  position: sticky;
}
</style>