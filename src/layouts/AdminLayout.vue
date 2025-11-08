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
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 flex-shrink-0 bg-white border-r border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">SMART Bienestar</h1>
        <span class="text-sm text-gray-600">Panel de Admin</span>
      </div>
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/admin/dashboard" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <LayoutDashboard class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/empleados" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Users class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Gestionar Empleados</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/encuestas" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <FileText class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Gestionar Encuestas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/participacion" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <BarChart3 class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Panel de Participación</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/analitica" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <TrendingUp class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Analítica Ejecutiva</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/servicios" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Briefcase class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Servicios SMART</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/solicitudes" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ClipboardList class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Solicitudes de Servicios</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/recompensas" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Gift class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Gestionar Recompensas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/comunicacion" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Megaphone class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Comunicaciones</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/configuracion" class="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings class="w-5 h-5 text-gray-600" />
              <span class="ml-3 text-gray-700">Configuración Global</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 p-4 shadow-sm flex justify-between items-center">
         <h2 class="text-2xl font-bold text-gray-900">Panel de Administración</h2>
        <div>
           <button @click="handleLogout" class="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors">Cerrar Sesión</button>
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
  background-color: #f3f4f6;
  font-weight: 600;
  color: #111827;
}

.router-link-exact-active .w-5 {
  color: #111827;
}
</style>