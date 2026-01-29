<script setup>
import { ref, onMounted } from 'vue';
import {
  Building2,
  Users,
  FileText,
  ClipboardList,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Clock
} from 'lucide-vue-next';
import { platformService } from '@/services/platform.service';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const loading = ref(true);
const stats = ref({
  totalEmpresas: 0,
  totalEmpleados: 0,
  encuestasActivas: 0,
  solicitudesPendientes: 0
});
const actividadReciente = ref([]);
const crecimientoEmpresas = ref([]);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const [estadisticas, actividad, crecimiento] = await Promise.all([
      platformService.getEstadisticasPlataforma(),
      platformService.getActividadReciente(8),
      platformService.getCrecimientoEmpresas(6)
    ]);

    stats.value = estadisticas;
    actividadReciente.value = actividad;
    crecimientoEmpresas.value = crecimiento;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const formatFecha = (fecha) => {
  return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
};

const getActividadIcon = (tipo) => {
  switch (tipo) {
    case 'nueva_empresa':
      return Building2;
    case 'solicitud':
      return ClipboardList;
    default:
      return FileText;
  }
};

const getEstadoColor = (estado) => {
  const colors = {
    Pendiente: 'bg-amber-100 text-amber-700',
    Contactado: 'bg-blue-100 text-blue-700',
    'En negociacion': 'bg-cyan-100 text-cyan-700',
    Aprobado: 'bg-green-100 text-green-700',
    Rechazado: 'bg-red-100 text-red-700',
    Completado: 'bg-emerald-100 text-emerald-700'
  };
  return colors[estado] || 'bg-gray-100 text-gray-700';
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Empresas Activas</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalEmpresas }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp class="w-4 h-4 mr-1" />
            <span>Creciendo</span>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Empleados</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.totalEmpleados }}</p>
            </div>
            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Users class="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            En todas las empresas
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Encuestas Activas</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.encuestasActivas }}</p>
            </div>
            <div class="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-500">
            En proceso actualmente
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Solicitudes Pendientes</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stats.solicitudesPendientes }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <ClipboardList class="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <router-link
            v-if="stats.solicitudesPendientes > 0"
            to="/platform/solicitudes"
            class="mt-4 flex items-center text-sm text-amber-600 hover:text-amber-700"
          >
            <span>Ver solicitudes</span>
            <ArrowUpRight class="w-4 h-4 ml-1" />
          </router-link>
          <div v-else class="mt-4 text-sm text-gray-500">
            Todo al dia
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Crecimiento de Empresas</h3>
          <div class="h-64 flex items-end justify-between gap-2">
            <div
              v-for="item in crecimientoEmpresas"
              :key="item.mes"
              class="flex-1 flex flex-col items-center"
            >
              <div class="w-full flex flex-col items-center">
                <span class="text-sm font-medium text-gray-900 mb-2">{{ item.total }}</span>
                <div
                  class="w-full bg-emerald-500 rounded-t-lg transition-all duration-300"
                  :style="{ height: `${Math.max(item.total * 30, 20)}px` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 mt-2">{{ item.mes }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div class="space-y-4 max-h-64 overflow-y-auto">
            <div
              v-for="actividad in actividadReciente"
              :key="actividad.id"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <component :is="getActividadIcon(actividad.tipo)" class="w-4 h-4 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900 line-clamp-2">{{ actividad.descripcion }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-gray-500">{{ formatFecha(actividad.fecha) }}</span>
                  <span
                    v-if="actividad.estado"
                    class="px-2 py-0.5 text-xs rounded-full"
                    :class="getEstadoColor(actividad.estado)"
                  >
                    {{ actividad.estado }}
                  </span>
                </div>
              </div>
            </div>

            <div v-if="actividadReciente.length === 0" class="text-center py-8 text-gray-500">
              <Clock class="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p class="text-sm">No hay actividad reciente</p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="stats.solicitudesPendientes > 0"
        class="bg-amber-50 border border-amber-200 rounded-xl p-4"
      >
        <div class="flex items-center gap-3">
          <AlertCircle class="w-5 h-5 text-amber-600" />
          <div class="flex-1">
            <p class="text-sm font-medium text-amber-800">
              Tienes {{ stats.solicitudesPendientes }} solicitud(es) de servicio pendiente(s) de revision
            </p>
          </div>
          <router-link
            to="/platform/solicitudes"
            class="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Revisar
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
