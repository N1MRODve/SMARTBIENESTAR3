<script setup>
import { useAuthStore } from '@/stores/auth.store.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="flex h-screen bg-background text-on-background">
    <aside class="w-64 flex-shrink-0 bg-surface border-r border-surface-variant">
      <div class="p-4 border-b border-surface-variant">
        <h1 class="text-xl font-bold text-primary">SMART Bienestar</h1>
        <span class="text-sm text-on-surface-variant">Panel de Admin</span>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/admin/dashboard" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/empleados" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <span class="ml-3">Gestionar Empleados</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/encuestas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <span class="ml-3">Gestionar Encuestas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/recompensas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <span class="ml-3">Gestionar Recompensas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/comunicados" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <span class="ml-3">Gestionar Comunicados</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-surface border-b border-surface-variant p-4 shadow-sm flex justify-between items-center">
         <h2 class="text-xl font-semibold text-on-surface">Panel de Administración</h2>
        <div>
           <button @click="handleLogout" class="font-semibold text-primary hover:underline">Cerrar Sesión</button>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  background-color: hsl(180 40% 90%);
  font-weight: 600;
  color: var(--color-primary-dark);
}
</style>