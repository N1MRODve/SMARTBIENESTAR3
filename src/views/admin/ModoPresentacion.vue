<template>
  <div class="min-h-screen bg-gray-50 p-8 md:p-12 fade-in">
    <!-- Header con Logo y Fecha -->
    <div class="max-w-7xl mx-auto mb-12">
      <div class="flex items-center justify-between mb-8">
        <!-- Logo -->
        <div class="flex items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 class="h-8 w-8 text-white" />
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold text-gray-900">{{ config.empresa.nombre }}</h1>
            <p class="text-sm text-gray-600">Reporte de Bienestar Organizacional</p>
          </div>
        </div>

        <!-- Fecha -->
        <div class="text-right">
          <p class="text-xs text-gray-500 uppercase tracking-wider">Actualizado al</p>
          <p class="text-lg font-semibold text-gray-800">{{ fechaActual }}</p>
        </div>
      </div>

      <!-- Título Principal -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Presentación Ejecutiva
        </h2>
        <p class="text-xl text-gray-600">Análisis consolidado de bienestar y participación</p>
      </div>

      <!-- Sección 1: KPIs Globales -->
      <div class="mb-16">
        <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Indicadores Clave</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Índice Global de Bienestar -->
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:scale-[1.01] transition-transform">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart class="h-8 w-8 text-white" />
            </div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Índice de Bienestar
            </p>
            <p class="text-5xl font-bold text-gray-900 mb-1">{{ analitica.bienestar_global.toFixed(1) }}</p>
            <p class="text-sm text-gray-500">de 5.0</p>
            <div :class="[estadoGlobal.bg, estadoGlobal.text]" class="inline-block px-4 py-1 rounded-full text-xs font-semibold mt-3">
              {{ estadoGlobal.label }}
            </div>
          </div>

          <!-- Participación Global -->
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:scale-[1.01] transition-transform">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users class="h-8 w-8 text-white" />
            </div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Participación
            </p>
            <p class="text-5xl font-bold text-gray-900 mb-1">{{ analitica.participacion_global }}%</p>
            <p class="text-sm text-gray-500">de empleados</p>
            <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                :style="{ width: `${analitica.participacion_global}%` }"
              ></div>
            </div>
          </div>

          <!-- Variación Trimestral -->
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:scale-[1.01] transition-transform">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp class="h-8 w-8 text-white" />
            </div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Variación Trimestral
            </p>
            <p class="text-5xl font-bold mb-1" :class="obtenerColorVariacion(analitica.variacion_trimestral)">
              {{ analitica.variacion_trimestral > 0 ? '+' : '' }}{{ analitica.variacion_trimestral.toFixed(1) }}
            </p>
            <p class="text-sm text-gray-500">vs. trimestre anterior</p>
            <component
              :is="analitica.variacion_trimestral > 0 ? TrendingUp : analitica.variacion_trimestral < 0 ? TrendingDown : Minus"
              :class="[obtenerColorVariacion(analitica.variacion_trimestral), 'h-8 w-8 mx-auto mt-3']"
            />
          </div>

          <!-- Alertas Activas -->
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:scale-[1.01] transition-transform">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle class="h-8 w-8 text-white" />
            </div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Alertas Activas
            </p>
            <p class="text-5xl font-bold mb-1" :class="analitica.alertas_activas > 0 ? 'text-red-600' : 'text-green-600'">
              {{ analitica.alertas_activas }}
            </p>
            <p class="text-sm text-gray-500">
              {{ analitica.alertas_activas === 0 ? 'Sin alertas' : 'Requieren atención' }}
            </p>
            <CheckCircle v-if="analitica.alertas_activas === 0" class="h-8 w-8 text-green-600 mx-auto mt-3" />
            <AlertCircle v-else class="h-8 w-8 text-red-600 mx-auto mt-3" />
          </div>
        </div>
      </div>

      <!-- Sección 2: Evolución del Bienestar -->
      <div class="mb-16">
        <h3 class="text-2xl font-semibold text-gray-800 mb-6">
          Evolución del bienestar organizacional
        </h3>
        <p class="text-gray-600 mb-8">Últimos 6 meses</p>

        <div class="bg-white rounded-xl p-8 shadow-sm">
          <!-- Gráfico de Evolución -->
          <div class="space-y-6">
            <div
              v-for="(dato, index) in evolucion"
              :key="dato.mes"
              class="flex items-center gap-6"
              :style="{ animationDelay: `${index * 0.1}s` }"
              style="animation: slideIn 0.5s ease-out forwards; opacity: 0;"
            >
              <div class="w-32 flex-shrink-0">
                <p class="text-base font-semibold text-gray-700">{{ dato.mes }}</p>
              </div>
              <div class="flex-1">
                <div class="relative">
                  <div class="w-full bg-gray-200 rounded-full h-12 relative overflow-hidden">
                    <div
                      class="h-12 rounded-full transition-all duration-1000 flex items-center justify-between px-6"
                      :class="obtenerColorBarra(dato.valor)"
                      :style="{ width: `${(dato.valor / 5) * 100}%` }"
                    >
                      <span class="text-white font-bold text-lg">{{ dato.valor.toFixed(1) }}</span>
                      <span class="text-white text-sm opacity-90">{{ dato.participacion }}% part.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Leyenda -->
          <div class="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-8">
            <div class="flex items-center">
              <div class="w-6 h-6 bg-red-500 rounded mr-3"></div>
              <span class="text-sm font-medium text-gray-700">Crítico (&lt;3.0)</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 bg-orange-500 rounded mr-3"></div>
              <span class="text-sm font-medium text-gray-700">Regular (3.0-3.5)</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 bg-blue-500 rounded mr-3"></div>
              <span class="text-sm font-medium text-gray-700">Bueno (3.5-4.0)</span>
            </div>
            <div class="flex items-center">
              <div class="w-6 h-6 bg-green-500 rounded mr-3"></div>
              <span class="text-sm font-medium text-gray-700">Excelente (≥4.0)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 3 y 4: Áreas Destacadas y Oportunidades -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Fortalezas Organizacionales -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">
            Fortalezas organizacionales
          </h3>
          <div class="space-y-4">
            <div
              v-for="(dept, index) in analitica.departamentos_fuertes"
              :key="dept.nombre"
              class="bg-green-50 rounded-xl p-6 shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="text-xl font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-sm text-gray-600">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-4xl font-bold text-green-600">{{ dept.promedio.toFixed(1) }}</p>
                  <p class="text-xs text-gray-500">de 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Oportunidades de Mejora -->
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">
            Oportunidades de mejora
          </h3>
          <div class="space-y-4">
            <div
              v-for="dept in analitica.departamentos_criticos"
              :key="dept.nombre"
              class="bg-red-50 rounded-xl p-6 shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    !
                  </div>
                  <div>
                    <p class="text-xl font-bold text-gray-900">{{ dept.nombre }}</p>
                    <p class="text-sm text-gray-600">{{ dept.empleados }} empleados</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-4xl font-bold text-red-600">{{ dept.promedio.toFixed(1) }}</p>
                  <p class="text-xs text-gray-500">de 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 5: Interpretación Ejecutiva -->
      <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border-l-4 border-indigo-600">
        <div class="flex items-start gap-6">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <FileText class="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Interpretación Ejecutiva</h3>
            <p class="text-lg text-gray-700 leading-relaxed">
              {{ resumenEjecutivo }}
            </p>
            <div class="mt-6 pt-6 border-t border-indigo-200">
              <div class="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p class="text-3xl font-bold text-indigo-600">{{ analitica.empleados_totales }}</p>
                  <p class="text-sm text-gray-600 mt-1">Empleados</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-purple-600">{{ analitica.encuestas_completadas }}</p>
                  <p class="text-sm text-gray-600 mt-1">Encuestas</p>
                </div>
                <div>
                  <p class="text-3xl font-bold text-pink-600">{{ analitica.participacion_global }}%</p>
                  <p class="text-sm text-gray-600 mt-1">Participación</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Flotante para Salir -->
    <button
      @click="salirPresentacion"
      class="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 flex items-center gap-2 z-50"
    >
      <X class="h-5 w-5" />
      <span class="font-medium">Salir del modo presentación</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Building2,
  Heart,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  FileText,
  X
} from 'lucide-vue-next';

// TODO: Load data from Supabase resultados_globales and departamentos tables

const router = useRouter();

// Estado
const analitica = ref({
  bienestar_global: 0,
  variacion_trimestral: 0,
  participacion_global: 0,
  alertas_activas: 0,
  encuestas_activas: 0,
  encuestas_completadas: 0,
  empleados_totales: 0,
  departamentos_fuertes: [],
  departamentos_criticos: []
});

const evolucion = ref([]);

const config = ref({
  empresa: {
    nombre: 'Mi Empresa'
  }
});

// Computed
const estadoGlobal = computed(() => {
  const valor = analitica.value.bienestar_global;
  if (valor >= 4.0) return { label: 'Excelente', bg: 'bg-green-100', text: 'text-green-800' };
  if (valor >= 3.5) return { label: 'Bueno', bg: 'bg-blue-100', text: 'text-blue-800' };
  if (valor >= 3.0) return { label: 'Regular', bg: 'bg-orange-100', text: 'text-orange-800' };
  return { label: 'Crítico', bg: 'bg-red-100', text: 'text-red-800' };
});

const resumenEjecutivo = computed(() => {
  const valor = analitica.value.bienestar_global;

  if (valor >= 4.0) {
    return 'La organización presenta indicadores excelentes de bienestar. Se recomienda mantener las prácticas actuales.';
  } else if (valor >= 3.5) {
    return 'Los indicadores de bienestar son buenos con oportunidades de mejora en áreas específicas.';
  } else if (valor >= 3.0) {
    return 'Se identifican áreas de mejora importantes que requieren atención.';
  } else {
    return 'Los indicadores requieren atención inmediata con un plan de acción integral.';
  }
});

const fechaActual = computed(() => {
  const hoy = new Date();
  return hoy.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});

// Métodos
const obtenerColorVariacion = (variacion) => {
  if (variacion > 0) return 'text-green-600';
  if (variacion < 0) return 'text-red-600';
  return 'text-gray-600';
};

const obtenerColorBarra = (valor) => {
  if (valor >= 4.0) return 'bg-green-500';
  if (valor >= 3.5) return 'bg-blue-500';
  if (valor >= 3.0) return 'bg-orange-500';
  return 'bg-red-500';
};

const salirPresentacion = () => {
  router.push('/admin/analitica');
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@media print {
  button {
    display: none !important;
  }
}
</style>
