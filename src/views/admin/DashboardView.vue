<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Gift,
  FileText,
  TrendingUp,
  ArrowRight
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const empresa = ref(null);
const stats = ref({
  totalEmpleados: 0,
  comunicadosActivos: 0,
  encuestasActivas: 0,
  recompensasDisponibles: 0
});

const hasData = computed(() => {
  return stats.value.totalEmpleados > 0 ||
         stats.value.comunicadosActivos > 0 ||
         stats.value.encuestasActivas > 0;
});

onMounted(async () => {
  await loadDashboardData();
});

const loadDashboardData = async () => {
  loading.value = true;

  try {
    const { data: empresaData } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', authStore.empresaId)
      .maybeSingle();

    empresa.value = empresaData;

    await Promise.all([
      loadEmpleadosCount(),
      loadComunicadosCount(),
      loadEncuestasCount(),
      loadRecompensasCount()
    ]);

  } catch (error) {
    console.error('Error cargando dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const loadEmpleadosCount = async () => {
  const { count } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activo');

  stats.value.totalEmpleados = count || 0;
};

const loadComunicadosCount = async () => {
  const { count } = await supabase
    .from('comunicados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId);

  stats.value.comunicadosActivos = count || 0;
};

const loadEncuestasCount = async () => {
  const { count } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activa');

  stats.value.encuestasActivas = count || 0;
};

const loadRecompensasCount = async () => {
  const { count } = await supabase
    .from('recompensas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('activa', true);

  stats.value.recompensasDisponibles = count || 0;
};

const quickActions = [
  {
    title: 'Empleados',
    description: 'Gestiona tu equipo',
    icon: Users,
    route: '/admin/empleados',
    stat: computed(() => stats.value.totalEmpleados)
  },
  {
    title: 'Comunicación',
    description: 'Envía mensajes',
    icon: MessageSquare,
    route: '/admin/comunicacion',
    stat: computed(() => stats.value.comunicadosActivos)
  },
  {
    title: 'Encuestas',
    description: 'Mide el clima',
    icon: FileText,
    route: '/admin/encuestas',
    stat: computed(() => stats.value.encuestasActivas)
  },
  {
    title: 'Recompensas',
    description: 'Motiva al equipo',
    icon: Gift,
    route: '/admin/recompensas',
    stat: computed(() => stats.value.recompensasDisponibles)
  },
  {
    title: 'Analítica',
    description: 'Revisa métricas',
    icon: TrendingUp,
    route: '/admin/analitica',
    stat: null
  }
];
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center">
            <LayoutDashboard class="h-6 w-6 text-gray-900" />
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Panel Principal</h1>
            <p class="text-sm text-gray-600 mt-0.5">{{ empresa?.nombre || 'Cargando...' }}</p>
          </div>
        </div>
        <div v-if="!loading" class="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
          <div class="w-2 h-2 bg-black rounded-full"></div>
          <span class="text-xs font-medium text-gray-900">Activo</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900"></div>
    </div>

    <!-- Stats Grid -->
    <template v-else-if="hasData">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in [
            { label: 'Empleados', value: stats.totalEmpleados, icon: Users },
            { label: 'Comunicados', value: stats.comunicadosActivos, icon: MessageSquare },
            { label: 'Encuestas', value: stats.encuestasActivas, icon: FileText },
            { label: 'Recompensas', value: stats.recompensasDisponibles, icon: Gift }
          ]"
          :key="stat.label"
          class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <component :is="stat.icon" class="h-5 w-5 text-gray-900" />
            <span class="text-2xl font-semibold text-gray-900">{{ stat.value }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          <p class="text-sm text-gray-600 mt-0.5">Accede a las funciones principales</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="router.push(action.route)"
              class="group text-left p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-sm transition-all"
            >
              <div class="flex items-start justify-between mb-3">
                <component :is="action.icon" class="h-5 w-5 text-gray-900" />
                <ArrowRight class="h-4 w-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 class="font-medium text-gray-900 mb-1">{{ action.title }}</h3>
              <p class="text-sm text-gray-600">{{ action.description }}</p>
              <div v-if="action.stat" class="mt-2 pt-2 border-t border-gray-100">
                <span class="text-xs text-gray-500">Total: <span class="font-medium text-gray-900">{{ action.stat.value }}</span></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 border border-gray-300 rounded-lg flex items-center justify-center">
        <LayoutDashboard class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Bienvenido a Smart Bienestar</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Tu plataforma está lista. Comienza configurando tu empresa.
      </p>
      <button
        @click="router.push('/admin/empleados')"
        class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Comenzar
        <ArrowRight class="h-4 w-4 ml-2" />
      </button>
    </div>

  </div>
</template>
