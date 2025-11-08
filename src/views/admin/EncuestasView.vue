<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, BarChart3, Edit, Trash2, Eye } from 'lucide-vue-next';
import EmptyState from '@/components/common/EmptyState.vue';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

const encuestas = ref([]);
const isLoading = ref(true);

const hasEncuestas = computed(() => encuestas.value.length > 0);

const getCategoriaLabel = (categoria) => {
  const labels = {
    'salud-mental': 'Salud Mental',
    'carga-laboral': 'Carga Laboral',
    'comunicacion': 'Comunicación',
    'ergonomia': 'Ergonomía',
    'desarrollo': 'Desarrollo Profesional',
    'general': 'Bienestar General',
    'clima-laboral': 'Clima Laboral'
  };
  return labels[categoria] || 'General';
};

const getCategoriaColor = (categoria) => {
  const colores = {
    'salud-mental': 'bg-purple-100 text-purple-800',
    'carga-laboral': 'bg-orange-100 text-orange-800',
    'comunicacion': 'bg-blue-100 text-blue-800',
    'ergonomia': 'bg-green-100 text-green-800',
    'desarrollo': 'bg-indigo-100 text-indigo-800',
    'general': 'bg-gray-100 text-gray-800',
    'clima-laboral': 'bg-pink-100 text-pink-800'
  };
  return colores[categoria] || 'bg-gray-100 text-gray-800';
};

const getEstadoColor = (estado) => {
  const colores = {
    'Activa': 'bg-green-100 text-green-800',
    'borrador': 'bg-yellow-100 text-yellow-800',
    'Finalizada': 'bg-gray-100 text-gray-800',
    'Programada': 'bg-blue-100 text-blue-800'
  };
  return colores[estado] || 'bg-gray-100 text-gray-800';
};

onMounted(async () => {
  await cargarEncuestas();
});

const cargarEncuestas = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from('encuestas')
      .select('*, preguntas:preguntas_encuesta(count)')
      .eq('empresa_id', authStore.empresaId)
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    encuestas.value = (data || []).map(enc => ({
      ...enc,
      totalPreguntas: enc.preguntas[0]?.count || 0
    }));

  } catch (error) {
    console.error('Error cargando encuestas:', error);
  } finally {
    isLoading.value = false;
  }
};

const verResultados = (encuestaId) => {
  router.push({ name: 'admin-encuesta-resultados', params: { encuestaId } });
};

const editarEncuesta = (encuestaId) => {
  router.push({ name: 'admin-editar-encuesta', params: { encuestaId } });
};

const crearEncuesta = () => {
  router.push('/admin/encuestas/crear');
};

const confirmarEliminar = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;

  try {
    const { error } = await supabase
      .from('encuestas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await cargarEncuestas();
  } catch (error) {
    console.error('Error eliminando encuesta:', error);
    alert('Error al eliminar la encuesta');
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FileText class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Gestión de Encuestas</h1>
            <p class="text-white/80 mt-1">
              {{ encuestas.length }} encuesta{{ encuestas.length !== 1 ? 's' : '' }} creada{{ encuestas.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
        <Button
          @click="crearEncuesta"
          class="bg-white text-purple-600 font-semibold hover:bg-purple-50"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Encuesta
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasEncuestas" class="bg-white rounded-2xl shadow-lg border border-gray-100">
      <EmptyState
        :icon="FileText"
        title="No hay encuestas aún"
        description="Crea tu primera encuesta para medir el clima laboral y bienestar de tu equipo."
        action-text="Crear encuesta"
        :action-icon="Plus"
        @action="crearEncuesta"
      />
    </div>

    <!-- Lista de Encuestas -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="encuesta in encuestas"
        :key="encuesta.id"
        class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
      >
        <!-- Header de la Card -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ encuesta.titulo }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ encuesta.descripcion || 'Sin descripción' }}
              </p>
            </div>
            <span
              :class="getEstadoColor(encuesta.estado)"
              class="px-3 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap ml-3"
            >
              {{ encuesta.estado }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              :class="getCategoriaColor(encuesta.categoria)"
              class="px-3 py-1 text-xs font-medium rounded-full"
            >
              {{ getCategoriaLabel(encuesta.categoria) }}
            </span>
            <span class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              {{ encuesta.totalPreguntas }} pregunta{{ encuesta.totalPreguntas !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Info -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500 block">Creada</span>
              <span class="font-medium text-gray-900">
                {{ formatearFecha(encuesta.fecha_creacion) }}
              </span>
            </div>
            <div>
              <span class="text-gray-500 block">Privacidad</span>
              <span class="font-medium text-gray-900 capitalize">
                {{ encuesta.privacidad_nivel.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <div v-if="encuesta.fecha_inicio || encuesta.fecha_fin" class="mt-3 pt-3 border-t border-gray-200">
            <div class="text-sm">
              <span class="text-gray-500">Periodo: </span>
              <span class="font-medium text-gray-900">
                {{ formatearFecha(encuesta.fecha_inicio) }} - {{ formatearFecha(encuesta.fecha_fin) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-4 bg-white flex gap-2">
          <button
            v-if="encuesta.estado === 'Activa'"
            @click="verResultados(encuesta.id)"
            class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <BarChart3 class="h-4 w-4" />
            Ver Resultados
          </button>
          <button
            @click="editarEncuesta(encuesta.id)"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            <Edit class="h-4 w-4" />
            Editar
          </button>
          <button
            @click="confirmarEliminar(encuesta.id)"
            class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
