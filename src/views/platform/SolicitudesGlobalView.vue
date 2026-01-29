<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Filter,
  ClipboardList,
  Building2,
  Calendar,
  X,
  ChevronDown,
  MessageSquare,
  Check
} from 'lucide-vue-next';
import { platformService } from '@/services/platform.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const loading = ref(true);
const solicitudes = ref([]);
const searchQuery = ref('');
const filterEstado = ref('todas');
const selectedSolicitud = ref(null);
const showModal = ref(false);
const notasInternas = ref('');
const updating = ref(false);

const estados = [
  { value: 'Pendiente', label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
  { value: 'Contactado', label: 'Contactado', color: 'bg-blue-100 text-blue-700' },
  { value: 'En negociacion', label: 'En negociacion', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'Aprobado', label: 'Aprobado', color: 'bg-green-100 text-green-700' },
  { value: 'Rechazado', label: 'Rechazado', color: 'bg-red-100 text-red-700' },
  { value: 'Completado', label: 'Completado', color: 'bg-emerald-100 text-emerald-700' }
];

onMounted(async () => {
  await loadSolicitudes();
});

const loadSolicitudes = async () => {
  loading.value = true;
  try {
    solicitudes.value = await platformService.getSolicitudesGlobal();
  } catch (error) {
    console.error('Error loading solicitudes:', error);
  } finally {
    loading.value = false;
  }
};

const filteredSolicitudes = computed(() => {
  let result = solicitudes.value;

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    result = result.filter(s =>
      s.empresas?.nombre?.toLowerCase().includes(search) ||
      s.servicios?.nombre?.toLowerCase().includes(search)
    );
  }

  if (filterEstado.value !== 'todas') {
    result = result.filter(s => s.estado === filterEstado.value);
  }

  return result;
});

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return format(new Date(fecha), "d MMM yyyy, HH:mm", { locale: es });
};

const getEstadoStyle = (estado) => {
  const found = estados.find(e => e.value === estado);
  return found?.color || 'bg-gray-100 text-gray-700';
};

const openModal = (solicitud) => {
  selectedSolicitud.value = solicitud;
  notasInternas.value = solicitud.notas_internas || '';
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedSolicitud.value = null;
  notasInternas.value = '';
};

const updateEstado = async (nuevoEstado) => {
  if (!selectedSolicitud.value || updating.value) return;

  updating.value = true;
  try {
    await platformService.updateSolicitudEstado(
      selectedSolicitud.value.id,
      nuevoEstado,
      notasInternas.value
    );

    const index = solicitudes.value.findIndex(s => s.id === selectedSolicitud.value.id);
    if (index !== -1) {
      solicitudes.value[index].estado = nuevoEstado;
      solicitudes.value[index].notas_internas = notasInternas.value;
    }

    closeModal();
  } catch (error) {
    console.error('Error updating estado:', error);
  } finally {
    updating.value = false;
  }
};

const pendientesCount = computed(() => {
  return solicitudes.value.filter(s => s.estado === 'Pendiente').length;
});
</script>

<template>
  <div class="space-y-6">
    <div v-if="pendientesCount > 0" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <ClipboardList class="w-5 h-5 text-amber-600" />
        <p class="text-sm font-medium text-amber-800">
          {{ pendientesCount }} solicitud(es) pendiente(s) de atencion
        </p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por empresa o servicio..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div class="flex items-center gap-3">
        <select
          v-model="filterEstado"
          class="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
        >
          <option value="todas">Todos los estados</option>
          <option v-for="estado in estados" :key="estado.value" :value="estado.value">
            {{ estado.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else-if="filteredSolicitudes.length === 0" class="text-center py-12">
      <ClipboardList class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron solicitudes</h3>
      <p class="text-gray-500">
        {{ searchQuery || filterEstado !== 'todas' ? 'Intenta con otros filtros' : 'No hay solicitudes registradas' }}
      </p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Empresa
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Servicio
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="solicitud in filteredSolicitudes"
            :key="solicitud.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Building2 class="w-4 h-4 text-slate-600" />
                </div>
                <span class="font-medium text-gray-900">{{ solicitud.empresas?.nombre || 'N/A' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div>
                <p class="text-gray-900">{{ solicitud.servicios?.nombre || 'N/A' }}</p>
                <p class="text-sm text-gray-500">{{ solicitud.servicios?.categoria || '' }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2 text-gray-600">
                <Calendar class="w-4 h-4" />
                <span class="text-sm">{{ formatFecha(solicitud.fecha_solicitud) }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full"
                :class="getEstadoStyle(solicitud.estado)"
              >
                {{ solicitud.estado }}
              </span>
            </td>
            <td class="px-6 py-4">
              <button
                @click="openModal(solicitud)"
                class="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Gestionar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Gestionar Solicitud</h3>
            <button @click="closeModal" class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <Building2 class="w-4 h-4 text-gray-400" />
                <span class="font-medium text-gray-900">{{ selectedSolicitud?.empresas?.nombre }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Servicio solicitado</p>
                <p class="font-medium text-gray-900">{{ selectedSolicitud?.servicios?.nombre }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Fecha de solicitud</p>
                <p class="text-gray-700">{{ formatFecha(selectedSolicitud?.fecha_solicitud) }}</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado actual</label>
            <span
              class="inline-block px-3 py-1.5 text-sm font-medium rounded-full"
              :class="getEstadoStyle(selectedSolicitud?.estado)"
            >
              {{ selectedSolicitud?.estado }}
            </span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare class="w-4 h-4 inline mr-1" />
              Notas internas
            </label>
            <textarea
              v-model="notasInternas"
              rows="3"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Agregar notas de seguimiento..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Cambiar estado</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="estado in estados"
                :key="estado.value"
                @click="updateEstado(estado.value)"
                :disabled="updating || selectedSolicitud?.estado === estado.value"
                class="px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="selectedSolicitud?.estado === estado.value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'"
              >
                <Check v-if="selectedSolicitud?.estado === estado.value" class="w-4 h-4 inline mr-1" />
                {{ estado.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
