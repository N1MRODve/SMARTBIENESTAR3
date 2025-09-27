<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import { useGamificacionStore } from '@/stores/gamificacion.store';
import { LogOut } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const gamificacionStore = useGamificacionStore();

// Store state
const { puntosUsuario } = storeToRefs(gamificacionStore);
const { cargarPuntos } = gamificacionStore;

// Local state
const loggingOut = ref(false);

// Computed properties
const empleadoActual = computed(() => ({
  id: authStore.user?.id || 'user-empleado-01',
  nombre: authStore.user?.name || 'Empleado Demo',
  email: authStore.user?.email || 'empleado@demo.com'
}));

// Methods
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
  cargarPuntos(empleadoActual.value.id);
});
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 flex-shrink-0 bg-white border-r">
      <div class="p-4 border-b">
        <h1 class="text-xl font-bold text-primary">SMART Bienestar</h1>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/empleado/dashboard" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/actividades" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Actividades</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/apoyo-personal" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Apoyo Personal</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/recompensas" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100" active-class="bg-gray-200 font-bold">
              <span class="ml-3">Recompensas</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <h2 class="text-xl font-semibold">Bienvenido, {{ empleadoActual.nombre }}</h2>
        <div class="flex items-center space-x-4">
          <!-- Contador de Puntos -->
          <div class="flex items-center bg-white/20 px-3 py-2 rounded-lg">
            <svg class="w-5 h-5 text-yellow-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="text-sm font-bold text-white">{{ puntosUsuario }} Puntos</span>
          </div>
          
          <button 
            @click="handleLogout"
            :disabled="loggingOut"
            class="inline-flex items-center px-3 py-2 bg-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut class="w-4 h-4 mr-2" />
            <span>{{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
          </button>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el enlace activo en el menú */
.router-link-exact-active {
  background-color: #f3f4f6; /* bg-gray-100 */
  font-weight: 600; /* semibold */
  color: rgb(var(--color-primary)); /* text-primary */
}
</style>