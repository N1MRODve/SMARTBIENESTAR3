<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { DEMO_MODE, demoData } from '@/utils/demoData';
import { FITCORP_MOCK_DATA } from '@/services/mockData';
import { empleadosService } from '@/services/empleados.service';
import { comunicadosService } from '@/services/comunicados.service';
import { encuestasService } from '@/services/encuestas.service';
import { recompensasService } from '@/services/recompensas.service';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Gift,
  FileText,
  TrendingUp,
  ArrowRight,
  Heart,
  Brain,
  Activity,
  Shield,
  Home
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

const metrics = ref({
  saludMental: null,
  ergonomia: null,
  satisfaccionLaboral: null,
  balanceVidaTrabajo: null,
  ambienteLaboral: null
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
    if (authStore.isDemoMode) {
      empresa.value = FITCORP_MOCK_DATA.empresa;
      stats.value = FITCORP_MOCK_DATA.estadisticas.dashboard;
      metrics.value = FITCORP_MOCK_DATA.metricas;
    } else if (DEMO_MODE.enabled) {
      empresa.value = demoData.empresa;
      stats.value = demoData.estadisticas.dashboard;

      metrics.value = {
        saludMental: 8.6,
        ergonomia: 8.9,
        satisfaccionLaboral: 8.4,
        balanceVidaTrabajo: 8.3,
        ambienteLaboral: 8.7
      };
    } else {
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
        loadRecompensasCount(),
        loadMetrics()
      ]);
    }
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  } finally {
    loading.value = false;
  }
};

const loadEmpleadosCount = async () => {
  if (DEMO_MODE.enabled) {
    stats.value.totalEmpleados = demoData.empleados.length;
    return;
  }

  const { count } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activo');

  stats.value.totalEmpleados = count || 0;
};

const loadComunicadosCount = async () => {
  if (DEMO_MODE.enabled) {
    stats.value.comunicadosActivos = demoData.comunicados.length;
    return;
  }

  const { count } = await supabase
    .from('comunicados')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId);

  stats.value.comunicadosActivos = count || 0;
};

const loadEncuestasCount = async () => {
  if (DEMO_MODE.enabled) {
    stats.value.encuestasActivas = demoData.encuestas.filter(e => e.estado === 'activa').length;
    return;
  }

  const { count } = await supabase
    .from('encuestas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('estado', 'Activa');

  stats.value.encuestasActivas = count || 0;
};

const loadRecompensasCount = async () => {
  if (DEMO_MODE.enabled) {
    stats.value.recompensasDisponibles = demoData.recompensas.length;
    return;
  }

  const { count } = await supabase
    .from('recompensas')
    .select('*', { count: 'exact', head: true })
    .eq('empresa_id', authStore.empresaId)
    .eq('activa', true);

  stats.value.recompensasDisponibles = count || 0;
};

const loadMetrics = async () => {
  try {
    // Intentar cargar métricas desde respuestas de encuestas
    const { data: respuestas, error } = await supabase
      .from('respuestas_encuesta')
      .select(`
        id,
        respuesta,
        preguntas_encuesta!inner(categoria),
        empleados!inner(empresa_id)
      `)
      .eq('empleados.empresa_id', authStore.empresaId);

    if (error) throw error;

    if (respuestas && respuestas.length > 0) {
      // Calcular promedios por categoría
      const categorias = {};

      respuestas.forEach(resp => {
        const categoria = resp.preguntas_encuesta?.categoria;
        if (categoria && resp.respuesta) {
          if (!categorias[categoria]) {
            categorias[categoria] = { total: 0, count: 0 };
          }
          categorias[categoria].total += parseInt(resp.respuesta);
          categorias[categoria].count++;
        }
      });

      // Asignar métricas según las categorías encontradas
      Object.keys(categorias).forEach(categoria => {
        const promedio = (categorias[categoria].total / categorias[categoria].count).toFixed(1);

        if (categoria.toLowerCase().includes('salud') || categoria.toLowerCase().includes('mental')) {
          metrics.value.saludMental = parseFloat(promedio);
        } else if (categoria.toLowerCase().includes('ergonomia') || categoria.toLowerCase().includes('físico')) {
          metrics.value.ergonomia = parseFloat(promedio);
        } else if (categoria.toLowerCase().includes('satisfacción') || categoria.toLowerCase().includes('satisfaccion')) {
          metrics.value.satisfaccionLaboral = parseFloat(promedio);
        } else if (categoria.toLowerCase().includes('balance') || categoria.toLowerCase().includes('vida')) {
          metrics.value.balanceVidaTrabajo = parseFloat(promedio);
        } else if (categoria.toLowerCase().includes('ambiente') || categoria.toLowerCase().includes('clima')) {
          metrics.value.ambienteLaboral = parseFloat(promedio);
        }
      });
    }
  } catch (error) {
    console.error('Error cargando métricas:', error);
  }
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

const wellbeingMetrics = computed(() => [
  {
    label: 'Salud Mental',
    value: metrics.value.saludMental,
    icon: Brain,
    description: 'Bienestar psicológico'
  },
  {
    label: 'Ergonomía',
    value: metrics.value.ergonomia,
    icon: Activity,
    description: 'Condiciones físicas'
  },
  {
    label: 'Satisfacción Laboral',
    value: metrics.value.satisfaccionLaboral,
    icon: Heart,
    description: 'Nivel de satisfacción'
  },
  {
    label: 'Balance Vida-Trabajo',
    value: metrics.value.balanceVidaTrabajo,
    icon: Home,
    description: 'Equilibrio personal'
  },
  {
    label: 'Ambiente Laboral',
    value: metrics.value.ambienteLaboral,
    icon: Shield,
    description: 'Clima organizacional'
  }
]);
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

      <!-- Wellbeing Metrics -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-900">Métricas de Bienestar</h2>
          <p class="text-sm text-gray-600 mt-0.5">Indicadores clave de salud organizacional</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div
              v-for="metric in wellbeingMetrics"
              :key="metric.label"
              class="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow overflow-hidden"
            >
              <div class="flex items-start justify-between mb-3">
                <component :is="metric.icon" class="h-5 w-5 text-gray-900 flex-shrink-0" />
                <span v-if="metric.value !== null" class="text-lg font-semibold text-gray-900">
                  {{ metric.value }}
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </div>
              <h3 class="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{{ metric.label }}</h3>
              <p class="text-xs text-gray-600 line-clamp-1">{{ metric.description }}</p>

              <!-- Progress bar si hay valor -->
              <div v-if="metric.value !== null" class="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  class="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((metric.value / 10) * 100, 100)}%` }"
                ></div>
              </div>
              <!-- Placeholder si no hay datos -->
              <div v-else class="mt-3">
                <span class="text-xs text-gray-500 italic">Sin datos aún</span>
              </div>
            </div>
          </div>

          <!-- Call to action si no hay métricas -->
          <div v-if="wellbeingMetrics.every(m => m.value === null)" class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p class="text-sm text-gray-600 mb-3">
              Las métricas se generarán una vez que tus empleados respondan encuestas
            </p>
            <button
              @click="router.push('/admin/encuestas')"
              class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FileText class="h-4 w-4 mr-2" />
              Crear Primera Encuesta
            </button>
          </div>
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
