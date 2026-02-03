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
  Home,
  HelpCircle,
  UserPlus,
  Send,
  Plus,
  Lightbulb,
  Calendar,
  Bell,
  Sparkles,
  Clock,
  Zap,
  Target,
  TrendingDown,
  Award
} from 'lucide-vue-next';
import SystemHealthWidget from '@/components/admin/SystemHealthWidget.vue';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const empresa = ref(null);
const adminName = ref('');
const lastLogin = ref(null);

// Saludo según hora del día
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
});
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
    // Cargar datos de empresa y admin en paralelo
    const [empresaResult, adminResult] = await Promise.all([
      supabase
        .from('empresas')
        .select('*')
        .eq('id', authStore.empresaId)
        .maybeSingle(),
      supabase
        .from('empleados')
        .select('nombre')
        .eq('auth_user_id', authStore.user?.id)
        .maybeSingle()
    ]);

    empresa.value = empresaResult.data;
    adminName.value = adminResult.data?.nombre?.split(' ')[0] || authStore.user?.email?.split('@')[0] || 'Admin';

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

// Acciones contextuales basadas en el estado del sistema
const contextualActions = computed(() => {
  const actions = [];

  // Prioridad 1: Acciones urgentes basadas en estado
  if (stats.value.totalEmpleados === 0) {
    actions.push({
      title: 'Invitar empleados',
      description: 'Tu equipo está vacío. Invita empleados para comenzar.',
      icon: UserPlus,
      route: '/admin/empleados',
      priority: 'high',
      color: 'indigo'
    });
  }

  if (stats.value.encuestasActivas === 0 && stats.value.totalEmpleados > 0) {
    actions.push({
      title: 'Crear encuesta',
      description: 'Mide el bienestar de tu equipo con una encuesta.',
      icon: FileText,
      route: '/admin/encuestas/crear',
      priority: 'high',
      color: 'purple'
    });
  }

  if (healthData.value.solicitudesPendientes > 0) {
    actions.push({
      title: 'Revisar solicitudes',
      description: `${healthData.value.solicitudesPendientes} solicitud${healthData.value.solicitudesPendientes !== 1 ? 'es' : ''} esperando aprobación.`,
      icon: Clock,
      route: '/admin/solicitudes',
      priority: 'high',
      color: 'amber'
    });
  }

  if (healthData.value.participacionBaja.length > 0) {
    actions.push({
      title: 'Impulsar participación',
      description: `${healthData.value.participacionBaja.length} encuesta${healthData.value.participacionBaja.length !== 1 ? 's' : ''} con baja respuesta.`,
      icon: TrendingUp,
      route: '/admin/encuestas',
      priority: 'medium',
      color: 'orange'
    });
  }

  // Prioridad 2: Acciones sugeridas
  if (stats.value.comunicadosActivos === 0 && stats.value.totalEmpleados > 0) {
    actions.push({
      title: 'Enviar comunicado',
      description: 'Mantén informado a tu equipo con un mensaje.',
      icon: Send,
      route: '/admin/comunicacion',
      priority: 'medium',
      color: 'teal'
    });
  }

  if (stats.value.recompensasDisponibles === 0 && stats.value.totalEmpleados > 0) {
    actions.push({
      title: 'Agregar recompensas',
      description: 'Motiva a tu equipo con premios canjeables.',
      icon: Gift,
      route: '/admin/recompensas',
      priority: 'medium',
      color: 'pink'
    });
  }

  // Prioridad 3: Acciones por defecto si no hay urgentes
  if (actions.length < 3) {
    const defaultActions = [
      {
        title: 'Gestionar empleados',
        description: `${stats.value.totalEmpleados} empleado${stats.value.totalEmpleados !== 1 ? 's' : ''} activo${stats.value.totalEmpleados !== 1 ? 's' : ''} en tu equipo.`,
        icon: Users,
        route: '/admin/empleados',
        priority: 'low',
        color: 'blue'
      },
      {
        title: 'Ver analítica',
        description: 'Revisa métricas y tendencias de bienestar.',
        icon: TrendingUp,
        route: '/admin/analitica',
        priority: 'low',
        color: 'emerald'
      },
      {
        title: 'Comunicados',
        description: `${stats.value.comunicadosActivos} comunicado${stats.value.comunicadosActivos !== 1 ? 's' : ''} enviado${stats.value.comunicadosActivos !== 1 ? 's' : ''}.`,
        icon: MessageSquare,
        route: '/admin/comunicacion',
        priority: 'low',
        color: 'orange'
      }
    ];

    for (const action of defaultActions) {
      if (actions.length >= 3) break;
      if (!actions.find(a => a.route === action.route)) {
        actions.push(action);
      }
    }
  }

  return actions.slice(0, 3);
});

const getActionColors = (color) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', border: 'hover:border-indigo-300', text: 'text-indigo-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', border: 'hover:border-purple-300', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', border: 'hover:border-amber-300', text: 'text-amber-600' },
    orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-600', border: 'hover:border-orange-300', text: 'text-orange-600' },
    teal: { bg: 'bg-teal-50', icon: 'bg-teal-100 text-teal-600', border: 'hover:border-teal-300', text: 'text-teal-600' },
    pink: { bg: 'bg-pink-50', icon: 'bg-pink-100 text-pink-600', border: 'hover:border-pink-300', text: 'text-pink-600' },
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', border: 'hover:border-blue-300', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', border: 'hover:border-emerald-300', text: 'text-emerald-600' }
  };
  return colors[color] || colors.blue;
};

const wellbeingMetrics = computed(() => [
  {
    label: 'Salud Mental',
    value: metrics.value.saludMental,
    icon: Brain,
    description: 'Bienestar psicológico',
    tooltip: 'Mide estrés, ansiedad y bienestar emocional. Escala 1-10 donde 7+ es saludable.'
  },
  {
    label: 'Ergonomía',
    value: metrics.value.ergonomia,
    icon: Activity,
    description: 'Condiciones físicas',
    tooltip: 'Evalúa comodidad física, postura y condiciones de trabajo. Escala 1-10.'
  },
  {
    label: 'Satisfacción Laboral',
    value: metrics.value.satisfaccionLaboral,
    icon: Heart,
    description: 'Nivel de satisfacción',
    tooltip: 'Indica qué tan contentos están los empleados con su trabajo. 7+ es positivo.'
  },
  {
    label: 'Balance Vida-Trabajo',
    value: metrics.value.balanceVidaTrabajo,
    icon: Home,
    description: 'Equilibrio personal',
    tooltip: 'Mide si los empleados logran equilibrar trabajo y vida personal. 7+ es saludable.'
  },
  {
    label: 'Ambiente Laboral',
    value: metrics.value.ambienteLaboral,
    icon: Shield,
    description: 'Clima organizacional',
    tooltip: 'Refleja las relaciones, comunicación y cultura del equipo. 7+ indica buen clima.'
  }
]);

// Insights dinámicos de la semana
const weeklyInsights = computed(() => {
  const insights = [];

  // Insight sobre participación
  if (healthData.value.participacionBaja.length > 0) {
    const avgParticipacion = healthData.value.participacionBaja.reduce((sum, e) => sum + e.participacion, 0) / healthData.value.participacionBaja.length;
    insights.push({
      id: 'participacion',
      icon: Target,
      title: 'Participación en encuestas',
      value: `${Math.round(avgParticipacion)}%`,
      trend: avgParticipacion < 50 ? 'down' : 'neutral',
      description: avgParticipacion < 50
        ? 'Por debajo del objetivo. Considera enviar recordatorios.'
        : 'Participación moderada. Hay margen de mejora.',
      color: avgParticipacion < 50 ? 'red' : 'amber'
    });
  } else if (stats.value.encuestasActivas > 0) {
    insights.push({
      id: 'participacion',
      icon: Target,
      title: 'Participación en encuestas',
      value: 'Alta',
      trend: 'up',
      description: 'Excelente nivel de respuesta de tu equipo.',
      color: 'green'
    });
  }

  // Insight sobre bienestar
  const metricsWithValue = wellbeingMetrics.value.filter(m => m.value !== null);
  if (metricsWithValue.length > 0) {
    const avgWellbeing = metricsWithValue.reduce((sum, m) => sum + m.value, 0) / metricsWithValue.length;
    insights.push({
      id: 'bienestar',
      icon: Heart,
      title: 'Índice de bienestar',
      value: avgWellbeing.toFixed(1),
      trend: avgWellbeing >= 7 ? 'up' : avgWellbeing >= 5 ? 'neutral' : 'down',
      description: avgWellbeing >= 7
        ? 'Tu equipo reporta buen bienestar general.'
        : avgWellbeing >= 5
        ? 'Bienestar moderado. Identifica áreas de mejora.'
        : 'Requiere atención. Revisa métricas individuales.',
      color: avgWellbeing >= 7 ? 'green' : avgWellbeing >= 5 ? 'amber' : 'red'
    });
  }

  // Insight sobre actividad
  const totalActividad = stats.value.comunicadosActivos + stats.value.encuestasActivas;
  if (stats.value.totalEmpleados > 0) {
    insights.push({
      id: 'actividad',
      icon: Zap,
      title: 'Actividad de la plataforma',
      value: totalActividad > 0 ? 'Activa' : 'Baja',
      trend: totalActividad > 0 ? 'up' : 'neutral',
      description: totalActividad > 0
        ? `${stats.value.encuestasActivas} encuesta${stats.value.encuestasActivas !== 1 ? 's' : ''} y ${stats.value.comunicadosActivos} comunicado${stats.value.comunicadosActivos !== 1 ? 's' : ''} activos.`
        : 'No hay encuestas ni comunicados activos esta semana.',
      color: totalActividad > 0 ? 'blue' : 'gray'
    });
  }

  // Insight sobre recompensas
  if (stats.value.recompensasDisponibles > 0) {
    insights.push({
      id: 'recompensas',
      icon: Award,
      title: 'Programa de recompensas',
      value: `${stats.value.recompensasDisponibles}`,
      trend: 'up',
      description: `${stats.value.recompensasDisponibles} recompensa${stats.value.recompensasDisponibles !== 1 ? 's' : ''} disponible${stats.value.recompensasDisponibles !== 1 ? 's' : ''} para canjear.`,
      color: 'purple'
    });
  }

  return insights.slice(0, 4);
});

const getInsightColors = (color) => {
  const colors = {
    green: { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
    gray: { bg: 'bg-gray-50', icon: 'text-gray-500', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' }
  };
  return colors[color] || colors.gray;
};
</script>

<template>
  <div class="space-y-6">

    <!-- Header con saludo personalizado -->
    <div class="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

      <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center space-x-4">
          <div class="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Sparkles class="h-7 w-7 md:h-8 md:w-8 text-white" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              {{ greeting }}, {{ adminName }}
            </h1>
            <p class="text-white/80 mt-0.5 text-sm md:text-base">{{ empresa?.nombre || 'Cargando...' }}</p>
          </div>
        </div>

        <!-- Acceso rápido a notificaciones -->
        <div class="flex items-center gap-3">
          <button
            v-if="healthData.participacionBaja.length > 0 || healthData.encuestasCerrandoPronto.length > 0"
            class="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-colors"
            @click="router.push('/admin/encuestas')"
          >
            <Bell class="w-4 h-4" />
            <span class="hidden sm:inline">{{ healthData.participacionBaja.length + healthData.encuestasCerrandoPronto.length }} pendiente{{ (healthData.participacionBaja.length + healthData.encuestasCerrandoPronto.length) !== 1 ? 's' : '' }}</span>
          </button>
          <div class="text-white/60 text-xs hidden md:block">
            {{ new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900"></div>
    </div>

    <!-- Stats Grid con Color -->
    <template v-else-if="hasData">
      <!-- System Health Widget - Condensado -->
      <SystemHealthWidget
        :encuestas-activas="stats.encuestasActivas"
        :solicitudes-pendientes="healthData.solicitudesPendientes"
        :empleados-sin-responder="healthData.empleadosSinResponder"
        :encuestas-cerrando-pronto="healthData.encuestasCerrandoPronto"
        :participacion-baja="healthData.participacionBaja"
        :total-empleados="stats.totalEmpleados"
      />

      <!-- Insights de la Semana -->
      <div v-if="weeklyInsights.length > 0" class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-5 py-3 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <h2 class="text-sm font-semibold text-gray-900">Insights de la Semana</h2>
          </div>
          <span class="text-xs text-gray-500">Actualizado hoy</span>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="insight in weeklyInsights"
              :key="insight.id"
              :class="[
                'rounded-xl p-4 border transition-all duration-200',
                getInsightColors(insight.color).bg,
                'border-transparent hover:shadow-sm'
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center bg-white/80']">
                  <component :is="insight.icon" :class="['h-4 w-4', getInsightColors(insight.color).icon]" />
                </div>
                <div class="flex items-center gap-1">
                  <TrendingUp
                    v-if="insight.trend === 'up'"
                    class="w-3.5 h-3.5 text-green-500"
                  />
                  <TrendingDown
                    v-else-if="insight.trend === 'down'"
                    class="w-3.5 h-3.5 text-red-500"
                  />
                  <div v-else class="w-3.5 h-3.5 rounded-full bg-gray-300"></div>
                </div>
              </div>
              <div class="mb-1">
                <span :class="['text-xl font-bold', getInsightColors(insight.color).text]">
                  {{ insight.value }}
                </span>
              </div>
              <h3 class="text-xs font-medium text-gray-700 mb-1">{{ insight.title }}</h3>
              <p class="text-xs text-gray-500 line-clamp-2">{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- KPIs con jerarquía visual mejorada -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- KPI Principal: Empleados (más grande, destaca) -->
        <div
          @click="router.push('/admin/empleados')"
          :class="[
            'lg:col-span-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group'
          ]"
        >
          <!-- Decoración -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users class="h-7 w-7 text-white" />
              </div>
              <span class="group relative cursor-help">
                <HelpCircle class="w-5 h-5 text-white/60 hover:text-white/90" />
                <span class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Empleados activos en tu organización
                </span>
              </span>
            </div>

            <div class="mb-4">
              <span class="text-5xl font-bold text-white">{{ stats.totalEmpleados }}</span>
              <p class="text-lg font-medium text-white/90 mt-1">Empleados activos</p>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/20">
              <p class="text-sm text-white/70">Base de tu plataforma</p>
              <div class="flex items-center gap-2 text-white font-medium text-sm group-hover:translate-x-1 transition-transform">
                <span>Gestionar</span>
                <ArrowRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs Secundarios (3 tarjetas en grid) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Comunicados -->
          <div
            @click="router.push('/admin/comunicacion')"
            :class="[
              'bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border cursor-pointer group',
              stats.comunicadosActivos === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-orange-300'
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare class="h-5 w-5 text-orange-600" />
              </div>
              <span class="group/tooltip relative cursor-help">
                <HelpCircle class="w-4 h-4 text-gray-400 hover:text-gray-600" />
                <span class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Mensajes enviados a empleados
                </span>
              </span>
            </div>
            <span :class="['text-3xl font-bold block mb-1', stats.comunicadosActivos === 0 ? 'text-amber-600' : 'text-gray-900']">
              {{ stats.comunicadosActivos }}
            </span>
            <p class="text-sm text-gray-600 mb-2">Comunicados</p>
            <div class="flex items-center gap-1 text-xs text-orange-600 font-medium group-hover:translate-x-0.5 transition-transform">
              <Send class="w-3 h-3" />
              <span>Enviar mensaje</span>
            </div>
          </div>

          <!-- Encuestas -->
          <div
            @click="router.push('/admin/encuestas')"
            :class="[
              'bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border cursor-pointer group',
              stats.encuestasActivas === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-indigo-300'
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText class="h-5 w-5 text-indigo-600" />
              </div>
              <span class="group/tooltip relative cursor-help">
                <HelpCircle class="w-4 h-4 text-gray-400 hover:text-gray-600" />
                <span class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Encuestas activas recibiendo respuestas
                </span>
              </span>
            </div>
            <span :class="['text-3xl font-bold block mb-1', stats.encuestasActivas === 0 ? 'text-amber-600' : 'text-gray-900']">
              {{ stats.encuestasActivas }}
            </span>
            <p class="text-sm text-gray-600 mb-2">Encuestas activas</p>
            <div class="flex items-center gap-1 text-xs text-indigo-600 font-medium group-hover:translate-x-0.5 transition-transform">
              <Plus class="w-3 h-3" />
              <span>Crear encuesta</span>
            </div>
          </div>

          <!-- Recompensas -->
          <div
            @click="router.push('/admin/recompensas')"
            :class="[
              'bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border cursor-pointer group',
              stats.recompensasDisponibles === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 hover:border-amber-300'
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Gift class="h-5 w-5 text-amber-600" />
              </div>
              <span class="group/tooltip relative cursor-help">
                <HelpCircle class="w-4 h-4 text-gray-400 hover:text-gray-600" />
                <span class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                  Recompensas disponibles para canjear
                </span>
              </span>
            </div>
            <span :class="['text-3xl font-bold block mb-1', stats.recompensasDisponibles === 0 ? 'text-amber-600' : 'text-gray-900']">
              {{ stats.recompensasDisponibles }}
            </span>
            <p class="text-sm text-gray-600 mb-2">Recompensas</p>
            <div class="flex items-center gap-1 text-xs text-amber-600 font-medium group-hover:translate-x-0.5 transition-transform">
              <Plus class="w-3 h-3" />
              <span>Agregar premio</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Wellbeing Metrics -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Métricas de Bienestar</h2>
            <p class="text-gray-500 text-sm">Indicadores clave de salud organizacional</p>
          </div>
          <button
            v-if="wellbeingMetrics.some(m => m.value !== null)"
            @click="router.push('/admin/analitica')"
            class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            Ver analítica completa
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Estado con datos: mostrar métricas -->
        <div v-if="wellbeingMetrics.some(m => m.value !== null)" class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="metric in wellbeingMetrics"
              :key="metric.label"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-gray-300 transition-all duration-200 group relative"
            >
              <!-- Tooltip -->
              <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
                {{ metric.tooltip || metric.description }}
              </span>

              <div class="flex items-center gap-3 mb-2">
                <div class="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                  <component :is="metric.icon" class="h-4 w-4 text-gray-600" />
                </div>
                <div v-if="metric.value !== null"
                     :class="[
                       'text-2xl font-bold',
                       metric.value < 4 ? 'text-red-600' :
                       metric.value < 7 ? 'text-amber-600' :
                       'text-green-600'
                     ]">
                  {{ metric.value }}
                </div>
                <div v-else class="text-lg text-gray-300 font-bold">-</div>
              </div>
              <h3 class="font-medium text-gray-900 text-sm">{{ metric.label }}</h3>

              <!-- Progress bar -->
              <div class="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  v-if="metric.value !== null"
                  :class="[
                    'h-1.5 rounded-full transition-all duration-500',
                    metric.value < 4 ? 'bg-red-500' :
                    metric.value < 7 ? 'bg-amber-500' :
                    'bg-green-500'
                  ]"
                  :style="{ width: `${Math.min((metric.value / 10) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío: Card de onboarding compacto -->
        <div v-else class="p-6">
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
            <div class="flex flex-col lg:flex-row items-center gap-6">
              <!-- Iconos de métricas en fila -->
              <div class="flex items-center gap-3">
                <div
                  v-for="metric in wellbeingMetrics"
                  :key="metric.label"
                  class="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm border border-white"
                  :title="metric.label"
                >
                  <component :is="metric.icon" class="h-6 w-6 text-indigo-400" />
                </div>
              </div>

              <!-- Texto y CTA -->
              <div class="flex-1 text-center lg:text-left">
                <h3 class="font-semibold text-gray-900 mb-1">Empieza a medir el bienestar</h3>
                <p class="text-sm text-gray-600 mb-4">
                  Crea tu primera encuesta para obtener métricas de salud mental, satisfacción y ambiente laboral.
                </p>
                <button
                  @click="router.push('/admin/encuestas/crear')"
                  class="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <FileText class="h-4 w-4 mr-2" />
                  Crear primera encuesta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones Rápidas Contextuales -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Siguientes Pasos</h2>
            <p class="text-gray-500 text-sm">Acciones recomendadas según el estado actual</p>
          </div>
          <Lightbulb class="w-5 h-5 text-amber-500" />
        </div>

        <div class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="(action, index) in contextualActions"
              :key="action.title"
              @click="router.push(action.route)"
              :class="[
                'group text-left p-5 rounded-xl border transition-all duration-200 relative overflow-hidden',
                'border-gray-200',
                getActionColors(action.color).border
              ]"
            >
              <!-- Badge de prioridad -->
              <div
                v-if="action.priority === 'high'"
                class="absolute top-3 right-3"
              >
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Urgente
                </span>
              </div>

              <div class="flex items-start gap-4">
                <div :class="[
                  'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                  getActionColors(action.color).icon
                ]">
                  <component :is="action.icon" class="h-5 w-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 mb-1 text-sm">{{ action.title }}</h3>
                  <p class="text-xs text-gray-500 line-clamp-2">{{ action.description }}</p>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                <span :class="[
                  'text-xs font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform',
                  getActionColors(action.color).text
                ]">
                  Ir ahora
                  <ArrowRight class="w-3.5 h-3.5" />
                </span>
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
