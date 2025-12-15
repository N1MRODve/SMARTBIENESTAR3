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
  ArrowRight,
  Heart,
  Brain,
  Activity,
  Shield,
  Home
} from 'lucide-vue-next';
import SystemHealthWidget from '@/components/admin/SystemHealthWidget.vue';

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

const healthData = ref({
  solicitudesPendientes: 0,
  empleadosSinResponder: 0,
  encuestasCerrandoPronto: [],
  participacionBaja: []
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
      loadRecompensasCount(),
      loadMetrics(),
      loadHealthData()
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

const loadHealthData = async () => {
  try {
    // Cargar solicitudes pendientes
    const { count: solicitudesCount } = await supabase
      .from('solicitudes_servicios')
      .select('*', { count: 'exact', head: true })
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Pendiente');

    healthData.value.solicitudesPendientes = solicitudesCount || 0;

    // Cargar encuestas activas con datos de participación
    const { data: encuestasActivas, error: encuestasError } = await supabase
      .from('encuestas')
      .select('id, titulo, fecha_cierre, estado')
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Activa');

    if (encuestasError) throw encuestasError;

    if (encuestasActivas && encuestasActivas.length > 0) {
      const encuestasConParticipacion = await Promise.all(
        encuestasActivas.map(async (encuesta) => {
          // Contar total de empleados
          const { count: totalEmpleados } = await supabase
            .from('empleados')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', authStore.empresaId)
            .eq('estado', 'Activo');

          // Contar respuestas únicas por empleado
          const { data: respuestas } = await supabase
            .from('respuestas_encuesta')
            .select('empleado_id, preguntas_encuesta!inner(encuesta_id)')
            .eq('preguntas_encuesta.encuesta_id', encuesta.id);

          const empleadosRespondidos = new Set(respuestas?.map(r => r.empleado_id) || []).size;
          const participacion = totalEmpleados > 0 ? Math.round((empleadosRespondidos / totalEmpleados) * 100) : 0;
          const totalPendientes = totalEmpleados - empleadosRespondidos;

          // Calcular días restantes
          let diasRestantes = null;
          if (encuesta.fecha_cierre) {
            const hoy = new Date();
            const fechaCierre = new Date(encuesta.fecha_cierre);
            diasRestantes = Math.ceil((fechaCierre - hoy) / (1000 * 60 * 60 * 24));
          }

          return {
            ...encuesta,
            participacion,
            totalPendientes,
            diasRestantes
          };
        })
      );

      // Filtrar encuestas con baja participación (< 60%)
      healthData.value.participacionBaja = encuestasConParticipacion.filter(e => e.participacion < 60);

      // Filtrar encuestas cerrando pronto (< 3 días)
      healthData.value.encuestasCerrandoPronto = encuestasConParticipacion.filter(
        e => e.diasRestantes !== null && e.diasRestantes > 0 && e.diasRestantes <= 3
      );

      // Calcular total de empleados sin responder
      healthData.value.empleadosSinResponder = encuestasConParticipacion.reduce(
        (sum, e) => sum + e.totalPendientes,
        0
      );
    }
  } catch (error) {
    console.error('Error cargando health data:', error);
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
    <div class="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

      <div class="relative flex items-center space-x-4">
        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <LayoutDashboard class="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white">Panel Principal</h1>
          <p class="text-white/80 mt-1">{{ empresa?.nombre || 'Cargando...' }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900"></div>
    </div>

    <!-- Stats Grid con Color -->
    <template v-else-if="hasData">
      <!-- System Health Widget -->
      <SystemHealthWidget
        :encuestas-activas="stats.encuestasActivas"
        :solicitudes-pendientes="healthData.solicitudesPendientes"
        :empleados-sin-responder="healthData.empleadosSinResponder"
        :encuestas-cerrando-pronto="healthData.encuestasCerrandoPronto"
        :participacion-baja="healthData.participacionBaja"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="stat in [
            { label: 'Empleados', value: stats.totalEmpleados, icon: Users },
            { label: 'Comunicados', value: stats.comunicadosActivos, icon: MessageSquare },
            { label: 'Encuestas', value: stats.encuestasActivas, icon: FileText },
            { label: 'Recompensas', value: stats.recompensasDisponibles, icon: Gift }
          ]"
          :key="stat.label"
          :class="[
            'bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border',
            stat.value === 0 ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <component :is="stat.icon" class="h-6 w-6 text-gray-700" />
            </div>
            <span :class="['text-3xl font-bold', stat.value === 0 ? 'text-amber-600' : 'text-gray-900']">{{ stat.value }}</span>
          </div>
          <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Wellbeing Metrics con Color -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-5 bg-gray-50">
          <h2 class="text-xl font-bold text-gray-900">Métricas de Bienestar</h2>
          <p class="text-gray-600 mt-1 text-sm">Indicadores clave de salud organizacional</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <div
              v-for="metric in wellbeingMetrics"
              :key="metric.label"
              class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm hover:border-gray-300 transition-all duration-200"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <component :is="metric.icon" class="h-5 w-5 text-gray-600" />
                </div>
                <div v-if="metric.value !== null"
                     :class="[
                       'text-2xl font-bold',
                       metric.value < 4 ? 'text-red-600' :
                       metric.value < 7 ? 'text-amber-600' :
                       'text-gray-900'
                     ]">
                  {{ metric.value }}
                </div>
                <div v-else class="text-xl text-gray-300 font-bold">-</div>
              </div>
              <h3 class="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{{ metric.label }}</h3>
              <p class="text-xs text-gray-500 line-clamp-1">{{ metric.description }}</p>

              <!-- Progress bar funcional -->
              <div v-if="metric.value !== null" class="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  :class="[
                    'h-2 rounded-full transition-all duration-500',
                    metric.value < 4 ? 'bg-red-500' :
                    metric.value < 7 ? 'bg-amber-500' :
                    'bg-gray-400'
                  ]"
                  :style="{ width: `${Math.min((metric.value / 10) * 100, 100)}%` }"
                ></div>
              </div>
              <!-- Estado sin datos con micro-CTA -->
              <div v-else class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500">Sin respuestas</span>
                  <button
                    @click="router.push('/admin/encuestas')"
                    class="text-xs text-gray-700 hover:text-gray-900 font-medium underline underline-offset-2 hover:no-underline">
                    Crear encuesta
                  </button>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2"></div>
              </div>
            </div>
          </div>

          <!-- Call to action si no hay métricas -->
          <div v-if="wellbeingMetrics.every(m => m.value === null)" class="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p class="text-sm text-gray-600 mb-3">
              Las métricas se generarán una vez que tus empleados respondan encuestas
            </p>
            <button
              @click="router.push('/admin/encuestas')"
              class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              <FileText class="h-4 w-4 mr-2" />
              Crear Primera Encuesta
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-5 bg-gray-50">
          <h2 class="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
          <p class="text-gray-600 mt-1 text-sm">Accede a las funciones principales del sistema</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <button
              v-for="action in quickActions"
              :key="action.title"
              @click="router.push(action.route)"
              class="group text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all duration-200"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <component :is="action.icon" class="h-6 w-6 text-gray-600" />
                </div>
                <ArrowRight class="h-5 w-5 text-gray-400 group-hover:translate-x-1 group-hover:text-gray-700 transition-all" />
              </div>
              <h3 class="font-bold text-gray-900 mb-2 text-lg">{{ action.title }}</h3>
              <p class="text-sm text-gray-600">{{ action.description }}</p>
              <div v-if="action.stat" class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-baseline">
                  <span class="text-xs text-gray-500 mr-2">Total:</span>
                  <span class="text-2xl font-bold text-gray-900">{{ action.stat.value }}</span>
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
        class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
      >
        Comenzar
        <ArrowRight class="h-4 w-4 ml-2" />
      </button>
    </div>

  </div>
</template>
