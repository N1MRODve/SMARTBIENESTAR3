<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  LayoutDashboard,
  FileText,
  Gift,
  Megaphone,
  Heart,
  Calendar,
  Shield,
  Star,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronRight,
  User,
  AlertTriangle,
  Sparkles
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store.js';
import { useEncuestasStore } from '@/stores/encuestas.store.js';
import { useComunicadosStore } from '@/stores/comunicados.store.js';
import { useGamificacionStore } from '@/stores/gamificacion.store.js';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import Breadcrumbs from '@/components/common/Breadcrumbs.vue';

const authStore = useAuthStore();
const encuestasStore = useEncuestasStore();
const comunicadosStore = useComunicadosStore();
const gamificacionStore = useGamificacionStore();
const router = useRouter();
const route = useRoute();

const { user, empleado, empresaId } = storeToRefs(authStore);
const { activeSurvey, totalPendientes } = storeToRefs(encuestasStore);
const { comunicados, conteoNoLeidos } = storeToRefs(comunicadosStore);
const { puntosUsuario } = storeToRefs(gamificacionStore);

const mobileMenuOpen = ref(false);
const loggingOut = ref(false);
const showLogoutModal = ref(false);
const userMenuOpen = ref(false);

// Nombre de la empresa (derivado del email si no hay empresa registrada)
const nombreEmpresa = computed(() => {
  if (empleado.value?.empresa?.nombre) {
    return empleado.value.empresa.nombre;
  }
  // Derivar del dominio del email
  const email = user.value?.email || '';
  const domain = email.split('@')[1];
  if (domain) {
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  }
  return 'Tu Empresa';
});

// Nombre del empleado
const nombreEmpleado = computed(() => {
  if (empleado.value?.nombre) {
    return empleado.value.nombre;
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0];
  }
  return 'Empleado';
});

// Badges para navegación
// Usa totalPendientes del store (fuente única de verdad)
const encuestasPendientes = computed(() => totalPendientes.value || 0);
// FUENTE ÚNICA DE VERDAD: usa el computed del store que se actualiza automáticamente
const comunicadosNuevos = computed(() => {
  const count = conteoNoLeidos.value || 0;
  return Math.min(count, 9); // Máximo 9 para el badge
});

// Items de navegación
const navItems = [
  {
    to: '/empleado/dashboard',
    icon: LayoutDashboard,
    label: 'Inicio',
    description: 'Tu resumen de bienestar'
  },
  {
    to: '/empleado/encuesta',
    icon: FileText,
    label: 'Encuestas',
    description: 'Comparte tu opinión',
    badge: () => encuestasPendientes.value
  },
  {
    to: '/empleado/comunicados',
    icon: Megaphone,
    label: 'Comunicados',
    description: 'Noticias de tu empresa',
    badge: () => comunicadosNuevos.value
  },
  {
    to: '/empleado/recompensas',
    icon: Gift,
    label: 'Recompensas',
    description: 'Canjea tus puntos'
  },
  {
    to: '/empleado/actividades',
    icon: Calendar,
    label: 'Actividades',
    description: 'Eventos y sesiones'
  },
  {
    to: '/empleado/apoyo-personal',
    icon: Heart,
    label: 'Apoyo',
    description: 'Recursos de bienestar'
  }
];

// Cargar datos iniciales
onMounted(async () => {
  const userId = user.value?.id;
  if (userId) {
    try {
      await Promise.all([
        encuestasStore.fetchActiveSurvey(),
        comunicadosStore.cargarComunicados(),
        gamificacionStore.cargarPuntos(userId)
      ]);
    } catch (error) {
      console.error('Error loading employee data:', error);
    }
  }
});

// Iniciales del usuario para avatar
const userInitials = computed(() => {
  if (empleado.value?.nombre) {
    const parts = empleado.value.nombre.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (user.value?.email) {
    return user.value.email.substring(0, 2).toUpperCase();
  }
  return 'US';
});

// Título de la página actual
const currentPageTitle = computed(() => {
  const item = navItems.find(i => isActiveRoute(i.to));
  return item?.label || 'Inicio';
});

// Abrir modal de logout
const openLogoutModal = () => {
  showLogoutModal.value = true;
  userMenuOpen.value = false;
  mobileMenuOpen.value = false;
};

// Cerrar modal de logout
const closeLogoutModal = () => {
  showLogoutModal.value = false;
};

const handleLogout = async () => {
  loggingOut.value = true;
  try {
    await authStore.logout();
    showLogoutModal.value = false;
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    loggingOut.value = false;
  }
};

const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(path + '/');
};

// Cerrar menú de usuario al hacer clic fuera
const closeUserMenu = () => {
  userMenuOpen.value = false;
};

// Cerrar menú móvil al cambiar de ruta
watch(() => route.path, () => {
  mobileMenuOpen.value = false;
  userMenuOpen.value = false;
});

// Mostrar breadcrumbs solo en vistas secundarias (no en dashboard)
const showBreadcrumbs = computed(() => {
  return route.path !== '/empleado/dashboard' && route.path !== '/empleado';
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y empresa -->
          <div class="flex items-center">
            <router-link to="/empleado/dashboard" class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                <Heart class="w-5 h-5 text-white" />
              </div>
              <div class="hidden sm:block">
                <h1 class="text-lg font-bold text-gray-900">SMART<span class="text-teal-600">Bienestar</span></h1>
                <p class="text-xs text-gray-500 -mt-0.5">{{ nombreEmpresa }}</p>
              </div>
            </router-link>
          </div>

          <!-- Navegación desktop -->
          <nav class="hidden lg:flex items-center gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="nav-link relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="isActiveRoute(item.to)
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
            >
              <span class="flex items-center gap-2">
                <component
                  :is="item.icon"
                  class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'scale-110': isActiveRoute(item.to) }"
                />
                {{ item.label }}
              </span>
              <!-- Badge con animación -->
              <span
                v-if="item.badge && item.badge() > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse"
              >
                {{ item.badge() }}
              </span>
              <!-- Indicador de activo -->
              <span
                v-if="isActiveRoute(item.to)"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-teal-500 rounded-full"
              />
            </router-link>
          </nav>

          <!-- Sección derecha -->
          <div class="flex items-center gap-3">
            <!-- Puntos (siempre visible) -->
            <router-link
              to="/empleado/recompensas"
              class="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 rounded-full border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
            >
              <Star class="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
              <span class="text-sm font-bold text-amber-700">{{ puntosUsuario || 0 }}</span>
              <span class="text-xs text-amber-600 hidden sm:inline">puntos</span>
            </router-link>

            <!-- Menú de usuario desktop -->
            <div class="hidden md:block relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <!-- Avatar -->
                <div class="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {{ userInitials }}
                </div>
                <div class="text-left hidden lg:block">
                  <p class="text-sm font-medium text-gray-900 truncate max-w-[120px]">{{ nombreEmpleado }}</p>
                  <p class="text-xs text-gray-500 truncate max-w-[120px]">{{ nombreEmpresa }}</p>
                </div>
                <ChevronRight
                  class="w-4 h-4 text-gray-400 transition-transform duration-200"
                  :class="{ 'rotate-90': userMenuOpen }"
                />
              </button>

              <!-- Dropdown del usuario -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <!-- Info del usuario -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {{ userInitials }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ nombreEmpleado }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Shield class="w-3.5 h-3.5 text-teal-500" />
                      <span>Datos protegidos y privados</span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="py-1">
                    <button
                      @click="openLogoutModal"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut class="w-4 h-4" />
                      <span class="text-sm font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </Transition>

              <!-- Overlay para cerrar el menú -->
              <div
                v-if="userMenuOpen"
                class="fixed inset-0 z-40"
                @click="closeUserMenu"
              />
            </div>

            <!-- Botón menú móvil -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              :class="{ 'bg-gray-100': mobileMenuOpen }"
            >
              <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
              <X v-else class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Menú móvil -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="mobileMenuOpen"
          class="lg:hidden border-t border-gray-200 bg-white shadow-lg"
        >
          <!-- Info usuario móvil - arriba -->
          <div class="px-4 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {{ userInitials }}
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ nombreEmpleado }}</p>
                <p class="text-sm text-gray-600">{{ user?.email }}</p>
                <div class="flex items-center gap-1 mt-1 text-xs text-teal-600">
                  <Shield class="w-3 h-3" />
                  <span>Datos privados</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navegación móvil -->
          <div class="px-4 py-4 space-y-1">
            <router-link
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center justify-between p-3 rounded-xl transition-all duration-200"
              :class="isActiveRoute(item.to)
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  :class="isActiveRoute(item.to) ? 'bg-teal-100' : 'bg-gray-100'"
                >
                  <component :is="item.icon" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-medium">{{ item.label }}</p>
                  <p class="text-xs text-gray-500">{{ item.description }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="item.badge && item.badge() > 0"
                  class="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse"
                >
                  {{ item.badge() }}
                </span>
                <ChevronRight class="w-5 h-5 text-gray-400" />
              </div>
            </router-link>
          </div>

          <!-- Botón cerrar sesión móvil -->
          <div class="px-4 py-4 border-t border-gray-200 bg-gray-50">
            <button
              @click="openLogoutModal"
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut class="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Banner de privacidad (sutil, en páginas sensibles) -->
    <div
      v-if="route.path.includes('encuesta')"
      class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div class="flex items-center justify-center gap-2 text-sm text-blue-700">
          <Shield class="w-4 h-4" />
          <span>Tus respuestas son <strong>confidenciales</strong> y no se comparten con tu manager</span>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumbs para vistas secundarias -->
      <Breadcrumbs v-if="showBreadcrumbs" layout="empleado" />
      <router-view />
    </main>

    <!-- Footer con mensaje de confianza -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Mensaje de privacidad -->
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <Shield class="w-5 h-5 text-teal-600" />
            <span>Tu información está protegida. Solo ves datos de <strong class="text-gray-700">{{ nombreEmpresa }}</strong>.</span>
          </div>

          <!-- Links de ayuda -->
          <div class="flex items-center gap-4 text-sm">
            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline transition-colors">Política de privacidad</a>
            <span class="text-gray-300">|</span>
            <a href="#" class="text-gray-500 hover:text-gray-700 hover:underline transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal de confirmación de logout -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showLogoutModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeLogoutModal"
          />

          <!-- Modal -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showLogoutModal"
              class="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10"
            >
              <!-- Icono -->
              <div class="flex justify-center mb-4">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut class="w-8 h-8 text-red-600" />
                </div>
              </div>

              <!-- Contenido -->
              <div class="text-center mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">
                  ¿Cerrar sesión?
                </h3>
                <p class="text-gray-600 text-sm">
                  Estás a punto de salir de tu cuenta. Tus datos permanecerán seguros y privados.
                </p>
              </div>

              <!-- Mensaje de seguridad -->
              <div class="flex items-center gap-2 p-3 bg-teal-50 rounded-lg mb-6 text-sm text-teal-700">
                <Shield class="w-4 h-4 flex-shrink-0" />
                <span>Tu información nunca se comparte con terceros</span>
              </div>

              <!-- Botones -->
              <div class="flex gap-3">
                <button
                  @click="closeLogoutModal"
                  class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  :disabled="loggingOut"
                >
                  Cancelar
                </button>
                <button
                  @click="handleLogout"
                  :disabled="loggingOut"
                  class="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span v-if="loggingOut" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{{ loggingOut ? 'Cerrando...' : 'Cerrar sesión' }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Efecto hover en enlaces de navegación */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #14b8a6, #10b981);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::before {
  width: 60%;
}

/* Animación de pulse para badges */
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse-badge 2s infinite;
}
</style>
