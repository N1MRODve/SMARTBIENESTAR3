<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { recompensasService } from '@/services/recompensas.service';
import { Plus, AlertCircle, RefreshCw, Gift, History, Edit, Trash2 } from 'lucide-vue-next';
import Button from '@/components/common/Button.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import RecompensaFormModal from '@/components/admin/RecompensaFormModal.vue';

const authStore = useAuthStore();

const recompensas = ref([]);
const historialCanjes = ref([]);
const loading = ref(true);
const error = ref(null);
const mostrarModal = ref(false);
const recompensaSeleccionada = ref(null);
const guardando = ref(false);
const vistaActual = ref('recompensas');

const totalCanjes = computed(() => historialCanjes.value.length);
const canjesEsteMes = computed(() => {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  return historialCanjes.value.filter(canje =>
    new Date(canje.fecha_canje) >= inicioMes
  ).length;
});

const puntosCanjeadosTotal = computed(() =>
  historialCanjes.value.reduce((sum, canje) => sum + (canje.puntos_gastados || 0), 0)
);

onMounted(async () => {
  await cargarRecompensas();
});

const cambiarVista = async (vista) => {
  vistaActual.value = vista;
  if (vista === 'historial' && historialCanjes.value.length === 0) {
    await cargarHistorial();
  }
};

const cargarRecompensas = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await recompensasService.getAll();
    recompensas.value = data || [];
  } catch (err) {
    console.error('Error cargando recompensas:', err);
    error.value = 'No se pudieron cargar las recompensas';
  } finally {
    loading.value = false;
  }
};

const cargarHistorial = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await recompensasService.getHistorialCanjes();
    historialCanjes.value = data || [];
  } catch (err) {
    console.error('Error cargando historial:', err);
    error.value = 'No se pudo cargar el historial de canjes';
  } finally {
    loading.value = false;
  }
};

const abrirModalCrear = () => {
  recompensaSeleccionada.value = null;
  mostrarModal.value = true;
};

const abrirModalEditar = (recompensa) => {
  recompensaSeleccionada.value = { ...recompensa };
  mostrarModal.value = true;
};

const handleGuardarRecompensa = async (datos) => {
  guardando.value = true;
  try {
    if (recompensaSeleccionada.value?.id) {
      const { error: err } = await supabase
        .from('recompensas')
        .update({
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          categoria: datos.categoria,
          costo_puntos: datos.costo_puntos,
          stock: datos.stock,
          imagen_url: datos.imagen_url,
          activa: datos.activa
        })
        .eq('id', recompensaSeleccionada.value.id);

      if (err) throw err;
    } else {
      const { error: err } = await supabase
        .from('recompensas')
        .insert([{
          empresa_id: authStore.empresaId,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          categoria: datos.categoria,
          costo_puntos: datos.costo_puntos,
          stock: datos.stock || -1,
          imagen_url: datos.imagen_url,
          activa: datos.activa !== false
        }]);

      if (err) throw err;
    }

    await cargarRecompensas();
    mostrarModal.value = false;
  } catch (err) {
    console.error('Error guardando recompensa:', err);
    alert('Error al guardar la recompensa');
  } finally {
    guardando.value = false;
  }
};

const confirmarEliminar = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta recompensa?')) return;

  try {
    const { error: err } = await supabase
      .from('recompensas')
      .delete()
      .eq('id', id);

    if (err) throw err;
    await cargarRecompensas();
  } catch (err) {
    console.error('Error eliminando recompensa:', err);
    alert('Error al eliminar la recompensa');
  }
};

const toggleActiva = async (recompensa) => {
  try {
    const { error: err } = await supabase
      .from('recompensas')
      .update({ activa: !recompensa.activa })
      .eq('id', recompensa.id);

    if (err) throw err;
    await cargarRecompensas();
  } catch (err) {
    console.error('Error actualizando estado:', err);
  }
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  });
};

const formatearFechaCompleta = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="space-y-8">

    <!-- Header -->
    <div class="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl shadow-xl p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Gift class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Gestión de Recompensas</h1>
            <p class="text-white/80 mt-1">Administra el catálogo y controla los canjes</p>
          </div>
        </div>
        <Button
          @click="abrirModalCrear"
          class="bg-white text-orange-600 font-semibold hover:bg-orange-50"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Recompensa
        </Button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6" aria-label="Tabs">
          <button
            @click="cambiarVista('recompensas')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              vistaActual === 'recompensas'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <div class="flex items-center">
              <Gift class="h-5 w-5 mr-2" />
              Catálogo ({{ recompensas.length }})
            </div>
          </button>
          <button
            @click="cambiarVista('historial')"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              vistaActual === 'historial'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <div class="flex items-center">
              <History class="h-5 w-5 mr-2" />
              Historial de Canjes
              <span v-if="totalCanjes > 0" class="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {{ totalCanjes }}
              </span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Stats Cards (historial) -->
    <div v-if="vistaActual === 'historial'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <div class="text-3xl font-bold text-orange-600">{{ totalCanjes }}</div>
        <div class="text-sm text-gray-600 mt-1">Total Canjes</div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <div class="text-3xl font-bold text-green-600">{{ canjesEsteMes }}</div>
        <div class="text-sm text-gray-600 mt-1">Este Mes</div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <div class="text-3xl font-bold text-blue-600">{{ puntosCanjeadosTotal }}</div>
        <div class="text-sm text-gray-600 mt-1">Puntos Canjeados</div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <div class="text-3xl font-bold text-purple-600">
          {{ Math.round(puntosCanjeadosTotal / Math.max(totalCanjes, 1)) }}
        </div>
        <div class="text-sm text-gray-600 mt-1">Promedio por Canje</div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar datos</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="vistaActual === 'recompensas' ? cargarRecompensas() : cargarHistorial()">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Catálogo de Recompensas -->
    <div v-else-if="vistaActual === 'recompensas'">
      <div v-if="recompensas.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-200">
        <EmptyState
          :icon="Gift"
          title="No hay recompensas"
          description="Comienza creando tu primera recompensa para motivar a tu equipo."
          action-text="Crear recompensa"
          :action-icon="Plus"
          @action="abrirModalCrear"
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="recompensa in recompensas"
          :key="recompensa.id"
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
            <Gift class="h-20 w-20 text-white" />
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-bold text-gray-900">{{ recompensa.nombre }}</h3>
              <span
                :class="recompensa.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ recompensa.activa ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-4">{{ recompensa.descripcion }}</p>
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-xs text-gray-500">Costo</span>
                <div class="text-xl font-bold text-orange-600">{{ recompensa.costo_puntos }} pts</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-500">Stock</span>
                <div class="text-lg font-semibold text-gray-900">
                  {{ recompensa.stock === -1 ? 'Ilimitado' : recompensa.stock }}
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="abrirModalEditar(recompensa)"
                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Edit class="h-4 w-4 inline mr-1" />
                Editar
              </button>
              <button
                @click="confirmarEliminar(recompensa.id)"
                class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historial de Canjes -->
    <div v-else-if="vistaActual === 'historial'">
      <div v-if="historialCanjes.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-200">
        <EmptyState
          :icon="History"
          title="Sin canjes aún"
          description="Los canjes realizados por los empleados aparecerán aquí."
        />
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Empleado</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Recompensa</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Puntos</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="canje in historialCanjes" :key="canje.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatearFecha(canje.fecha_canje) }}</div>
                  <div class="text-xs text-gray-500">{{ formatearFechaCompleta(canje.fecha_canje) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-medium text-sm">
                        {{ canje.empleado?.nombre?.charAt(0) || 'E' }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ canje.empleado?.nombre || 'Empleado' }}</div>
                      <div class="text-xs text-gray-500">{{ canje.empleado?.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ canje.recompensa?.nombre }}</div>
                  <div class="text-xs text-gray-500 capitalize">{{ canje.recompensa?.categoria }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-bold text-orange-600">{{ canje.puntos_gastados }} pts</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': canje.estado === 'completado',
                      'bg-yellow-100 text-yellow-800': canje.estado === 'pendiente',
                      'bg-blue-100 text-blue-800': canje.estado === 'procesado'
                    }"
                    class="px-3 py-1 text-xs font-medium rounded-full capitalize"
                  >
                    {{ canje.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <RecompensaFormModal
      v-model:visible="mostrarModal"
      :recompensa="recompensaSeleccionada"
      :loading="guardando"
      @save="handleGuardarRecompensa"
    />

  </div>
</template>
