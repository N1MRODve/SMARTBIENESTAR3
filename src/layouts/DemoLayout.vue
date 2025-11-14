<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Demo Banner -->
    <div class="bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse">
              <path d="M12 2v4"/>
              <path d="m16.2 7.8 2.9-2.9"/>
              <path d="M18 12h4"/>
              <path d="m16.2 16.2 2.9 2.9"/>
              <path d="M12 18v4"/>
              <path d="m4.9 19.1 2.9-2.9"/>
              <path d="M2 12h4"/>
              <path d="m4.9 4.9 2.9 2.9"/>
            </svg>
            <span class="font-bold text-sm">MODO DEMO</span>
          </div>
          <span class="hidden sm:inline text-sm opacity-90">SportLife Performance - Explora todas las funcionalidades</span>
        </div>
        <button
          @click="exitDemo"
          class="text-xs font-medium px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
        >
          Salir de Demo
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">S</span>
              </div>
              <span class="font-bold text-gray-900">SportLife Performance</span>
            </div>

            <div class="hidden md:flex items-center gap-1">
              <router-link
                v-for="item in navigation"
                :key="item.path"
                :to="item.path"
                class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                :class="isActive(item.path) ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 hidden sm:inline">Usuario Demo</span>
            <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-xs font-bold">D</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Demo Info Footer -->
    <div class="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
      <div class="flex items-start gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        <div>
          <p class="text-xs font-medium text-gray-900">Modo Demostración</p>
          <p class="text-xs text-gray-600 mt-1">Todos los cambios son simulados. No se guarda ningún dato.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigation = [
  { name: 'Dashboard', path: '/demo/dashboard' },
  { name: 'Empleados', path: '/demo/empleados' },
  { name: 'Comunicación', path: '/demo/comunicacion' },
  { name: 'Encuestas', path: '/demo/encuestas' },
  { name: 'Recompensas', path: '/demo/recompensas' },
  { name: 'Analítica', path: '/demo/analitica' }
];

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const exitDemo = () => {
  localStorage.removeItem('demo_mode');
  localStorage.removeItem('demo_user');
  router.push('/login');
};
</script>
