<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { useAdminStore } from '@/stores/admin.js';
import { 
  LayoutDashboard as LayoutDashboardIcon, 
  Users as UsersIcon, 
  Sparkles as SparklesIcon, 
  ClipboardList as ClipboardListIcon,
  LogOut
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';

defineProps({ open: Boolean });
const emit = defineEmits(['update:open']);

const authStore = useAuthStore();
const adminStore = useAdminStore();
const user = computed(() => authStore.user);
const empresa = computed(() => adminStore.empresa);

const logout = async () => {
  await authStore.logout();
  window.location.href = '/login'; // Forzamos recarga completa
};
</script>

<template>
  <aside 
    class="fixed top-0 left-0 w-64 bg-primary text-white flex flex-col h-full z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0"
    :class="{'-translate-x-full': !open}"
  >
    <div class="flex items-center justify-center h-20 px-4 border-b border-primary-dark shadow-md">
        <h1 class="text-2xl font-bold text-white tracking-wider">SMART Bienestar</h1>
    </div>
    
    <div v-if="empresa" class="p-4 text-center border-b border-primary-dark">
        <p class="font-semibold text-lg">{{ empresa.nombre }}</p>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-1">
      <router-link to="/admin/dashboard" class="sidebar-item" active-class="active" @click="emit('update:open', false)">
        <LayoutDashboardIcon class="w-5 h-5 mr-3" />
        <span>Dashboard</span>
      </router-link>
      <router-link to="/admin/empleados" class="sidebar-item" active-class="active" @click="emit('update:open', false)">
        <UsersIcon class="w-5 h-5 mr-3" />
        <span>Empleados</span>
      </router-link>
      <router-link to="/admin/servicios" class="sidebar-item" active-class="active" @click="emit('update:open', false)">
        <SparklesIcon class="w-5 h-5 mr-3" />
        <span>Servicios</span>
      </router-link>
      <router-link to="/admin/encuestas" class="sidebar-item" active-class="active" @click="emit('update:open', false)">
        <ClipboardListIcon class="w-5 h-5 mr-3" />
        <span>Encuestas</span>
      </router-link>
    </nav>

    <div class="p-4 border-t border-primary-dark">
        <p class="text-sm font-medium">{{ user?.nombre }} {{ user?.apellido }}</p>
        <p class="text-xs text-gray-300 mb-4">Administrador</p>
        <Button variant="outline" @click="logout" class="w-full text-white border-white hover:bg-white hover:text-primary">
            <LogOut class="w-4 h-4 mr-2" />
            Cerrar Sesión
        </Button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-item {
  @apply flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 text-gray-200 hover:bg-primary-dark;
}
.sidebar-item.active {
  @apply bg-secondary text-white shadow-inner;
}
</style>