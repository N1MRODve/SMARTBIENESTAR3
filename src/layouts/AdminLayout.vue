<script setup>
import { ref, computed, onMounted } from 'vue';
import { LayoutDashboard, Users, FileText, Gift, Megaphone, BarChart3, Settings, TrendingUp, Briefcase, ClipboardList } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store.js';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const empleadosInvitados = ref(0);
const encuestasActivas = ref(0);
const solicitudesPendientes = ref(0);

onMounted(async () => {
  await loadBadgeCounts();
});

const loadBadgeCounts = async () => {
  try {
    // Contar empleados invitados
    const { count: invitadosCount } = await supabase
      .from('empleados')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Invitado');

    empleadosInvitados.value = invitadosCount || 0;

    // Contar encuestas activas
    const { count: encuestasCount } = await supabase
      .from('encuestas')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Activa');

    encuestasActivas.value = encuestasCount || 0;

    // Contar solicitudes pendientes
    const { count: solicitudesCount } = await supabase
      .from('solicitudes_servicios')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Pendiente');

    solicitudesPendientes.value = solicitudesCount || 0;
  } catch (error) {
    console.error('Error loading badge counts:', error);
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

// No mostrar breadcrumbs en el dashboard principal
const showBreadcrumbs = computed(() => {
  return route.path !== '/admin/dashboard' && route.path !== '/admin';
});
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 flex-shrink-0 bg-white border-r border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">SMART Bienestar</h1>
        <span class="text-sm text-gray-600">Panel de Admin</span>
      </div>
      <nav class="p-4 space-y-6">
        <!-- Sección: Visión General -->
        <div>
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Visión General
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/dashboard" class="nav-item">
                <LayoutDashboard class="nav-icon" />
                <span class="flex-1">Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/analitica" class="nav-item">
                <TrendingUp class="nav-icon" />
                <span class="flex-1">Analítica</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Sección: Gestión de Personas -->
        <div>
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Personas
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/empleados" class="nav-item">
                <Users class="nav-icon" />
                <span class="flex-1">Empleados</span>
                <span v-if="empleadosInvitados > 0" class="badge badge-blue">
                  {{ empleadosInvitados }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Sección: Medición & Feedback -->
        <div>
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Medición
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/encuestas" class="nav-item">
                <FileText class="nav-icon" />
                <span class="flex-1">Encuestas</span>
                <span v-if="encuestasActivas > 0" class="badge badge-purple">
                  {{ encuestasActivas }}
                </span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/participacion" class="nav-item">
                <BarChart3 class="nav-icon" />
                <span class="flex-1">Participación</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Sección: Servicios & Beneficios -->
        <div>
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Servicios
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/servicios" class="nav-item">
                <Briefcase class="nav-icon" />
                <span class="flex-1">Catálogo</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/solicitudes" class="nav-item">
                <ClipboardList class="nav-icon" />
                <span class="flex-1">Solicitudes</span>
                <span v-if="solicitudesPendientes > 0" class="badge badge-yellow">
                  {{ solicitudesPendientes }}
                </span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/recompensas" class="nav-item">
                <Gift class="nav-icon" />
                <span class="flex-1">Recompensas</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Sección: Comunicación -->
        <div>
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Comunicación
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/comunicacion" class="nav-item">
                <Megaphone class="nav-icon" />
                <span class="flex-1">Centro de Comunicación</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Configuración (separado al final) -->
        <div class="pt-4 border-t border-gray-200">
          <ul class="space-y-1">
            <li>
              <router-link to="/admin/configuracion" class="nav-item">
                <Settings class="nav-icon" />
                <span class="flex-1">Configuración</span>
              </router-link>
            </li>
          </ul>
        </div>
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
        <Breadcrumbs v-if="showBreadcrumbs" />
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  @apply flex items-center justify-between px-3 py-2 rounded-lg
         text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer;
}

.nav-icon {
  @apply w-5 h-5 text-gray-600 mr-3 flex-shrink-0;
}

.router-link-exact-active {
  @apply bg-gray-100 font-semibold text-gray-900;
}

.router-link-exact-active .nav-icon {
  @apply text-gray-900;
}

.badge {
  @apply px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0;
}

.badge-blue {
  @apply bg-blue-100 text-blue-700;
}

.badge-purple {
  @apply bg-purple-100 text-purple-700;
}

.badge-yellow {
  @apply bg-yellow-100 text-yellow-700;
}
</style>