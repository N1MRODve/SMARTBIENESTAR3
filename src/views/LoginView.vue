<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { useToast } from 'primevue/usetoast';

// Íconos
import { Mail, Lock, ActivitySquare, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// Estados reactivos del formulario
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Computed para validar el formulario
const isFormValid = computed(() => {
  return email.value.trim() && password.value.trim();
});

const handleLogin = async () => {
  // Limpiar errores previos
  error.value = '';
  loading.value = true;
  
  try {
    // Llamar a la acción de login del store
    const userRole = await authStore.login(email.value.trim(), password.value);
    
    // Mostrar mensaje de éxito
    toast.add({ 
      severity: 'success', 
      summary: '¡Bienvenido!', 
      detail: 'Has iniciado sesión correctamente.', 
      life: 3000 
    });

    // Redirigir según el rol obtenido del store
    if (userRole === 'administrador') {
      router.push('/admin/dashboard');
    } else if (userRole === 'empleado') {
      router.push('/empleado/encuesta');
    } else {
      // Fallback en caso de rol desconocido
      error.value = 'Rol de usuario no reconocido';
    }

  } catch (loginError) {
    console.error("Error en el inicio de sesión:", loginError);
    
    // Mostrar error en el formulario
    error.value = loginError.message || 'Usuario o contraseña incorrectos';
    
    // También mostrar toast de error
    toast.add({ 
      severity: 'error', 
      summary: 'Error de Autenticación', 
      detail: error.value, 
      life: 5000 
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header con Logo -->
        <div class="text-center py-8 px-8 bg-gradient-to-r from-primary to-primary-dark">
          <div class="flex justify-center mb-6">
            <ActivitySquare class="h-16 w-16 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">
            SMART<span class="text-accent">Bienestar</span>
          </h1>
          <p class="text-white/80">Plataforma de gestión del bienestar corporativo</p>
        </div>

        <!-- Formulario -->
        <div class="p-8">
          <!-- Credenciales de prueba -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Credenciales de Prueba</h3>
            <div class="text-xs text-blue-700 space-y-1">
              <p><strong>Admin:</strong> admin@demo.com / cualquier contraseña</p>
              <p><strong>Empleado:</strong> empleado@demo.com / cualquier contraseña</p>
            </div>
          </div>

          <!-- Mensaje de Error -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center">
              <AlertCircle class="h-5 w-5 text-red-500 mr-2" />
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- Formulario de Login -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Campo Email -->
            <div class="form-group">
              <label for="email" class="form-label">Correo electrónico</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="email" 
                  v-model="email"
                  type="email" 
                  class="input pl-10" 
                  placeholder="correo@empresa.com" 
                  required 
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Campo Contraseña -->
            <div class="form-group">
              <label for="password" class="form-label">Contraseña</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="password" 
                  v-model="password"
                  type="password" 
                  class="input pl-10" 
                  placeholder="••••••••" 
                  required 
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Botón de Envío -->
            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="w-full btn btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
              <span v-else>Ingresar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos para el formulario de login */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.input {
  @apply w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed;
}

.input:focus {
  @apply shadow-sm;
}

/* Animación para el spinner de carga */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>