<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Resultados por Departamento</h2>
      <p class="text-gray-600 mt-1">Visualiza la tasa de participación y el promedio de bienestar en cada área.</p>
    </div>

    <!-- Estado vacío: Sin datos suficientes -->
    <div v-if="!tieneDataSuficiente" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div class="text-center max-w-md mx-auto">
        <!-- Icono -->
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Building2 class="h-8 w-8 text-gray-400" />
        </div>

        <!-- Título -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          Sin datos suficientes por departamento
        </h3>

        <!-- Descripción -->
        <p class="text-gray-600 mb-4">
          Se necesitan al menos <strong>3 respuestas por departamento</strong> para mostrar
          estadísticas confiables y proteger la confidencialidad de los participantes.
        </p>

        <!-- Info adicional -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <div class="flex items-start gap-3">
            <Info class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="font-medium text-blue-900 mb-1">¿Por qué este requisito?</p>
              <p class="text-blue-700">
                Para garantizar el anonimato de las respuestas, solo mostramos datos agregados
                cuando hay suficientes participantes en cada grupo. Esto protege la identidad
                de los empleados y fomenta respuestas honestas.
              </p>
            </div>
          </div>
        </div>

        <!-- Estadísticas actuales -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 mb-2">Estado actual de la encuesta:</p>
          <div class="flex justify-center gap-6 text-sm">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ totalParticipantes }}</p>
              <p class="text-gray-500">Participantes</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ departamentosConRespuestas }}</p>
              <p class="text-gray-500">Departamentos</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">3</p>
              <p class="text-gray-500">Mínimo requerido</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido con datos reales (cuando hay suficientes) -->
    <template v-else>
      <!-- KPIs Globales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Promedio General -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Promedio General</p>
              <p class="text-3xl font-bold" :class="getColorClasses(promedioGeneral).text">
                {{ promedioGeneral.toFixed(1) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">de 5.0</p>
            </div>
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="getColorClasses(promedioGeneral).bg"
            >
              <Activity class="h-8 w-8" :class="getColorClasses(promedioGeneral).text" />
            </div>
          </div>
        </div>

        <!-- Participación Global -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 mb-1">Participación Global</p>
              <p class="text-3xl font-bold text-primary">
                {{ participacionGlobal.toFixed(0) }}%
              </p>
              <p class="text-xs text-gray-500 mt-1">de todos los empleados</p>
            </div>
            <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users class="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Resultados -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participantes
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promedio
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="dept in resultadosDepartamentos"
                :key="dept.nombre"
                class="hover:bg-gray-50 transition-colors"
              >
                <!-- Nombre -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      :class="getColorClasses(dept.promedio).bg"
                    >
                      <Building2 class="h-5 w-5" :class="getColorClasses(dept.promedio).text" />
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ dept.nombre }}</div>
                    </div>
                  </div>
                </td>

                <!-- Participantes -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-gray-900">{{ dept.participantes }}</span>
                  <span class="text-sm text-gray-500"> empleados</span>
                </td>

                <!-- Promedio -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold" :class="getColorClasses(dept.promedio).text">
                      {{ dept.promedio.toFixed(1) }}
                    </span>
                    <span class="text-sm text-gray-500">/ 5.0</span>
                  </div>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="getEstadoClasses(dept.promedio)"
                  >
                    <span class="w-2 h-2 rounded-full mr-2" :class="getEstadoDotClasses(dept.promedio)"></span>
                    {{ getEstadoTexto(dept.promedio) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gráfico Comparativo -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Comparativa de clima laboral por departamento</h3>
        <div class="space-y-4">
          <div
            v-for="dept in resultadosOrdenadosPorPromedio"
            :key="dept.nombre"
            class="space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">{{ dept.nombre }}</span>
              <span class="text-sm font-bold" :class="getColorClasses(dept.promedio).text">
                {{ dept.promedio.toFixed(1) }}
              </span>
            </div>
            <div class="relative w-full bg-gray-200 rounded-full h-8">
              <div
                class="h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                :class="getColorClasses(dept.promedio).bgBar"
                :style="{ width: `${(dept.promedio / 5) * 100}%` }"
              >
                <span class="text-xs font-semibold text-white">{{ dept.promedio.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Leyenda -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Interpretación</p>
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span class="text-xs text-gray-600">&lt; 3.0 - Alto riesgo</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span class="text-xs text-gray-600">3.0 - 4.0 - Riesgo moderado</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-xs text-gray-600">&gt; 4.0 - Clima saludable</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Análisis de Riesgos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Alto Riesgo -->
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-center mb-3">
            <AlertTriangle class="h-5 w-5 text-red-600 mr-2" />
            <h4 class="text-sm font-semibold text-red-900">Alto Riesgo</h4>
          </div>
          <p class="text-2xl font-bold text-red-700 mb-1">{{ departamentosAltoRiesgo.length }}</p>
          <p class="text-xs text-red-600">
            {{ departamentosAltoRiesgo.length === 0 ? 'Sin departamentos' : departamentosAltoRiesgo.map(d => d.nombre).join(', ') }}
          </p>
        </div>

        <!-- Riesgo Moderado -->
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div class="flex items-center mb-3">
            <AlertCircle class="h-5 w-5 text-orange-600 mr-2" />
            <h4 class="text-sm font-semibold text-orange-900">Riesgo Moderado</h4>
          </div>
          <p class="text-2xl font-bold text-orange-700 mb-1">{{ departamentosRiesgoModerado.length }}</p>
          <p class="text-xs text-orange-600">
            {{ departamentosRiesgoModerado.length === 0 ? 'Sin departamentos' : departamentosRiesgoModerado.map(d => d.nombre).join(', ') }}
          </p>
        </div>

        <!-- Clima Saludable -->
        <div class="bg-green-50 border border-green-200 rounded-xl p-6">
          <div class="flex items-center mb-3">
            <CheckCircle class="h-5 w-5 text-green-600 mr-2" />
            <h4 class="text-sm font-semibold text-green-900">Clima Saludable</h4>
          </div>
          <p class="text-2xl font-bold text-green-700 mb-1">{{ departamentosClimaSaludable.length }}</p>
          <p class="text-xs text-green-600">
            {{ departamentosClimaSaludable.length === 0 ? 'Sin departamentos' : departamentosClimaSaludable.map(d => d.nombre).join(', ') }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Activity, Users, Building2, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-vue-next';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore();

// Props opcionales para recibir datos del padre
const props = defineProps({
  encuestaId: {
    type: String,
    default: null
  },
  respuestas: {
    type: Array,
    default: () => []
  }
});

// Estado
const resultadosDepartamentos = ref([]);
const totalParticipantes = ref(0);
const departamentosConRespuestas = ref(0);
const loading = ref(true);

// Umbral mínimo de participantes por departamento para mostrar datos
const UMBRAL_MINIMO_PARTICIPANTES = 3;

// Computed: ¿Hay datos suficientes para mostrar?
const tieneDataSuficiente = computed(() => {
  return resultadosDepartamentos.value.length > 0;
});

// Computed properties
const promedioGeneral = computed(() => {
  if (resultadosDepartamentos.value.length === 0) return 0;
  const suma = resultadosDepartamentos.value.reduce((acc, dept) => acc + dept.promedio, 0);
  return suma / resultadosDepartamentos.value.length;
});

const participacionGlobal = computed(() => {
  if (resultadosDepartamentos.value.length === 0) return 0;
  const totalEmpleados = resultadosDepartamentos.value.reduce((acc, dept) => acc + dept.totalEmpleados, 0);
  const totalPart = resultadosDepartamentos.value.reduce((acc, dept) => acc + dept.participantes, 0);
  return totalEmpleados > 0 ? (totalPart / totalEmpleados) * 100 : 0;
});

const resultadosOrdenadosPorPromedio = computed(() => {
  return [...resultadosDepartamentos.value].sort((a, b) => b.promedio - a.promedio);
});

const departamentosAltoRiesgo = computed(() => {
  return resultadosDepartamentos.value.filter(d => d.promedio < 3);
});

const departamentosRiesgoModerado = computed(() => {
  return resultadosDepartamentos.value.filter(d => d.promedio >= 3 && d.promedio < 4);
});

const departamentosClimaSaludable = computed(() => {
  return resultadosDepartamentos.value.filter(d => d.promedio >= 4);
});

// Cargar datos reales de la base de datos
const cargarDatosDepartamentos = async () => {
  loading.value = true;

  try {
    console.log('[ResultadosPorDepartamento] Procesando respuestas:', props.respuestas?.length || 0);

    if (props.respuestas && props.respuestas.length > 0) {
      // Filtrar empleado_ids válidos (no null/undefined)
      const empleadoIdsValidos = props.respuestas
        .map(r => r.empleado_id)
        .filter(id => id !== null && id !== undefined);

      const participantesUnicos = new Set(empleadoIdsValidos);
      totalParticipantes.value = participantesUnicos.size;

      console.log('[ResultadosPorDepartamento] empleado_ids válidos:', empleadoIdsValidos.length);
      console.log('[ResultadosPorDepartamento] Participantes únicos:', totalParticipantes.value);

      // Agrupar respuestas por departamento
      const departamentosMap = {};
      const respuestasConDepartamento = props.respuestas.filter(r =>
        r.departamento && r.departamento !== '' && r.departamento !== null
      );

      console.log('[ResultadosPorDepartamento] Respuestas con departamento:', respuestasConDepartamento.length);

      respuestasConDepartamento.forEach(r => {
        const dept = r.departamento;
        if (!departamentosMap[dept]) {
          departamentosMap[dept] = {
            nombre: dept,
            respuestas: [],
            participantes: new Set()
          };
        }
        departamentosMap[dept].respuestas.push(r);
        if (r.empleado_id) {
          departamentosMap[dept].participantes.add(r.empleado_id);
        }
      });

      // Contar departamentos únicos
      const deptosUnicos = Object.keys(departamentosMap);
      departamentosConRespuestas.value = deptosUnicos.length;

      console.log('[ResultadosPorDepartamento] Departamentos encontrados:', deptosUnicos);

      // Procesar cada departamento para calcular promedio
      // Solo mostrar departamentos con >= UMBRAL_MINIMO_PARTICIPANTES
      const resultados = [];

      for (const deptNombre of deptosUnicos) {
        const deptData = departamentosMap[deptNombre];
        const numParticipantes = deptData.participantes.size;

        if (numParticipantes >= UMBRAL_MINIMO_PARTICIPANTES) {
          // Calcular promedio de respuestas numéricas (1-5)
          const respuestasNumericas = deptData.respuestas
            .map(r => parseFloat(r.respuesta))
            .filter(val => !isNaN(val) && val >= 1 && val <= 5);

          const promedio = respuestasNumericas.length > 0
            ? respuestasNumericas.reduce((a, b) => a + b, 0) / respuestasNumericas.length
            : 3; // Default neutral

          resultados.push({
            nombre: deptNombre,
            participantes: numParticipantes,
            promedio,
            totalEmpleados: numParticipantes // Por ahora usamos los participantes como total
          });
        }
      }

      resultadosDepartamentos.value = resultados;
      console.log('[ResultadosPorDepartamento] Departamentos con datos suficientes:', resultados.length);

    } else {
      totalParticipantes.value = 0;
      resultadosDepartamentos.value = [];
      departamentosConRespuestas.value = 0;
    }

  } catch (error) {
    console.error('Error cargando datos por departamento:', error);
    resultadosDepartamentos.value = [];
  } finally {
    loading.value = false;
  }
};

// Métodos auxiliares
const getColorClasses = (promedio) => {
  if (promedio < 3) {
    return {
      bg: 'bg-red-50',
      bgBar: 'bg-red-500',
      text: 'text-red-700',
      border: 'border-red-200'
    };
  } else if (promedio < 4) {
    return {
      bg: 'bg-orange-50',
      bgBar: 'bg-orange-500',
      text: 'text-orange-700',
      border: 'border-orange-200'
    };
  } else {
    return {
      bg: 'bg-green-50',
      bgBar: 'bg-green-500',
      text: 'text-green-700',
      border: 'border-green-200'
    };
  }
};

const getEstadoClasses = (promedio) => {
  if (promedio < 3) {
    return 'bg-red-50 text-red-700 border border-red-200';
  } else if (promedio < 4) {
    return 'bg-orange-50 text-orange-700 border border-orange-200';
  } else {
    return 'bg-green-50 text-green-700 border border-green-200';
  }
};

const getEstadoDotClasses = (promedio) => {
  if (promedio < 3) {
    return 'bg-red-500';
  } else if (promedio < 4) {
    return 'bg-orange-500';
  } else {
    return 'bg-green-500';
  }
};

const getEstadoTexto = (promedio) => {
  if (promedio < 3) {
    return 'Alto riesgo';
  } else if (promedio < 4) {
    return 'Riesgo moderado';
  } else {
    return 'Clima saludable';
  }
};

// Recargar cuando cambian las respuestas
watch(() => props.respuestas, (newRespuestas) => {
  console.log('[ResultadosPorDepartamento] Props respuestas cambiaron:', newRespuestas?.length || 0);
  cargarDatosDepartamentos();
}, { immediate: true, deep: true });

onMounted(() => {
  cargarDatosDepartamentos();
});
</script>
