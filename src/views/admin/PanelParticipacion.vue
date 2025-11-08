<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  CheckCircle,
  Activity,
  FileText,
  BarChart3,
  Award,
  AlertTriangle
} from 'lucide-vue-next';

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
  const totalRespuestas = respuestas.value.length;

  let tasaPromedio = 0;
  if (totalEmpleados > 0 && encuestas.value.length > 0) {
    tasaPromedio = Math.round((totalRespuestas / (totalEmpleados * encuestas.value.length)) * 100);
  }

  return {
    tasaPromedio,
    totalRespondidos: totalRespuestas,
    totalEnviados: totalEmpleados * encuestas.value.length,
    encuestasActivas,
    totalEncuestas: encuestas.value.length,
    encuestasCerradas
  };
});

const evolucion = computed(() => {
  return encuestas.value.map(encuesta => {
    const respuestasEncuesta = respuestas.value.filter(r => r.encuesta_id === encuesta.id);
    const tasa = empleados.value.length > 0
      ? Math.round((respuestasEncuesta.length / empleados.value.length) * 100)
      : 0;

    return {
      fecha: encuesta.fecha_creacion,
      encuesta: encuesta.titulo,
      tasa,
      respondidos: respuestasEncuesta.length,
      enviados: empleados.value.length
    };
  }).slice(0, 10);
});

const encuestasConParticipacion = computed(() => {
  return encuestas.value.map(encuesta => {
    const respuestasEncuesta = respuestas.value.filter(r => r.encuesta_id === encuesta.id);

    const departamentosData = departamentos.value.map(dept => {
      const empleadosDept = empleados.value.filter(e => e.departamento_id === dept.id);
      const respuestasDept = respuestasEncuesta.filter(r => {
        const empleado = empleados.value.find(e => e.id === r.empleado_id);
        return empleado && empleado.departamento_id === dept.id;
      });

      return {
        nombre: dept.nombre,
        enviados: empleadosDept.length,
        respondidos: respuestasDept.length
      };
    });

    return {
      id: encuesta.id,
      titulo: encuesta.titulo,
      estado: encuesta.estado,
      fecha_envio: encuesta.fecha_inicio || encuesta.fecha_creacion,
      fecha_cierre: encuesta.fecha_fin,
      enviados: empleados.value.length,
      respondidos: respuestasEncuesta.length,
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
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Panel de Participación</h1>
          <p class="text-gray-600 mt-2">Monitorea en tiempo real el avance de las encuestas y la tasa de respuesta por área</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <template v-else>

          <!-- Estadísticas Globales -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Tasa Promedio -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Tasa Promedio</p>
                  <p class="text-3xl font-bold text-indigo-600">{{ estadisticas.tasaPromedio }}%</p>
                  <p class="text-xs text-gray-500 mt-1">En todas las encuestas</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <TrendingUp class="h-7 w-7 text-indigo-600" />
                </div>
              </div>
            </div>

            <!-- Total Respuestas -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Total Respuestas</p>
                  <p class="text-3xl font-bold text-green-600">{{ estadisticas.totalRespondidos }}</p>
                  <p class="text-xs text-gray-500 mt-1">de {{ estadisticas.totalEnviados }} posibles</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle class="h-7 w-7 text-green-600" />
                </div>
              </div>
            </div>

            <!-- Encuestas Activas -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Encuestas Activas</p>
                  <p class="text-3xl font-bold text-blue-600">{{ estadisticas.encuestasActivas }}</p>
                  <p class="text-xs text-gray-500 mt-1">En curso</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <Activity class="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </div>

            <!-- Total Encuestas -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">Total Encuestas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalEncuestas }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ estadisticas.encuestasCerradas }} cerradas</p>
                </div>
                <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText class="h-7 w-7 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Sin Datos -->
          <div v-if="encuestas.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No hay encuestas aún</h3>
            <p class="text-gray-500">Crea encuestas para empezar a monitorear la participación de tu equipo.</p>
          </div>

          <template v-else>

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

            <!-- Desglose por Encuesta y Departamento -->
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
                  <!-- Header Encuesta -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex-1">
                      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ encuesta.titulo }}</h3>
                      <p class="text-sm text-gray-600">
                        Enviada: {{ formatearFecha(encuesta.fecha_envio) }}
                        <span v-if="encuesta.fecha_cierre"> • Cierre: {{ formatearFecha(encuesta.fecha_cierre) }}</span>
                      </p>
                    </div>
                    <div class="text-right ml-4">
                      <p class="text-3xl font-bold" :class="getTasaColor(calcularTasa(encuesta.enviados, encuesta.respondidos))">
                        {{ calcularTasa(encuesta.enviados, encuesta.respondidos) }}%
                      </p>
                      <p class="text-xs text-gray-500">{{ encuesta.respondidos }}/{{ encuesta.enviados }}</p>
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
            <div v-if="extremos.mejor.nombre !== '-'" class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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

          </template>

        </template>

      </div>
    </div>
  </div>
</template>
