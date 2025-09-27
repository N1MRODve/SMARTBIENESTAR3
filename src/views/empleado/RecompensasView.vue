<template>
  <div class="space-y-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Catálogo de Recompensas</h1>
            <p class="text-lg text-gray-600 mb-6">Canjea tus puntos de bienestar por increíbles recompensas</p>
            
            <!-- Saldo de Puntos Prominente -->
            <div class="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl shadow-lg">
              <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-white/80">Tu saldo actual</p>
                <p class="text-3xl font-bold">{{ puntosUsuario }} Puntos</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando catálogo de recompensas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar las recompensas</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <Button @click="cargarRecompensas" variant="outline">
            <RefreshCw class="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>

        <!-- Empty State -->
        <div v-else-if="recompensas.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
          <Gift class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay recompensas disponibles</h3>
          <p class="text-gray-500">El catálogo de recompensas se actualizará pronto</p>
        </div>

        <!-- Catálogo de Recompensas -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="recompensa in recompensas" 
            :key="recompensa.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <!-- Header de la Recompensa -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 text-center">
          <router-link 
            to="/empleado/apoyo-personal"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Apoyo Personal
          </router-link>
              <div class="text-4xl mb-3">{{ recompensa.icono }}</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ recompensa.titulo }}</h3>
              <p class="text-sm text-gray-600">{{ recompensa.descripcion }}</p>
            </div>

            <!-- Contenido de la Recompensa -->
            <div class="p-6">
              <!-- Coste en Puntos -->
              <div class="text-center mb-6">
                <div class="inline-flex items-center bg-primary/10 px-4 py-2 rounded-full">
                  <svg class="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-2xl font-bold text-primary">{{ recompensa.coste }}</span>
                  <span class="text-sm text-primary ml-1">puntos</span>
                </div>
              </div>

              <!-- Información Adicional -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <Tag class="h-4 w-4 mr-2" />
                    <span>Categoría</span>
                  </div>
                  <span class="font-medium text-gray-900 capitalize">{{ recompensa.categoria }}</span>
                </div>

                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center text-gray-500">
                    <Star class="h-4 w-4 mr-2" />
                    <span>Popularidad</span>
                  </div>
                  <div class="flex">
                    <Star 
                      v-for="i in 5" 
                      :key="i"
                      :class="[
                        'h-4 w-4',
                        i <= recompensa.popularidad ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      ]"
                    />
                  </div>
                </div>
              </div>

              <!-- Estado y Botón de Canje -->
              <div class="space-y-3">
                <!-- Indicador de Puntos Suficientes/Insuficientes -->
                <div v-if="puntosUsuario < recompensa.coste" class="text-center">
                  <div class="flex items-center justify-center p-3 bg-red-50 rounded-lg border border-red-200 mb-3">
                    <AlertCircle class="h-5 w-5 text-red-600 mr-2" />
                    <span class="text-red-800 font-medium text-sm">
                      Te faltan {{ recompensa.coste - puntosUsuario }} puntos
                    </span>
                  </div>
                </div>

                <!-- Botón de Canje -->
                <Button 
                  @click="canjearRecompensa(recompensa.id)"
                  :loading="canjeandoId === recompensa.id"
                  :disabled="puntosUsuario < recompensa.coste || !recompensa.disponible"
                  class="w-full"
                  :class="{
                    'opacity-50 cursor-not-allowed': puntosUsuario < recompensa.coste
                  }"
                >
                  <template v-if="!recompensa.disponible">
                    <X class="h-4 w-4 mr-2" />
                    No Disponible
                  </template>
                  <template v-else-if="puntosUsuario < recompensa.coste">
                    <Lock class="h-4 w-4 mr-2" />
                    Puntos Insuficientes
                  </template>
                  <template v-else>
                    <ShoppingCart class="h-4 w-4 mr-2" />
                    Canjear Ahora
                  </template>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Adicional -->
        <div class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start">
            <Info class="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 class="text-lg font-medium text-blue-900 mb-2">¿Cómo ganar más puntos?</h4>
              <ul class="text-blue-800 space-y-1 text-sm">
                <li>• <strong>+10 puntos</strong> por completar cada encuesta de bienestar</li>
                <li>• <strong>+25 puntos</strong> por reservar una sesión de bienestar</li>
                <li>• <strong>+50 puntos</strong> por asistir a una sesión programada</li>
              </ul>
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
import { useRecompensasStore } from '@/stores/recompensas.store';
import { useAuthStore } from '@/stores/auth.store';
import { useGamificacionStore } from '@/stores/gamificacion.store';
import Button from '@/components/common/Button.vue';
import { 
  Gift,
  LogOut,
  AlertCircle,
  RefreshCw,
  Tag,
  Star,
  X,
  Lock,
  ShoppingCart,
  Info
} from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const recompensasStore = useRecompensasStore();
const authStore = useAuthStore();
const gamificacionStore = useGamificacionStore();

// Store state
const { recompensas, loading, error } = storeToRefs(recompensasStore);
const { puntosUsuario } = storeToRefs(gamificacionStore);
const { cargarRecompensas, realizarCanje } = recompensasStore;
const { cargarPuntos } = gamificacionStore;

// Local state
const canjeandoId = ref(null);
const loggingOut = ref(false);

// Computed properties
const empleadoActual = computed(() => ({
  id: authStore.user?.id || 'user-empleado-01',
  nombre: authStore.user?.name || 'Empleado Demo',
  email: authStore.user?.email || 'empleado@demo.com'
}));

// Methods
const canjearRecompensa = async (recompensaId) => {
  const recompensa = recompensas.value.find(r => r.id === recompensaId);
  if (!recompensa) return;

  // Verificación adicional de puntos
  if (puntosUsuario.value < recompensa.coste) {
    toast.add({
      severity: 'warn',
      summary: 'Puntos insuficientes',
      detail: `Necesitas ${recompensa.coste} puntos para canjear "${recompensa.titulo}"`,
      life: 4000
    });
    return;
  }

  canjeandoId.value = recompensaId;
  
  try {
    const resultado = await realizarCanje(empleadoActual.value.id, recompensaId);
    
    if (resultado.success) {
      // Actualizar puntos del usuario
      await cargarPuntos(empleadoActual.value.id);
      
      toast.add({
        severity: 'success',
        summary: '¡Recompensa canjeada!',
        detail: resultado.mensaje,
        life: 5000
      });
    }
    
  } catch (error) {
    console.error('Error al canjear recompensa:', error);
    toast.add({
      severity: 'error',
      summary: 'Error en el canje',
      detail: error.message || 'No se pudo procesar el canje',
      life: 5000
    });
  } finally {
    canjeandoId.value = null;
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
  cargarRecompensas();
  cargarPuntos(empleadoActual.value.id);
});
</script>

<style scoped>
/* Estilos específicos para el catálogo de recompensas */
.fill-current {
  fill: currentColor;
}
</style>