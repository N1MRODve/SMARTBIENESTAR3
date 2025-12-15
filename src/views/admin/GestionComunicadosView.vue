<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Plus, AlertCircle, RefreshCw, Edit, Trash2, Eye, AlertOctagon, AlertTriangle, CheckCircle, Circle } from 'lucide-vue-next';
import Button from '@/components/common/Button.vue';
import Card from '@/components/ui/Card.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const comunicados = ref([]);
const loading = ref(true);
const error = ref(null);

const comunicadosEstaSemana = computed(() => {
  const semanaAtras = new Date();
  semanaAtras.setDate(semanaAtras.getDate() - 7);
  return comunicados.value.filter(c => new Date(c.created_at) >= semanaAtras).length;
});

const ultimoComunicado = computed(() => {
  if (comunicados.value.length === 0) return '-';
  const ultimo = comunicados.value[0];
  const dias = Math.floor((new Date() - new Date(ultimo.created_at)) / (1000 * 60 * 60 * 24));
  return dias === 0 ? 'Hoy' : `${dias} día${dias !== 1 ? 's' : ''}`;
});

onMounted(async () => {
  await cargarComunicados();
});

const cargarComunicados = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: err } = await supabase
      .from('comunicados')
      .select('*')
      .eq('empresa_id', authStore.empresaId)
      .order('created_at', { ascending: false });

    if (err) throw err;
    comunicados.value = data || [];
  } catch (err) {
    console.error('Error cargando comunicados:', err);
    error.value = 'No se pudieron cargar los comunicados';
  } finally {
    loading.value = false;
  }
};

const crearNuevoComunicado = () => {
  router.push('/admin/comunicados/crear');
};

const editarComunicado = (id) => {
  router.push(`/admin/comunicados/${id}/editar`);
};

const confirmarEliminar = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este comunicado?')) return;

  try {
    const { error: err } = await supabase
      .from('comunicados')
      .delete()
      .eq('id', id);

    if (err) throw err;
    await cargarComunicados();
    toast.success('Comunicado eliminado correctamente', { icon: '🗑️' });
  } catch (err) {
    console.error('Error eliminando comunicado:', err);
    toast.error('Error al eliminar el comunicado. Por favor, intenta de nuevo.');
  }
};

const getTipoColor = (tipo) => {
  const colores = {
    informativo: 'bg-blue-100 text-blue-800',
    urgente: 'bg-red-100 text-red-800',
    anuncio: 'bg-green-100 text-green-800',
    celebracion: 'bg-purple-100 text-purple-800'
  };
  return colores[tipo] || 'bg-gray-100 text-gray-800';
};

const getEstadoColor = (estado) => {
  const colores = {
    borrador: 'bg-yellow-100 text-yellow-800',
    programado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-green-100 text-green-800'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800';
};

const getPrioridadIcon = (prioridad) => {
  const iconos = {
    alta: AlertOctagon,
    media: AlertTriangle,
    baja: CheckCircle
  };
  return iconos[prioridad] || Circle;
};

const getPrioridadColor = (prioridad) => {
  const colores = {
    alta: 'text-red-500',
    media: 'text-yellow-500',
    baja: 'text-green-500'
  };
  return colores[prioridad] || 'text-gray-400';
};

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
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
    <div class="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <MessageSquare class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Gestión de Comunicados</h1>
            <p class="text-white/80 mt-1">Administra los mensajes para tu equipo</p>
          </div>
        </div>
        <Button
          @click="crearNuevoComunicado"
          class="bg-white text-green-600 font-semibold hover:bg-green-50"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nuevo Comunicado
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Total Comunicados</h3>
        <p class="text-4xl font-bold text-green-600">{{ comunicados.length }}</p>
        <p class="text-sm text-gray-500 mt-1">Publicados</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Esta Semana</h3>
        <p class="text-4xl font-bold text-blue-600">{{ comunicadosEstaSemana }}</p>
        <p class="text-sm text-gray-500 mt-1">Nuevos</p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Último Comunicado</h3>
        <p class="text-4xl font-bold text-purple-600">{{ ultimoComunicado }}</p>
        <p class="text-sm text-gray-500 mt-1">Publicación</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-red-800 mb-2">Error al cargar los comunicados</h3>
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="cargarComunicados">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="comunicados.length === 0" class="bg-white rounded-xl shadow-lg border border-gray-200">
      <EmptyState
        :icon="MessageSquare"
        title="No hay comunicados"
        description="Crea tu primer comunicado para mantener informado a tu equipo."
        action-text="Crear comunicado"
        :action-icon="Plus"
        @action="crearNuevoComunicado"
      />
    </div>

    <!-- Lista de Comunicados -->
    <div v-else class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Comunicado
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prioridad
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="comunicado in comunicados" :key="comunicado.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="max-w-md">
                  <div class="text-sm font-medium text-gray-900 mb-1">{{ comunicado.titulo }}</div>
                  <div class="text-xs text-gray-500 line-clamp-2">
                    {{ comunicado.contenido }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getTipoColor(comunicado.tipo)"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize"
                >
                  {{ comunicado.tipo }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <component
                    :is="getPrioridadIcon(comunicado.prioridad)"
                    :class="getPrioridadColor(comunicado.prioridad)"
                    class="h-5 w-5"
                  />
                  <span class="text-sm font-medium text-gray-900 capitalize">
                    {{ comunicado.prioridad }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getEstadoColor(comunicado.estado)"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize"
                >
                  {{ comunicado.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatearFecha(comunicado.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editarComunicado(comunicado.id)"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Editar"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmarEliminar(comunicado.id)"
                    class="text-red-600 hover:text-red-900 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
