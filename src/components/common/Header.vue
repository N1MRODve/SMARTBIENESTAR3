<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo y título -->
        <div class="flex items-center">
          <ActivitySquare class="h-8 w-8 text-primary mr-3" />
          <div>
            <h1 class="text-xl font-bold text-gray-900">
              SMART<span class="text-primary">Bienestar</span>
            </h1>
            <p class="text-xs text-gray-500">{{ subtitulo }}</p>
          </div>
        </div>

        <!-- Información del usuario y acciones -->
        <div class="flex items-center space-x-4">
          <!-- Info del usuario -->
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span class="text-white font-medium text-sm">
                {{ iniciales }}
              </span>
            </div>
            <div class="hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ nombreUsuario }}</p>
              <p class="text-xs text-gray-500">{{ rolUsuario }}</p>
            </div>
          </div>

          <!-- Botón Reiniciar Demo -->
          <Button
            @click="handleResetDemo"
            variant="outline"
            :loading="resetting"
            class="text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            <RotateCcw class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Reiniciar Demo</span>
            <span class="sm:hidden">Reset</span>
          </Button>

          <!-- Botón Cerrar Sesión -->
          <Button
            @click="handleLogout"
            variant="outline"
            class="text-red-600 border-red-300 hover:bg-red-50"
          >
            <LogOut class="h-4 w-4 mr-2" />
            <span class="hidden sm:inline">Cerrar Sesión</span>
            <span class="sm:hidden">Salir</span>
          </Button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth.store';
import { useDemoStore } from '@/stores/demo.store';
import Button from './Button.vue';
import { ActivitySquare, RotateCcw, LogOut } from 'lucide-vue-next';

const props = defineProps({
  subtitulo: {
    type: String,
    default: 'Plataforma de Bienestar Corporativo'
  }
});

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const demoStore = useDemoStore();

const resetting = ref(false);

// Computed properties para información del usuario
const nombreUsuario = computed(() => {
  return authStore.user?.name || 'Usuario Demo';
});

const rolUsuario = computed(() => {
  const roles = {
    'administrador': 'Administrador',
    'empleado': 'Empleado'
  };
  return roles[authStore.userRole] || 'Usuario';
});

const iniciales = computed(() => {
  const name = nombreUsuario.value;
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

// Métodos
const handleResetDemo = async () => {
  resetting.value = true;
  
  try {
    await demoStore.resetDemo();
    
    toast.add({
      severity: 'success',
      summary: '¡Demo Reseteada!',
      detail: 'La aplicación ha vuelto a su estado inicial',
      life: 4000
    });

    // Recargar la página para reflejar los cambios
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('Error al resetear demo:', error);
    toast.add({
      severity: 'error',
      summary: 'Error al resetear',
      detail: 'No se pudo resetear la demo. Intenta de nuevo.',
      life: 5000
    });
  } finally {
    resetting.value = false;
  }
};

const handleLogout = async () => {
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
    console.error('Error al cerrar sesión:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cerrar la sesión',
      life: 4000
    });
  }
};
</script>