<script setup>
import { useAuthStore } from '@/stores/auth.store.js'; // <-- RUTA CORREGIDA CON ALIAS
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { Menu, LogOut } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

// --- Explicación de 'defineEmits' ---
// Un componente hijo (como TheHeader) se comunica con su padre (AdminLayout)
// emitiendo eventos. Aquí declaramos que este componente puede emitir un
// evento llamado 'toggle-sidebar'.
const emit = defineEmits(['toggle-sidebar']);

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
    toast.add({ severity: 'success', summary: 'Sesión Cerrada', detail: 'Has cerrado sesión correctamente.', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar la sesión.', life: 3000 });
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-20">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <button 
        @click="$emit('toggle-sidebar')" 
        class="lg:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
      >
        <Menu class="w-6 h-6" />
      </button>

      <div class="flex-1"></div>

      <div class="flex items-center">
        <Button variant="outline" size="sm" @click="logout">
          <LogOut class="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  </header>
</template>