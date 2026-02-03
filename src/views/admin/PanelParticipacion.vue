<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  CheckCircle,
  Activity,
  FileText,
  BarChart3,
  Award,
  AlertTriangle,
  Info,
  HelpCircle,
  Send,
  Plus,
  RefreshCw,
  XCircle,
  Eye,
  Users,
  Target,
  TrendingDown,
  Clock
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const encuestas = ref([]);
const empleados = ref([]);
const departamentos = ref([]);
const respuestas = ref([]);
const isLoading = ref(true);

const estadisticas = computed(() => {
  const encuestasActivas = encuestas.value.filter(e => e.estado === 'activa' || e.estado === 'Activa').length;
  const encuestasCerradas = encuestas.value.filter(e => e.estado === 'finalizada' || e.estado === 'Finalizada').length;

  const totalEmpleados = empleados.value.length;

  let totalEmpleadosRespondieron = 0;
  encuestas.value.forEach(encuesta => {
    const respuestasEncuesta = respuestas.value.filter(r => r.encuesta_id === encuesta.id);
    const empleadosUnicos = new Set(respuestasEncuesta.map(r => r.empleado_id)).size;
    totalEmpleadosRespondieron += empleadosUnicos;
  });

  const totalPosible = totalEmpleados * encuestas.value.length;
  let tasaPromedio = 0;
  if (totalPosible > 0) {
    tasaPromedio = Math.min(100, Math.round((totalEmpleadosRespondieron / totalPosible) * 100));
  }

  return {
    tasaPromedio,
    totalRespondidos: totalEmpleadosRespondieron,
    totalEnviados: totalPosible,
    encuestasActivas,
    totalEncuestas: encuestas.value.length,
    encuestasCerradas
  };
});

const evolucion = computed(() => {
  return encuestas.value.map(encuesta => {
    const respuestasEncuesta = respuestas.value.filter(r => r.encuesta_id === encuesta.id);
    const empleadosQueRespondieron = new Set(respuestasEncuesta.map(r => r.empleado_id)).size;
    const tasa = empleados.value.length > 0
      ? Math.min(100, Math.round((empleadosQueRespondieron / empleados.value.length) * 100))
      : 0;

    return {
      fecha: encuesta.fecha_creacion,
      encuesta: encuesta.titulo,
      tasa,
      respondidos: empleadosQueRespondieron,
      enviados: empleados.value.length
    };
  }).slice(0, 10);
});

const encuestasConParticipacion = computed(() => {
  return encuestas.value.map(encuesta => {
    const respuestasEncuesta = respuestas.value.filter(r => r.encuesta_id === encuesta.id);
    const empleadosQueRespondieron = new Set(respuestasEncuesta.map(r => r.empleado_id)).size;

    const departamentosData = departamentos.value.map(dept => {
      const empleadosDept = empleados.value.filter(e => e.departamento_id === dept.id);
      const empleadosDeptIds = new Set(empleadosDept.map(e => e.id));
      const empleadosDeptQueRespondieron = new Set(
        respuestasEncuesta
          .filter(r => empleadosDeptIds.has(r.empleado_id))
          .map(r => r.empleado_id)
      ).size;

      return {
        nombre: dept.nombre,
        enviados: empleadosDept.length,
        respondidos: empleadosDeptQueRespondieron
      };
    });

    return {
      id: encuesta.id,
      titulo: encuesta.titulo,
      estado: encuesta.estado,
      fecha_envio: encuesta.fecha_inicio || encuesta.fecha_creacion,
      fecha_cierre: encuesta.fecha_fin,
      enviados: empleados.value.length,
      respondidos: empleadosQueRespondieron,
      departamentos: departamentosData
    };
  });
});

const extremos = computed(() => {
  const allDepts = [];

  encuestasConParticipacion.value.forEach(encuesta => {
    encuesta.departamentos.forEach(dept => {
      const existing = allDepts.find(d => d.nombre === dept.nombre);
      if (existing) {
        existing.enviados += dept.enviados;
        existing.respondidos += dept.respondidos;
      } else {
        allDepts.push({ ...dept });
      }
    });
  });

  const deptsConTasa = allDepts
    .filter(d => d.enviados > 0)
    .map(d => ({
      ...d,
      tasa: Math.round((d.respondidos / d.enviados) * 100)
    }))
    .sort((a, b) => b.tasa - a.tasa);

  return {
    mejor: deptsConTasa[0] || { nombre: '-', tasa: 0 },
    peor: deptsConTasa[deptsConTasa.length - 1] || { nombre: '-', tasa: 0 }
  };
});

// Computed para acciones recomendadas
const accionesRecomendadas = computed(() => {
  const acciones = [];

  // Si hay encuestas activas con baja participación
  encuestasConParticipacion.value.forEach(encuesta => {
    const tasa = calcularTasa(encuesta.enviados, encuesta.respondidos);
    if ((encuesta.estado === 'activa' || encuesta.estado === 'Activa') && tasa < 60) {
      acciones.push({
        tipo: 'recordatorio',
        encuesta: encuesta.titulo,
        encuestaId: encuesta.id,
        tasa,
        prioridad: tasa < 30 ? 'alta' : 'media'
      });
    }
  });

  return acciones;
});

const hasEncuestas = computed(() => encuestas.value.length > 0);

onMounted(async () => {
  await cargarDatos();
});

const cargarDatos = async () => {
  isLoading.value = true;
  try {
    const [encuestasRes, empleadosRes, departamentosRes, respuestasRes] = await Promise.all([
      supabase
        .from('encuestas')
        .select('*')
        .eq('empresa_id', authStore.empresaId)
        .order('fecha_creacion', { ascending: false }),

      supabase
        .from('empleados')
        .select('id, departamento_id')
        .eq('empresa_id', authStore.empresaId)
        .eq('estado', 'Activo'),

      supabase
        .from('departamentos')
        .select('id, nombre')
        .eq('empresa_id', authStore.empresaId),

      supabase
        .from('respuestas_encuesta')
        .select('encuesta_id, empleado_id')
    ]);

    if (encuestasRes.error) throw encuestasRes.error;
    if (empleadosRes.error) throw empleadosRes.error;
    if (departamentosRes.error) throw departamentosRes.error;
    if (respuestasRes.error) throw respuestasRes.error;

    encuestas.value = encuestasRes.data || [];
    empleados.value = empleadosRes.data || [];
    departamentos.value = departamentosRes.data || [];

    const encuestaIds = encuestas.value.map(e => e.id);
    respuestas.value = (respuestasRes.data || []).filter(r => encuestaIds.includes(r.encuesta_id));

  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    isLoading.value = false;
  }
};

const calcularTasa = (enviados, respondidos) => {
  if (enviados === 0) return 0;
  return Math.round((respondidos / enviados) * 100);
};

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getTasaColor = (tasa) => {
  if (tasa >= 80) return 'text-green-600';
  if (tasa >= 60) return 'text-blue-600';
  if (tasa >= 40) return 'text-orange-600';
  return 'text-red-600';
};

const getTasaColorBg = (tasa) => {
  if (tasa >= 80) return 'bg-green-500';
  if (tasa >= 60) return 'bg-blue-500';
  if (tasa >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const getBorderColorClass = (tasa) => {
  if (tasa >= 80) return 'border-green-200 bg-green-50/50';
  if (tasa >= 60) return 'border-blue-200 bg-blue-50/50';
  if (tasa >= 40) return 'border-orange-200 bg-orange-50/50';
  return 'border-red-200 bg-red-50/50';
};

const getAlertaParticipacion = (tasa) => {
  if (tasa >= 80) return { mensaje: 'Excelente participación', icono: CheckCircle, color: 'green' };
  if (tasa >= 60) return { mensaje: 'Buena participación', icono: TrendingUp, color: 'blue' };
  if (tasa >= 40) return { mensaje: 'Participación media - Considera enviar recordatorio', icono: AlertTriangle, color: 'orange' };
  return { mensaje: 'Participación baja - Acción requerida', icono: XCircle, color: 'red' };
};

const crearEncuesta = () => {
  router.push('/admin/encuestas/crear');
};

const verEncuesta = (encuestaId) => {
  router.push({ name: 'admin-encuesta-resultados', params: { encuestaId } });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header Mejorado -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <BarChart3 class="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white">Panel de Participación</h1>
                <p class="text-white/80 mt-1">
                  Detecta patrones, identifica desinterés y toma acciones basadas en datos reales
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <template v-else>

          <!-- Estado Vacío - Onboarding Contextual -->
          <template v-if="!hasEncuestas">
            <!-- Bloque Educativo -->
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-8 mb-6 shadow-sm">
              <div class="max-w-3xl mx-auto text-center">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
                  <Target class="h-10 w-10 text-indigo-600" />
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-3">
                  Aún no hay datos de participación
                </h2>

                <p class="text-gray-700 text-lg mb-6 leading-relaxed">
                  La participación mide <strong>cuántos empleados responden tus encuestas</strong> y te ayuda a detectar
                  desinterés, saturación o problemas de comunicación antes de que se conviertan en crisis.
                </p>

                <!-- CTA Principal -->
                <div class="mb-6">
                  <button
                    @click="crearEncuesta"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center text-lg group"
                  >
                    <Plus class="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
                    Crear primera encuesta
                  </button>
                </div>

                <!-- Indicadores de valor -->
                <div class="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div class="flex items-center">
                    <TrendingUp class="h-5 w-5 text-green-600 mr-2" />
                    <span>Detecta patrones</span>
                  </div>
                  <div class="flex items-center">
                    <AlertTriangle class="h-5 w-5 text-orange-600 mr-2" />
                    <span>Previene crisis</span>
                  </div>
                  <div class="flex items-center">
                    <Users class="h-5 w-5 text-blue-600 mr-2" />
                    <span>Por departamento</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview del Estado Futuro -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye class="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Vista previa: Tu panel de control</h3>
                  <p class="text-sm text-gray-600">Esto es lo que verás cuando tengas encuestas activas</p>
                </div>
              </div>

              <!-- Grid de métricas simuladas -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Tasa Promedio</p>
                    <TrendingUp class="h-5 w-5 text-gray-400" />
                  </div>
                  <p class="text-2xl font-bold text-gray-400">---%</p>
                  <p class="text-xs text-gray-500 mt-1">Porcentaje medio de empleados que responden</p>
                </div>

                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Total Respuestas</p>
                    <CheckCircle class="h-5 w-5 text-gray-400" />
                  </div>
                  <p class="text-2xl font-bold text-gray-400">---</p>
                  <p class="text-xs text-gray-500 mt-1">Respuestas recibidas vs total de empleados</p>
                </div>

                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Encuestas Activas</p>
                    <Activity class="h-5 w-5 text-gray-400" />
                  </div>
                  <p class="text-2xl font-bold text-gray-400">---</p>
                  <p class="text-xs text-gray-500 mt-1">Esperando respuestas en este momento</p>
                </div>

                <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-500">Total Encuestas</p>
                    <FileText class="h-5 w-5 text-gray-400" />
                  </div>
                  <p class="text-2xl font-bold text-gray-400">---</p>
                  <p class="text-xs text-gray-500 mt-1">Activas + cerradas en tu historial</p>
                </div>
              </div>

              <!-- Lista de características futuras -->
              <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p class="text-sm font-semibold text-indigo-900 mb-3">Cuando tengas encuestas activas, aquí verás:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Participación por encuesta</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Participación por departamento</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Evolución temporal (↑ ↓)</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Alertas de baja participación</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Mejor y peor departamento</span>
                  </div>
                  <div class="flex items-center text-gray-700">
                    <CheckCircle class="h-4 w-4 text-indigo-500 mr-2 flex-shrink-0" />
                    <span>Acciones recomendadas</span>
                  </div>
                </div>
              </div>

              <p class="text-sm text-gray-500 mt-4 text-center">
                Crea tu primera encuesta para comenzar a monitorear el engagement de tu equipo
              </p>
            </div>
          </template>

          <!-- Estado Con Datos -->
          <template v-else>

            <!-- Estadísticas Globales CON TOOLTIPS -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <!-- Tasa Promedio -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <p class="text-sm font-medium text-gray-500">Tasa Promedio</p>
                      <div
                        class="ml-2 cursor-help"
                        title="Porcentaje medio de empleados que han respondido tus encuestas. Una tasa inferior al 60% puede indicar falta de engagement."
                      >
                        <HelpCircle class="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-indigo-600 mb-1">{{ estadisticas.tasaPromedio }}%</p>
                    <p class="text-xs text-gray-500">
                      {{ estadisticas.tasaPromedio >= 80 ? 'Excelente' : estadisticas.tasaPromedio >= 60 ? 'Buena' : estadisticas.tasaPromedio >= 40 ? 'Media' : 'Baja' }} participación
                    </p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                    <TrendingUp class="h-7 w-7 text-indigo-600" />
                  </div>
                </div>
              </div>

              <!-- Total Respuestas -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <p class="text-sm font-medium text-gray-500">Total Respuestas</p>
                      <div
                        class="ml-2 cursor-help"
                        title="Número total de respuestas recibidas vs total posible (empleados × encuestas)"
                      >
                        <HelpCircle class="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-green-600 mb-1">{{ estadisticas.totalRespondidos }}</p>
                    <p class="text-xs text-gray-500">de {{ estadisticas.totalEnviados }} posibles</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle class="h-7 w-7 text-green-600" />
                  </div>
                </div>
              </div>

              <!-- Encuestas Activas -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <p class="text-sm font-medium text-gray-500">Encuestas Activas</p>
                      <div
                        class="ml-2 cursor-help"
                        title="Encuestas que están esperando respuestas en este momento"
                      >
                        <HelpCircle class="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-blue-600 mb-1">{{ estadisticas.encuestasActivas }}</p>
                    <p class="text-xs text-gray-500">Esperando respuestas</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity class="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </div>

              <!-- Total Encuestas -->
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <p class="text-sm font-medium text-gray-500">Total Encuestas</p>
                      <div
                        class="ml-2 cursor-help"
                        title="Total de encuestas creadas (activas + cerradas)"
                      >
                        <HelpCircle class="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ estadisticas.totalEncuestas }}</p>
                    <p class="text-xs text-gray-500">{{ estadisticas.encuestasCerradas }} cerradas</p>
                  </div>
                  <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText class="h-7 w-7 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico de Evolución Temporal -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Evolución de Participación</h2>
                  <p class="text-sm text-gray-600">Histórico de tasas de respuesta por encuesta</p>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  v-for="item in evolucion"
                  :key="item.encuesta"
                  class="flex items-center gap-4"
                >
                  <div class="w-32 flex-shrink-0">
                    <p class="text-xs font-medium text-gray-500">{{ formatearFecha(item.fecha) }}</p>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-1">
                      <p class="text-sm font-medium text-gray-900">{{ item.encuesta }}</p>
                      <span class="text-sm font-bold" :class="getTasaColor(item.tasa)">
                        {{ item.tasa }}%
                      </span>
                    </div>
                    <div class="relative w-full bg-gray-200 rounded-full h-3">
                      <div
                        class="h-3 rounded-full transition-all duration-500"
                        :class="getTasaColorBg(item.tasa)"
                        :style="{ width: `${item.tasa}%` }"
                      ></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">{{ item.respondidos }}/{{ item.enviados }} empleados</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desglose por Encuesta y Departamento CON ALERTAS -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div class="flex items-center mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Activity class="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Participación por Departamento</h2>
                  <p class="text-sm text-gray-600">Detalle de respuestas por área organizacional</p>
                </div>
              </div>

              <div class="space-y-6">
                <div
                  v-for="encuesta in encuestasConParticipacion"
                  :key="encuesta.id"
                  class="border rounded-xl p-6"
                  :class="getBorderColorClass(calcularTasa(encuesta.enviados, encuesta.respondidos))"
                >
                  <!-- Header Encuesta CON ALERTA -->
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ encuesta.titulo }}</h3>
                      <p class="text-sm text-gray-600 mb-2">
                        Enviada: {{ formatearFecha(encuesta.fecha_envio) }}
                        <span v-if="encuesta.fecha_cierre"> • Cierre: {{ formatearFecha(encuesta.fecha_cierre) }}</span>
                      </p>

                      <!-- Alerta Contextual -->
                      <div
                        v-if="calcularTasa(encuesta.enviados, encuesta.respondidos) < 80"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium mt-2"
                        :class="{
                          'bg-orange-100 text-orange-800': calcularTasa(encuesta.enviados, encuesta.respondidos) >= 40,
                          'bg-red-100 text-red-800': calcularTasa(encuesta.enviados, encuesta.respondidos) < 40
                        }"
                      >
                        <component
                          :is="getAlertaParticipacion(calcularTasa(encuesta.enviados, encuesta.respondidos)).icono"
                          class="h-4 w-4"
                        />
                        <span>{{ getAlertaParticipacion(calcularTasa(encuesta.enviados, encuesta.respondidos)).mensaje }}</span>
                      </div>
                    </div>
                    <div class="text-right ml-4">
                      <p class="text-3xl font-bold" :class="getTasaColor(calcularTasa(encuesta.enviados, encuesta.respondidos))">
                        {{ calcularTasa(encuesta.enviados, encuesta.respondidos) }}%
                      </p>
                      <p class="text-xs text-gray-500">{{ encuesta.respondidos }}/{{ encuesta.enviados }}</p>
                      <button
                        @click="verEncuesta(encuesta.id)"
                        class="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                      >
                        <Eye class="h-3 w-3 mr-1" />
                        Ver resultados
                      </button>
                    </div>
                  </div>

                  <!-- Barra Global -->
                  <div class="mb-4">
                    <div class="relative w-full bg-gray-200 rounded-full h-3">
                      <div
                        class="h-3 rounded-full transition-all duration-500"
                        :class="getTasaColorBg(calcularTasa(encuesta.enviados, encuesta.respondidos))"
                        :style="{ width: `${calcularTasa(encuesta.enviados, encuesta.respondidos)}%` }"
                      ></div>
                    </div>
                  </div>

                  <!-- Departamentos -->
                  <div v-if="encuesta.departamentos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      v-for="dept in encuesta.departamentos"
                      :key="dept.nombre"
                      class="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <p class="text-xs font-medium text-gray-700 mb-1">{{ dept.nombre }}</p>
                      <div class="flex items-center justify-between">
                        <p class="text-lg font-bold" :class="getTasaColor(calcularTasa(dept.enviados, dept.respondidos))">
                          {{ calcularTasa(dept.enviados, dept.respondidos) }}%
                        </p>
                        <p class="text-xs text-gray-500">{{ dept.respondidos }}/{{ dept.enviados }}</p>
                      </div>
                      <div class="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          class="h-1.5 rounded-full transition-all"
                          :class="getTasaColorBg(calcularTasa(dept.enviados, dept.respondidos))"
                          :style="{ width: `${calcularTasa(dept.enviados, dept.respondidos)}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Insights y Recomendaciones -->
            <div v-if="extremos.mejor.nombre !== '-'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <!-- Mejor Departamento -->
              <div class="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Award class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-green-900 mb-2">Mejor Participación</h3>
                    <p class="text-sm text-green-800 mb-3">
                      <strong>{{ extremos.mejor.nombre }}</strong> lidera con una tasa de
                      <strong>{{ extremos.mejor.tasa }}%</strong> de participación.
                    </p>
                    <p class="text-xs text-green-700">
                      ¡Excelente compromiso! Considera compartir sus prácticas con otros departamentos.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Departamento que Necesita Atención -->
              <div class="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <AlertTriangle class="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-orange-900 mb-2">Requiere Atención</h3>
                    <p class="text-sm text-orange-800 mb-3">
                      <strong>{{ extremos.peor.nombre }}</strong> tiene una tasa de
                      <strong>{{ extremos.peor.tasa }}%</strong> de participación.
                    </p>
                    <p class="text-xs text-orange-700">
                      Considera enviar recordatorios personalizados o investigar posibles barreras de participación.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bloque de Acciones Recomendadas -->
            <div v-if="accionesRecomendadas.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                  <Target class="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Acciones Recomendadas</h2>
                  <p class="text-sm text-gray-600">Tareas sugeridas para mejorar la participación</p>
                </div>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(accion, index) in accionesRecomendadas"
                  :key="index"
                  class="flex items-start gap-4 p-4 rounded-lg border-2"
                  :class="{
                    'bg-red-50 border-red-200': accion.prioridad === 'alta',
                    'bg-orange-50 border-orange-200': accion.prioridad === 'media'
                  }"
                >
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="{
                      'bg-red-100': accion.prioridad === 'alta',
                      'bg-orange-100': accion.prioridad === 'media'
                    }"
                  >
                    <Send
                      class="h-5 w-5"
                      :class="{
                        'text-red-600': accion.prioridad === 'alta',
                        'text-orange-600': accion.prioridad === 'media'
                      }"
                    />
                  </div>
                  <div class="flex-1">
                    <p
                      class="font-semibold mb-1"
                      :class="{
                        'text-red-900': accion.prioridad === 'alta',
                        'text-orange-900': accion.prioridad === 'media'
                      }"
                    >
                      Enviar recordatorio: {{ accion.encuesta }}
                    </p>
                    <p
                      class="text-sm mb-2"
                      :class="{
                        'text-red-800': accion.prioridad === 'alta',
                        'text-orange-800': accion.prioridad === 'media'
                      }"
                    >
                      Esta encuesta tiene una participación de <strong>{{ accion.tasa }}%</strong>.
                      {{ accion.prioridad === 'alta' ? 'Acción urgente requerida.' : 'Considera enviar un recordatorio.' }}
                    </p>
                    <button
                      @click="verEncuesta(accion.encuestaId)"
                      class="text-sm font-medium inline-flex items-center"
                      :class="{
                        'text-red-700 hover:text-red-900': accion.prioridad === 'alta',
                        'text-orange-700 hover:text-orange-900': accion.prioridad === 'media'
                      }"
                    >
                      Ver encuesta
                      <Eye class="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </template>

        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animaciones suaves para hover */
.hover\:shadow-md {
  transition: box-shadow 0.2s ease-in-out;
}
</style>
