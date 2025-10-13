<script setup>
import { LayoutDashboard, Users, FileText, Gift, Megaphone, BarChart3, Settings, TrendingUp, Briefcase, ClipboardList } from 'lucide-vue-next';
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
              <LayoutDashboard class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/empleados" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Users class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Gestionar Empleados</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/encuestas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <FileText class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Gestionar Encuestas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/participacion" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <BarChart3 class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Panel de Participación</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/analitica" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <TrendingUp class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Analítica Ejecutiva</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/servicios" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Briefcase class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Servicios SMART</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/solicitudes" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <ClipboardList class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Solicitudes de Servicios</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/recompensas" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Gift class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Gestionar Recompensas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/comunicados" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Megaphone class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Gestionar Comunicados</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/configuracion" class="flex items-center p-2 rounded-lg hover:bg-surface-variant">
              <Settings class="w-5 h-5 text-on-surface-variant" />
              <span class="ml-3">Configuración Global</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-surface border-b border-surface-variant p-4 shadow-sm flex justify-between items-center">
         <h2 class="text-2xl font-bold text-on-surface">Panel de Administración</h2>
        <div>
           <button @click="handleLogout" class="text-lg font-semibold text-primary hover:underline">Cerrar Sesión</button>
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