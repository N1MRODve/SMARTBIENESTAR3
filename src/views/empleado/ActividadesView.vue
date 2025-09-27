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
                <Calendar class="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">
                  SMART<span class="text-primary">Bienestar</span>
                </h1>
                <p class="text-xs text-gray-500">Actividades y Sesiones</p>
              </div>
            </div>
          </div>

          <!-- Navegación -->
          <div class="flex items-center space-x-4">
            <router-link 
              to="/empleado/encuesta"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Encuestas
            </router-link>
            <router-link 
              to="/empleado/actividades"
              class="bg-primary text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Actividades
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
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Actividades de Bienestar</h1>
          <p class="text-lg text-gray-600">Reserva tu plaza en las sesiones programadas</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando actividades...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las actividades</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarSesiones" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="sesiones.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay actividades programadas</h3>
          <p class="text-gray-500">Las actividades aparecerán aquí cuando sean programadas por el administrador</p>
        </div>

        <!-- Sesiones Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="sesion in sesiones" 
            :key="sesion.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <!-- Header de la Sesión -->
            <div class="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
              <h3 class="text-lg font-semibold mb-2">{{ sesion.titulo }}</h3>
              <div class="flex items-center text-primary-light text-sm">
                <Calendar class="h-4 w-4 mr-1" />
                <span>{{ formatearFecha(sesion.fecha) }}</span>
                <Clock class="h-4 w-4 ml-4 mr-1" />
                <span>{{ sesion.hora }}</span>
              </div>
            </div>

            <!-- Contenido de la Sesión -->
            <div class="p-6">
              <p v-if="sesion.descripcion" class="text-gray-600 mb-4 text-sm">
                {{ sesion.descripcion }}
              </p>

              <!-- Información de la Sesión -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <Clock class="h-4 w-4 mr-2" />
                    <span>Duración</span>
                  </div>
                  <span class="font-medium text-gray-900">{{ sesion.duracion }} min</span>
                </div>

                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <MapPin class="h-4 w-4 mr-2" />
                    <span>Modalidad</span>
                  </div>
                  <span class="font-medium text-gray-900 capitalize">{{ sesion.modalidad }}</span>
                </div>

                <div v-if="sesion.ubicacion" class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <Building class="h-4 w-4 mr-2" />
                    <span>Ubicación</span>
                  </div>
                  <span class="font-medium text-gray-900">{{ sesion.ubicacion }}</span>
                </div>

                <div v-if="sesion.instructor" class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <User class="h-4 w-4 mr-2" />
                    <span>Instructor</span>
                  </div>
                  <span class="font-medium text-gray-900">{{ sesion.instructor }}</span>
                </div>
              </div>

              <!-- Plazas Disponibles -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Plazas disponibles</span>
                  <span class="text-lg font-bold text-gray-900">
                    {{ getPlazasDisponibles(sesion) }}/{{ sesion.plazasTotales }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${getProgresoPorcentaje(sesion)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Estado de Reserva y Botón -->
              <div class="space-y-3">
                <!-- Si ya está reservado -->
                <div v-if="estaReservado(sesion)" class="text-center">
                  <div class="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200 mb-3">
                    <CheckCircle class="h-5 w-5 text-green-600 mr-2" />
                    <span class="text-green-800 font-medium">¡Plaza Reservada!</span>
                  </div>
                  <Button 
                    @click="cancelarReserva(sesion.id)"
                    variant="outline"
                    :loading="procesandoReserva === sesion.id"
                    class="w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X class="h-4 w-4 mr-2" />
                    Cancelar Reserva
                  </Button>
                </div>

                <!-- Si no está reservado -->
                <div v-else>
                  <Button 
                    @click="reservarPlaza(sesion.id)"
                    :loading="procesandoReserva === sesion.id"
                    :disabled="getPlazasDisponibles(sesion) === 0 || esSesionPasada(sesion)"
                    class="w-full"
                  >
                    <template v-if="getPlazasDisponibles(sesion) === 0">
                      <UserX class="h-4 w-4 mr-2" />
                      Sin Plazas Disponibles
                    </template>
                    <template v-else-if="esSesionPasada(sesion)">
                      <Clock class="h-4 w-4 mr-2" />
                      Sesión Finalizada
                    </template>
                    <template v-else>
                      <UserPlus class="h-4 w-4 mr-2" />
                      Reservar Plaza
                    </template>
                  </Button>
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
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useSesionesStore } from '@/stores/sesiones.store';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/common/Button.vue';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building,
  User,
  CheckCircle,
  X,
  UserPlus,
  UserX,
  AlertCircle,
  RefreshCw,
  LogOut
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const sesionesStore = useSesionesStore();
const authStore = useAuthStore();

// Store state
const { sesiones, loading, error } = storeToRefs(sesionesStore);
const { cargarSesiones, reservarPlazaSesion, cancelarReservaSesion } = sesionesStore;

// Local state
const procesandoReserva = ref(null);
const loggingOut = ref(false);

// Computed properties
const empleadoActual = computed(() => ({
  id: authStore.user?.id || 'user-empleado-01',
  nombre: authStore.user?.name || 'Empleado Demo',
  email: authStore.user?.email || 'empleado@demo.com'
}));

// Methods
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getPlazasDisponibles = (sesion) => {
  return sesion.plazasTotales - sesion.participantes.length;
};

const getProgresoPorcentaje = (sesion) => {
  return (sesion.participantes.length / sesion.plazasTotales) * 100;
};

const estaReservado = (sesion) => {
  return sesion.participantes.some(p => p.id === empleadoActual.value.id);
};

const esSesionPasada = (sesion) => {
  const fechaSesion = new Date(`${sesion.fecha}T${sesion.hora}`);
  return fechaSesion < new Date();
};

const reservarPlaza = async (sesionId) => {
  procesandoReserva.value = sesionId;
  
  try {
    await reservarPlazaSesion(sesionId, empleadoActual.value);
    
    toast.add({
      severity: 'success',
      summary: '¡Plaza reservada!',
      detail: 'Tu plaza ha sido reservada exitosamente',
      life: 4000
    });
    
  } catch (error) {
    console.error('Error al reservar plaza:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al reservar',
      detail: error.message || 'No se pudo reservar la plaza',
      life: 5000
    });
  } finally {
    procesandoReserva.value = null;
  }
};

const cancelarReserva = async (sesionId) => {
  procesandoReserva.value = sesionId;
  
  try {
    await cancelarReservaSesion(sesionId, empleadoActual.value.id);
    
    toast.add({
      severity: 'info',
      summary: 'Reserva cancelada',
      detail: 'Tu reserva ha sido cancelada correctamente',
      life: 4000
    });
    
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al cancelar',
      detail: error.message || 'No se pudo cancelar la reserva',
      life: 5000
    });
  } finally {
    procesandoReserva.value = null;
  }
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
  cargarSesiones();
});
</script>

<style scoped>
.text-primary-light {
  color: rgba(255, 255, 255, 0.8);
}
</style>