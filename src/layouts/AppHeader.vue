<template>
  <header class="bg-white shadow-sm">
    <div class="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center">
        <button
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Menu, LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import Button from '../common/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

defineEmits(['toggle-sidebar']);
</script>