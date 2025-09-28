<script setup>
import { LayoutDashboard, Calendar, HeartHandshake, Gift, History } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  // Llama a la acción de logout del store (que ya debería existir)
  await authStore.logout();
  // Redirige al usuario a la página de login
  router.push('/login');
};
</script>

<template>
  <div class="flex h-screen bg-background text-on-background">
    <aside class="w-64 flex-shrink-0 bg-surface border-r border-surface-variant">
      <div class="p-4 border-b border-surface-variant">
        <h1 class="text-xl font-bold text-primary">SMART Bienestar</h1>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/empleado/dashboard" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <LayoutDashboard class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/actividades" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Calendar class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Actividades</span>
            </router-link>
          </li>
           <li>
            <router-link to="/empleado/reservas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <History class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Mis Reservas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/apoyo-personal" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <HeartHandshake class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Apoyo Personal</span>
            </router-link>
          </li>
          <li>
            <router-link to="/empleado/recompensas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Gift class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Recompensas</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-surface border-b border-surface-variant p-4 shadow-sm flex justify-between items-center">
         <h2 class="text-xl font-semibold text-on-surface">Bienvenido</h2>
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
/* Estilos para el enlace activo en el menú, ahora con los nuevos colores */
.router-link-exact-active {
  background-color: hsl(180 40% 90%); /* Un color sutil derivado del primario */
  font-weight: 600;
  color: var(--color-primary-dark);
}
</style>