<template>
  <div class="space-y-6">
    <!-- Estado de carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <Loader2 class="h-8 w-8 text-indigo-600 animate-spin mb-3" />
      <p class="text-gray-600">Cargando analítica...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-8">
      <div class="flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle class="h-8 w-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="cargarAnalitica"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <template v-else>
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-indigo-500">
        <div class="flex items-center justify-center mb-3">
          <Send class="h-8 w-8 text-indigo-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Comunicados enviados</p>
        <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalEnviados }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-yellow-500">
        <div class="flex items-center justify-center mb-3">
          <Clock class="h-8 w-8 text-yellow-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Programados</p>
        <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalProgramados }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-green-500">
        <div class="flex items-center justify-center mb-3">
          <TrendingUp class="h-8 w-8 text-green-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Tasa promedio de lectura</p>
        <p class="text-3xl font-bold text-green-700">{{ estadisticas.promedioLectura }}%</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 text-center border-l-4 border-purple-500">
        <div class="flex items-center justify-center mb-3">
          <Building class="h-8 w-8 text-purple-600" />
        </div>
        <p class="text-sm text-gray-600 mb-1">Departamentos activos</p>
        <p class="text-sm font-bold text-gray-900 mt-2">{{ estadisticas.departamentosActivos }}</p>
      </div>
    </div>

    <!-- Gráfico de Barras -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-6">
        Interacciones por Comunicado
      </h3>

      <div v-if="estadisticas.datosGrafico.length > 0" class="space-y-4">
        <div
          v-for="(dato, index) in estadisticas.datosGrafico"
          :key="index"
          class="space-y-2"
        >
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-gray-700">{{ dato.titulo }}</span>
            <span
              class="font-bold"
              :class="dato.interacciones >= 80 ? 'text-green-600' : dato.interacciones >= 60 ? 'text-orange-600' : 'text-red-600'"
            >
              {{ dato.interacciones }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :class="dato.interacciones >= 80 ? 'bg-green-500' : dato.interacciones >= 60 ? 'bg-orange-500' : 'bg-red-500'"
              :style="{ width: `${dato.interacciones}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600">No hay datos de interacciones disponibles</p>
      </div>
    </div>

    <!-- Tarjetas de Resumen Adicionales -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Distribución por Estado -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Distribución por Estado
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Enviados</span>
            </div>
            <span class="text-lg font-bold text-green-700">{{ estadisticas.totalEnviados }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Programados</span>
            </div>
            <span class="text-lg font-bold text-yellow-700">{{ estadisticas.totalProgramados }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span class="text-sm font-medium text-gray-700">Borradores</span>
            </div>
            <span class="text-lg font-bold text-gray-700">{{ estadisticas.totalBorradores }}</span>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Insights y Recomendaciones
        </h3>
        <div class="space-y-4">
          <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Info class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-blue-900">
                Departamentos más activos
              </p>
              <p class="text-xs text-blue-700 mt-1">
                {{ estadisticas.departamentosActivos }} lideran en interacciones
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle class="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-green-900">
                Tasa de lectura promedio
              </p>
              <p class="text-xs text-green-700 mt-1">
                {{ estadisticas.promedioLectura }}% de interacción es
                {{ estadisticas.promedioLectura >= 80 ? 'excelente' : estadisticas.promedioLectura >= 60 ? 'bueno' : 'mejorable' }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <Target class="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-purple-900">
                Recomendación
              </p>
              <p class="text-xs text-purple-700 mt-1">
                Mantén comunicación regular para optimizar engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import {
  Send,
  Clock,
  TrendingUp,
  Building,
  BarChart3,
  Info,
  CheckCircle,
  Target,
  Loader2,
  AlertCircle
} from 'lucide-vue-next';

const authStore = useAuthStore();

// Estado
const loading = ref(true);
const error = ref(null);
const comunicadosData = ref([]);
const departamentosData = ref([]);

// ==========================================
// CARGAR DATOS DE ANALÍTICA
// ==========================================
const cargarAnalitica = async () => {
  loading.value = true;
  error.value = null;

  try {
    const empresaId = authStore.empresaId;
    if (!empresaId) {
      throw new Error('No se encontró el ID de la empresa');
    }

    // Obtener comunicados de la empresa
    const { data: comunicados, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (comError) throw comError;

    // Para cada comunicado enviado, obtener métricas de lectura
    const comunicadosConMetricas = await Promise.all(
      (comunicados || []).map(async (com) => {
        const alcanceEstimado = com.alcance_estimado || 0;

        // Contar lecturas
        const { count: lecturas } = await supabase
          .from('comunicados_lecturas')
          .select('*', { count: 'exact', head: true })
          .eq('comunicado_id', com.id);

        const totalLecturas = lecturas || 0;
        const interacciones = alcanceEstimado > 0
          ? Math.round((totalLecturas / alcanceEstimado) * 100)
          : 0;

        return {
          ...com,
          totalLecturas,
          interacciones: Math.min(interacciones, 100)
        };
      })
    );

    comunicadosData.value = comunicadosConMetricas;

    // Obtener departamentos activos
    const { data: deptos } = await supabase
      .from('departamentos')
      .select('nombre')
      .eq('empresa_id', empresaId);

    departamentosData.value = deptos || [];

    console.log('[Analítica] Datos cargados:', comunicadosConMetricas.length, 'comunicados');
  } catch (err) {
    console.error('[Analítica] Error:', err);
    error.value = err.message || 'Error al cargar analítica';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarAnalitica);

// ==========================================
// COMPUTED: Estadísticas calculadas
// ==========================================
const estadisticas = computed(() => {
  const comunicados = comunicadosData.value;

  // Contar por estado (normalizando a minúsculas)
  const enviados = comunicados.filter(c =>
    c.estado?.toLowerCase() === 'enviado' || c.estado?.toLowerCase() === 'publicado'
  );
  const programados = comunicados.filter(c =>
    c.estado?.toLowerCase() === 'programado'
  );
  const borradores = comunicados.filter(c =>
    c.estado?.toLowerCase() === 'borrador'
  );

  // Calcular promedio de lectura solo de comunicados enviados
  const tasasLectura = enviados.map(c => c.interacciones || 0);
  const promedioLectura = tasasLectura.length > 0
    ? Math.round(tasasLectura.reduce((a, b) => a + b, 0) / tasasLectura.length)
    : 0;

  // Datos para el gráfico (últimos 10 comunicados enviados)
  const datosGrafico = enviados
    .slice(0, 10)
    .map(c => ({
      titulo: c.titulo?.substring(0, 30) + (c.titulo?.length > 30 ? '...' : '') || 'Sin título',
      interacciones: c.interacciones || 0
    }));

  // Departamentos con comunicados destinados
  const departamentosActivos = departamentosData.value.length;

  return {
    totalEnviados: enviados.length,
    totalProgramados: programados.length,
    totalBorradores: borradores.length,
    promedioLectura,
    departamentosActivos,
    datosGrafico
  };
});
</script>
