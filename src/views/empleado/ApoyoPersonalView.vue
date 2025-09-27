<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con navegación -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y título -->
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">
                  SMART<span class="text-primary">Bienestar</span>
                </h1>
                <p class="text-xs text-gray-500">Apoyo Profesional</p>
              </div>
            </div>
          </div>

          <!-- Navegación -->
          <div class="flex items-center space-x-4">
            <!-- Contador de Puntos -->
            <div class="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-lg border border-yellow-300">
              <svg class="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-sm font-bold text-yellow-800">{{ puntosUsuario }} Puntos</span>
            </div>
            
            <router-link 
              to="/empleado/encuesta"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Encuestas
            </router-link>
            <router-link 
              to="/empleado/actividades"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Actividades
            </router-link>
            <router-link 
              to="/empleado/apoyo-personal"
              class="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Apoyo Personal
            </router-link>
            <router-link 
              to="/empleado/recompensas"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Recompensas
            </router-link>
            
            <!-- Botón Cerrar Sesión -->
            <button
              @click="handleLogout"
              :disabled="loggingOut"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut class="w-4 h-4 mr-2" />
              <span class="hidden sm:inline">{{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
              <span class="sm:hidden">{{ loggingOut ? '...' : 'Salir' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="flex justify-center mb-6">
            <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart class="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Encuentra Apoyo Profesional</h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tu bienestar mental es nuestra prioridad. Conecta con profesionales especializados 
            en apoyo psicológico y coaching personal, disponibles cuando los necesites.
          </p>
        </div>

        <!-- Información de Confidencialidad -->
        <div class="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <Shield class="h-6 w-6 text-green-600 mt-1" />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-green-800 mb-2">100% Confidencial y Privado</h3>
              <div class="text-green-700 space-y-1 text-sm">
                <p>• <strong>Privacidad total:</strong> Tus sesiones son completamente confidenciales</p>
                <p>• <strong>Sin registro empresarial:</strong> Tu empresa no tiene acceso a los detalles de tus consultas</p>
                <p>• <strong>Profesionales certificados:</strong> Todos nuestros especialistas están debidamente acreditados</p>
                <p>• <strong>Flexible:</strong> Sesiones presenciales o virtuales según tu preferencia</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando especialistas disponibles...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar especialistas</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarEspecialistas" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="especialistas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <UserX class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay especialistas disponibles</h3>
          <p class="text-gray-500">Los especialistas aparecerán aquí cuando estén disponibles</p>
        </div>

        <!-- Especialistas Grid -->
        <div v-else>
          <!-- Filtros -->
          <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtrar Especialistas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="especialidad" class="block text-sm font-medium text-gray-700 mb-1">
                  Especialidad
                </label>
                <select
                  id="especialidad"
                  v-model="filtros.especialidad"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Todas las especialidades</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Coaching">Coaching</option>
                </select>
              </div>
              
              <div>
                <label for="modalidad" class="block text-sm font-medium text-gray-700 mb-1">
                  Modalidad Preferida
                </label>
                <select
                  id="modalidad"
                  v-model="filtros.modalidad"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="">Cualquier modalidad</option>
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
              
              <div class="flex items-end">
                <Button 
                  @click="limpiarFiltros"
                  variant="outline"
                  class="w-full"
                >
                  <RotateCcw class="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>

          <!-- Grid de Especialistas -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="especialista in especialistasFiltrados" 
              :key="especialista.id"
              class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <!-- Header con Foto -->
              <div class="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center">
                <div class="relative inline-block">
                  <img 
                    :src="especialista.foto" 
                    :alt="`Foto de ${especialista.nombre}`"
                    class="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                    @error="handleImageError"
                  />
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Check class="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h3 class="text-xl font-bold text-gray-900 mt-4 mb-1">
                  {{ especialista.nombre }} {{ especialista.apellido }}
                </h3>
                
                <div class="flex items-center justify-center mb-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {{ especialista.especialidad }}
                  </span>
                </div>
                
                <p class="text-sm text-gray-600 font-medium">{{ especialista.subespecialidad }}</p>
              </div>

              <!-- Contenido -->
              <div class="p-6">
                <!-- Calificación y Experiencia -->
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="flex">
                      <Star 
                        v-for="i in 5" 
                        :key="i"
                        :class="[
                          'h-4 w-4',
                          i <= Math.floor(especialista.calificacion) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        ]"
                      />
                    </div>
                    <span class="ml-2 text-sm font-medium text-gray-700">{{ especialista.calificacion }}</span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ especialista.experiencia }} años</p>
                    <p class="text-xs text-gray-500">de experiencia</p>
                  </div>
                </div>

                <!-- Biografía -->
                <div class="mb-6">
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ especialista.bio }}
                  </p>
                </div>

                <!-- Modalidades -->
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Modalidades Disponibles</h4>
                  <div class="flex space-x-2">
                    <span 
                      v-for="modalidad in especialista.modalidades" 
                      :key="modalidad"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Monitor v-if="modalidad === 'virtual'" class="h-3 w-3 mr-1" />
                      <Building v-else class="h-3 w-3 mr-1" />
                      {{ modalidad === 'virtual' ? 'Virtual' : 'Presencial' }}
                    </span>
                  </div>
                </div>

                <!-- Idiomas -->
                <div class="mb-6">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Idiomas</h4>
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="idioma in especialista.idiomas" 
                      :key="idioma"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {{ idioma }}
                    </span>
                  </div>
                </div>

                <!-- Precio -->
                <div class="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">Tarifa por sesión:</span>
                    <span class="text-lg font-bold text-gray-900">{{ especialista.tarifa }}€</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Cubierto por el programa de bienestar de tu empresa</p>
                </div>

                <!-- Botón de Acción -->
                <Button 
                  @click="verDisponibilidad(especialista.id)"
                  :loading="cargandoDisponibilidad === especialista.id"
                  class="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
                >
                  <Calendar class="h-4 w-4 mr-2" />
                  Ver Disponibilidad y Reservar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Info class="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-blue-900 mb-4">¿Cómo Funciona el Apoyo Personal?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span class="text-xl font-bold text-blue-600">1</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">Elige tu Especialista</h4>
                <p class="text-sm text-gray-600">Revisa los perfiles y elige el profesional que mejor se adapte a tus necesidades</p>
              </div>
              
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span class="text-xl font-bold text-green-600">2</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">Reserva tu Cita</h4>
                <p class="text-sm text-gray-600">Selecciona fecha, hora y modalidad (presencial o virtual) según tu disponibilidad</p>
              </div>
              
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span class="text-xl font-bold text-purple-600">3</span>
                </div>
                <h4 class="font-semibold text-gray-900 mb-2">Recibe Apoyo</h4>
                <p class="text-sm text-gray-600">Asiste a tu sesión y recibe el apoyo profesional que necesitas para tu bienestar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Disponibilidad (placeholder) -->
    <Dialog 
      v-model:visible="mostrarModalDisponibilidad" 
      modal 
      header="Disponibilidad y Reserva"
      :style="{ width: '600px' }"
    >
      <div v-if="especialistaSeleccionado" class="text-center py-8">
        <Calendar class="h-12 w-12 text-primary mx-auto mb-4" />
        <h4 class="text-lg font-medium text-gray-900 mb-2">
          Reservar cita con {{ especialistaSeleccionado.nombre }}
        </h4>
        <p class="text-gray-600 mb-4">
          Funcionalidad de reserva en desarrollo
        </p>
        <Button @click="mostrarModalDisponibilidad = false" variant="outline">
          Cerrar
        </Button>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useGamificacionStore } from '@/stores/gamificacion.store';
import { getEspecialistasSaludMental } from '@/services/mock/colaboradores.service';
import Button from '@/components/common/Button.vue';
import Dialog from 'primevue/dialog';
import { 
  Heart,
  LogOut,
  Shield,
  AlertCircle,
  RefreshCw,
  UserX,
  Calendar,
  Clock,
  Monitor,
  Building,
  Star,
  Check,
  Info,
  RotateCcw
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const gamificacionStore = useGamificacionStore();

// Store state
const { puntosUsuario } = storeToRefs(gamificacionStore);
const { cargarPuntos } = gamificacionStore;

// Local state
const especialistas = ref([]);
const loading = ref(true);
const error = ref(null);
const loggingOut = ref(false);
const cargandoDisponibilidad = ref(null);
const mostrarModalDisponibilidad = ref(false);
const especialistaSeleccionado = ref(null);

// Filtros
const filtros = ref({
  especialidad: '',
  modalidad: ''
});

// Computed properties
const empleadoActual = computed(() => ({
  id: authStore.user?.id || 'user-empleado-01',
  nombre: authStore.user?.name || 'Empleado Demo',
  email: authStore.user?.email || 'empleado@demo.com'
}));

const especialistasFiltrados = computed(() => {
  let resultado = [...especialistas.value];
  
  if (filtros.value.especialidad) {
    resultado = resultado.filter(e => e.especialidad === filtros.value.especialidad);
  }
  
  if (filtros.value.modalidad) {
    resultado = resultado.filter(e => e.modalidades.includes(filtros.value.modalidad));
  }
  
  return resultado;
});

// Methods
const cargarEspecialistas = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const especialistasData = await getEspecialistasSaludMental();
    especialistas.value = especialistasData;
  } catch (err) {
    error.value = err.message || 'Error al cargar los especialistas';
    console.error('Error cargando especialistas:', err);
  } finally {
    loading.value = false;
  }
};

const limpiarFiltros = () => {
  filtros.value = {
    especialidad: '',
    modalidad: ''
  };
};

const verDisponibilidad = (especialistaId) => {
  const especialista = especialistas.value.find(e => e.id === especialistaId);
  if (especialista) {
    especialistaSeleccionado.value = especialista;
    mostrarModalDisponibilidad.value = true;
    
    // Por ahora, mostrar mensaje informativo
    toast.add({
      severity: 'info',
      summary: 'Próximamente',
      detail: `La funcionalidad de reserva con ${especialista.nombre} estará disponible pronto`,
      life: 4000
    });
  }
};

const handleImageError = (event) => {
  // Fallback si la imagen no carga
  event.target.src = 'https://i.pravatar.cc/150?u=default';
};

const handleLogout = async () => {
  loggingOut.value = true;
  
  try {
    await authStore.logout();
    
    toast.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail: 'Has cerrado sesión correctamente',
      life: 3000
    });
    
    router.push('/login');
  } catch (error) {
    console.error('Error durante el logout:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cerrar la sesión',
      life: 4000
    });
  } finally {
    loggingOut.value = false;
  }
};

// Load data on mount
onMounted(() => {
  cargarEspecialistas();
  cargarPuntos(empleadoActual.value.id);
});
</script>

<style scoped>
.fill-current {
  fill: currentColor;
}

/* Animaciones suaves */
.transform {
  transition: transform 0.3s ease-in-out;
}

.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}
</style>