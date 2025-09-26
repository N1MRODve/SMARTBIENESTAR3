<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Persistente -->
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo SMART Bienestar -->
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">
                  SMART<span class="text-primary">Bienestar</span>
                </h1>
                <p class="text-xs text-gray-500">Portal del Empleado</p>
              </div>
            </div>
          </div>

          <!-- Información del Usuario y Botón Logout -->
          <div class="flex items-center space-x-4">
            <!-- Info del Usuario -->
            <div class="hidden sm:flex items-center space-x-3">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500">Empleado</p>
              </div>
            </div>

            <!-- Botón Cerrar Sesión -->
            <button
              @click="handleLogout"
              :disabled="loggingOut"
              class="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loggingOut" class="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="hidden sm:inline">{{ loggingOut ? 'Cerrando...' : 'Cerrar Sesión' }}</span>
              <span class="sm:hidden">{{ loggingOut ? '...' : 'Salir' }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Contenido Principal -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

// Estado local para el proceso de logout
const loggingOut = ref(false);

// Computed properties para información del usuario
const userName = computed(() => {
  return authStore.user?.name || 'Usuario Demo';
});

const userInitials = computed(() => {
  const name = userName.value;
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

// Función para manejar el logout
const handleLogout = async () => {
  loggingOut.value = true;
  
  try {
    // Llamar a la acción logout del store
    await authStore.logout();
    
    // Redirigir a la página de login
    router.push('/login');
    
    console.log('Logout completado, redirigiendo a login...');
  } catch (error) {
    console.error('Error durante el logout:', error);
  } finally {
    loggingOut.value = false;
  }
};
</script>

<style scoped>
/* Animación para el spinner de logout */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>