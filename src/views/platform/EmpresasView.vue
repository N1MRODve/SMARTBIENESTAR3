<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Search,
  Building2,
  Users,
  ClipboardList,
  ChevronRight,
  Filter,
  X
} from 'lucide-vue-next';
import { platformService } from '@/services/platform.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(true);
const empresas = ref([]);
const searchQuery = ref('');
const filterEstado = ref('todas');

onMounted(async () => {
  await loadEmpresas();
});

const loadEmpresas = async () => {
  loading.value = true;
  try {
    empresas.value = await platformService.getEmpresasConEstadisticas();
  } catch (error) {
    console.error('Error loading empresas:', error);
  } finally {
    loading.value = false;
  }
};

const filteredEmpresas = computed(() => {
  let result = empresas.value;

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    result = result.filter(e =>
      e.nombre?.toLowerCase().includes(search) ||
      e.industria?.toLowerCase().includes(search)
    );
  }

  if (filterEstado.value !== 'todas') {
    const isActiva = filterEstado.value === 'activa';
    result = result.filter(e => e.activa === isActiva);
  }

  return result;
});

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
};

const verDetalle = (empresaId) => {
  router.push(`/platform/empresas/${empresaId}`);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar empresas..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            @click="filterEstado = 'todas'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="filterEstado === 'todas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            Todas
          </button>
          <button
            @click="filterEstado = 'activa'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="filterEstado === 'activa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            Activas
          </button>
          <button
            @click="filterEstado = 'inactiva'"
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            :class="filterEstado === 'inactiva' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            Inactivas
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else-if="filteredEmpresas.length === 0" class="text-center py-12">
      <Building2 class="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron empresas</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Intenta con otra busqueda' : 'No hay empresas registradas aun' }}
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
              Empleados
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Solicitudes
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Registro
            </th>
            <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="empresa in filteredEmpresas"
            :key="empresa.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="verDetalle(empresa.id)"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Building2 class="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ empresa.nombre }}</p>
                  <p class="text-sm text-gray-500">{{ empresa.industria || 'Sin especificar' }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-gray-400" />
                <span class="text-gray-900">{{ empresa.empleados_count }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <ClipboardList class="w-4 h-4 text-gray-400" />
                <span class="text-gray-900">{{ empresa.solicitudes_count }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-sm text-gray-600">{{ formatFecha(empresa.fecha_creacion) }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full"
                :class="empresa.activa !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ empresa.activa !== false ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <ChevronRight class="w-5 h-5 text-gray-400" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>Mostrando {{ filteredEmpresas.length }} de {{ empresas.length }} empresas</span>
    </div>
  </div>
</template>
