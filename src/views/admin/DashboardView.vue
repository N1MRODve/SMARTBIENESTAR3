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

    <!-- Header con Gradiente -->
    <div class="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

      <div class="relative flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <LayoutDashboard class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Panel Principal</h1>
            <p class="text-white/80 mt-1">{{ empresa?.nombre || 'Cargando...' }}</p>
          </div>
        </div>
        <div v-if="!loading" class="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl">
          <div class="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <span class="text-sm font-semibold text-white">Sistema Activo</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900"></div>
    </div>

    <!-- Stats Grid con Color -->
    <template v-else-if="hasData">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in [
            { label: 'Empleados', value: stats.totalEmpleados, icon: Users, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconBg: 'bg-blue-100', textColor: 'text-blue-600' },
            { label: 'Comunicados', value: stats.comunicadosActivos, icon: MessageSquare, gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', iconBg: 'bg-green-100', textColor: 'text-green-600' },
            { label: 'Encuestas', value: stats.encuestasActivas, icon: FileText, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', iconBg: 'bg-purple-100', textColor: 'text-purple-600' },
            { label: 'Recompensas', value: stats.recompensasDisponibles, icon: Gift, gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', iconBg: 'bg-orange-100', textColor: 'text-orange-600' }
          ]"
          :key="stat.label"
          class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
        >
          <!-- Decoración de fondo -->
          <div :class="['absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-10 transition-opacity group-hover:opacity-20', stat.bg]"></div>

          <div class="relative">
            <div class="flex items-start justify-between mb-4">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', stat.iconBg]">
                <component :is="stat.icon" :class="['h-6 w-6', stat.textColor]" />
              </div>
              <span :class="['text-3xl font-bold', stat.textColor]">{{ stat.value }}</span>
            </div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>

            <!-- Barra decorativa inferior -->
            <div class="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div :class="['h-full bg-gradient-to-r', stat.gradient]" :style="{ width: '75%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wellbeing Metrics con Color -->
      <div class="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <h2 class="text-xl font-bold text-white">Métricas de Bienestar</h2>
          <p class="text-white/80 mt-1">Indicadores clave de salud organizacional</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <div
              v-for="(metric, index) in wellbeingMetrics.map((m, i) => ({
                ...m,
                gradient: ['from-pink-500 to-rose-500', 'from-blue-500 to-cyan-500', 'from-red-500 to-pink-500', 'from-green-500 to-emerald-500', 'from-violet-500 to-purple-500'][i],
                bgColor: ['bg-pink-50', 'bg-blue-50', 'bg-red-50', 'bg-green-50', 'bg-violet-50'][i],
                iconBg: ['bg-pink-100', 'bg-blue-100', 'bg-red-100', 'bg-green-100', 'bg-violet-100'][i],
                textColor: ['text-pink-600', 'text-blue-600', 'text-red-600', 'text-green-600', 'text-violet-600'][i]
              }))"
              :key="metric.label"
              class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 overflow-hidden group relative"
            >
              <!-- Decoración de fondo -->
              <div :class="['absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 opacity-10 group-hover:opacity-20 transition-opacity', metric.bgColor]"></div>

              <div class="relative">
                <div class="flex items-start justify-between mb-3">
                  <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', metric.iconBg]">
                    <component :is="metric.icon" :class="['h-5 w-5', metric.textColor]" />
                  </div>
                  <div v-if="metric.value !== null" :class="['text-2xl font-bold', metric.textColor]">
                    {{ metric.value }}
                  </div>
                  <div v-else class="text-xl text-gray-300 font-bold">-</div>
                </div>
                <h3 class="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{{ metric.label }}</h3>
                <p class="text-xs text-gray-500 line-clamp-1">{{ metric.description }}</p>

                <!-- Progress bar con gradiente -->
                <div v-if="metric.value !== null" class="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    :class="['h-2 rounded-full transition-all duration-500 bg-gradient-to-r', metric.gradient]"
                    :style="{ width: `${Math.min((metric.value / 10) * 100, 100)}%` }"
                  ></div>
                </div>
                <!-- Placeholder si no hay datos -->
                <div v-else class="mt-4">
                  <div class="w-full bg-gray-100 rounded-full h-2"></div>
                  <span class="text-xs text-gray-400 italic mt-1 block">Sin datos aún</span>
                </div>
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

      <!-- Quick Actions con Color -->
      <div class="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-slate-700 to-gray-800 px-6 py-5">
          <h2 class="text-xl font-bold text-white">Acciones Rápidas</h2>
          <p class="text-white/80 mt-1">Accede a las funciones principales del sistema</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button
              v-for="(action, index) in quickActions.map((a, i) => ({
                ...a,
                gradient: ['from-blue-500 to-blue-600', 'from-green-500 to-emerald-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-cyan-500 to-teal-600'][i],
                bgColor: ['bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-orange-50', 'bg-cyan-50'][i],
                iconBg: ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-orange-100', 'bg-cyan-100'][i],
                textColor: ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-orange-600', 'text-cyan-600'][i],
                hoverBorder: ['hover:border-blue-400', 'hover:border-green-400', 'hover:border-purple-400', 'hover:border-orange-400', 'hover:border-cyan-400'][i]
              }))"
              :key="action.title"
              @click="router.push(action.route)"
              :class="['group text-left p-6 bg-white border-2 border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 relative overflow-hidden', action.hoverBorder]"
            >
              <!-- Decoración de fondo -->
              <div :class="['absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-10 transition-opacity', action.bgColor]"></div>

              <div class="relative">
                <div class="flex items-start justify-between mb-4">
                  <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-all', action.iconBg]">
                    <component :is="action.icon" :class="['h-6 w-6', action.textColor]" />
                  </div>
                  <ArrowRight :class="['h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-all', `group-hover:${action.textColor}`]" />
                </div>
                <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ action.title }}</h3>
                <p class="text-sm text-gray-600">{{ action.description }}</p>
                <div v-if="action.stat" class="mt-4 pt-4 border-t border-gray-100">
                  <div class="flex items-baseline">
                    <span class="text-xs text-gray-500 mr-2">Total:</span>
                    <span :class="['text-2xl font-bold', action.textColor]">{{ action.stat.value }}</span>
                  </div>
                </div>
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
