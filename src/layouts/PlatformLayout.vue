<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Users,
  Settings,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store.js';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const empresasCount = ref(0);
const solicitudesPendientes = ref(0);
const showUserMenu = ref(false);

onMounted(async () => {
  await loadStats();
});

const loadStats = async () => {
  try {
    const { count: empresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true });

    empresasCount.value = empresas || 0;

    const { count: solicitudes } = await supabase
      .from('solicitudes_servicios')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'Pendiente');

    solicitudesPendientes.value = solicitudes || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const platformUserName = computed(() => {
  return authStore.platformUser?.nombre || 'Usuario';
});

const platformUserRole = computed(() => {
  const roles = {
    superadmin: 'Super Admin',
    soporte: 'Soporte',
    comercial: 'Comercial'
  };
  return roles[authStore.platformUser?.rol] || 'Usuario';
});

const canAccessUsuarios = computed(() => {
  return authStore.platformUser?.rol === 'superadmin';
});
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 flex-shrink-0 bg-slate-900 text-white">
      <div class="p-4 border-b border-slate-700">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">SB</span>
          </div>
          <div>
            <h1 class="text-lg font-bold text-white">SMART Bienestar</h1>
            <span class="text-xs text-slate-400">Back Office</span>
          </div>
        </div>
      </div>

      <nav class="p-4 space-y-6">
        <div>
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Principal
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/platform/dashboard" class="nav-item">
                <LayoutDashboard class="nav-icon" />
                <span class="flex-1">Dashboard</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Gestion
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/platform/empresas" class="nav-item">
                <Building2 class="nav-icon" />
                <span class="flex-1">Empresas</span>
                <span v-if="empresasCount > 0" class="badge">
                  {{ empresasCount }}
                </span>
              </router-link>
            </li>
            <li>
              <router-link to="/platform/solicitudes" class="nav-item">
                <ClipboardList class="nav-icon" />
                <span class="flex-1">Solicitudes</span>
                <span v-if="solicitudesPendientes > 0" class="badge badge-warning">
                  {{ solicitudesPendientes }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>

        <div v-if="canAccessUsuarios">
          <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Administracion
          </p>
          <ul class="space-y-1">
            <li>
              <router-link to="/platform/usuarios" class="nav-item">
                <Users class="nav-icon" />
                <span class="flex-1">Usuarios Plataforma</span>
              </router-link>
            </li>
            <li>
              <router-link to="/platform/configuracion" class="nav-item">
                <Settings class="nav-icon" />
                <span class="flex-1">Configuracion</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <div class="absolute bottom-0 left-0 w-64 p-4 border-t border-slate-700 bg-slate-900">
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div class="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ platformUserName.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div class="flex-1 text-left">
              <p class="text-sm font-medium text-white truncate">{{ platformUserName }}</p>
              <p class="text-xs text-slate-400">{{ platformUserRole }}</p>
            </div>
            <ChevronDown class="w-4 h-4 text-slate-400" />
          </button>

          <div
            v-if="showUserMenu"
            class="absolute bottom-full left-0 w-full mb-2 bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          >
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <LogOut class="w-4 h-4" />
              Cerrar Sesion
            </button>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ route.meta.title || 'Back Office' }}</h2>
          </div>
          <div class="flex items-center gap-4">
            <button class="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell class="w-5 h-5" />
              <span
                v-if="solicitudesPendientes > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
              >
                {{ solicitudesPendientes > 9 ? '9+' : solicitudesPendientes }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg
         text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer;
}

.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.router-link-exact-active {
  @apply bg-slate-800 text-white;
}

.badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full bg-slate-700 text-slate-300;
}

.badge-warning {
  @apply bg-amber-500 text-white;
}
</style>
