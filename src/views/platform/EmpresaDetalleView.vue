<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft,
  Building2,
  Users,
  FileText,
  ClipboardList,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-vue-next';
import { platformService } from '@/services/platform.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const empresa = ref(null);

onMounted(async () => {
  await loadEmpresa();
});

const loadEmpresa = async () => {
  loading.value = true;
  try {
    const empresaId = route.params.empresaId;
    empresa.value = await platformService.getEmpresaById(empresaId);
  } catch (error) {
    console.error('Error loading empresa:', error);
  } finally {
    loading.value = false;
  }
};

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
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

const goBack = () => {
  router.push('/platform/empresas');
};
</script>

<template>
  <div class="space-y-6">
    <button
      @click="goBack"
      class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeft class="w-5 h-5" />
      <span>Volver a empresas</span>
    </button>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <template v-else-if="empresa">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
              <Building2 class="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ empresa.nombre }}</h1>
              <p class="text-gray-500">{{ empresa.industria || 'Sin especificar' }}</p>
              <span
                class="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full"
                :class="empresa.activa !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ empresa.activa !== false ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <Users class="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ empresa.stats?.totalEmpleados || 0 }}</p>
            <p class="text-sm text-gray-500">Empleados</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <FileText class="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ empresa.stats?.totalEncuestas || 0 }}</p>
            <p class="text-sm text-gray-500">Encuestas</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <ClipboardList class="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p class="text-2xl font-bold text-gray-900">{{ empresa.stats?.solicitudes?.length || 0 }}</p>
            <p class="text-sm text-gray-500">Solicitudes</p>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar class="w-6 h-6 text-cyan-600 mx-auto mb-2" />
            <p class="text-sm font-bold text-gray-900">{{ formatFecha(empresa.fecha_creacion) }}</p>
            <p class="text-sm text-gray-500">Registro</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informacion de Contacto</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <Mail class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">{{ empresa.email || 'No especificado' }}</span>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">{{ empresa.telefono || 'No especificado' }}</span>
            </div>
            <div class="flex items-center gap-3">
              <MapPin class="w-5 h-5 text-gray-400" />
              <span class="text-gray-700">{{ empresa.direccion || 'No especificada' }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Solicitudes de Servicios</h2>
          <div v-if="empresa.stats?.solicitudes?.length > 0" class="space-y-3">
            <div
              v-for="solicitud in empresa.stats.solicitudes.slice(0, 5)"
              :key="solicitud.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ solicitud.servicio_nombre || 'Servicio' }}</p>
                <p class="text-sm text-gray-500">{{ formatFecha(solicitud.fecha_solicitud) }}</p>
              </div>
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full"
                :class="getEstadoColor(solicitud.estado)"
              >
                {{ solicitud.estado }}
              </span>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <ClipboardList class="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No hay solicitudes registradas</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-12">
      <Building2 class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Empresa no encontrada</h3>
      <button @click="goBack" class="text-emerald-600 hover:text-emerald-700">
        Volver al listado
      </button>
    </div>
  </div>
</template>
