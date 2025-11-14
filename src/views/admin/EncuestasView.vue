<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, BarChart3, Edit, Trash2, ArrowRight } from 'lucide-vue-next';
import { DEMO_MODE } from '@/utils/demoData';
import * as mockEncuestasService from '@/services/mock/encuestas.service';

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
    'clima-laboral': 'Clima Laboral',
    'bienestar': 'Bienestar Personal',
    'desempeno': 'Carga y Desempeño',
    'integral': 'Evaluación 360'
  };
  return labels[categoria] || 'General';
};

onMounted(async () => {
  await cargarEncuestas();
});

const cargarEncuestas = async () => {
  isLoading.value = true;
  try {
    if (DEMO_MODE.enabled) {
      // Modo demo activo - usar datos mock
      const data = await mockEncuestasService.getEncuestas();
      encuestas.value = (data || []).map(enc => ({
        ...enc,
        totalPreguntas: enc.preguntas?.length || 0,
        estado: enc.estado_label || enc.estado
      }));
    } else {
      // Modo normal - intentar cargar desde Supabase
      const { data, error } = await supabase
        .from('encuestas')
        .select('*, preguntas:preguntas_encuesta(count)')
        .eq('empresa_id', authStore.empresaId)
        .order('fecha_creacion', { ascending: false });

      if (error) {
        console.error('Error de Supabase:', error);
        // Si hay error, usar datos demo como fallback
        const demoData = await mockEncuestasService.getEncuestas();
        encuestas.value = (demoData || []).map(enc => ({
          ...enc,
          totalPreguntas: enc.preguntas?.length || 0,
          estado: enc.estado_label || enc.estado
        }));
      } else {
        // Si no hay datos, usar demo como fallback
        if (!data || data.length === 0) {
          const demoData = await mockEncuestasService.getEncuestas();
          encuestas.value = (demoData || []).map(enc => ({
            ...enc,
            totalPreguntas: enc.preguntas?.length || 0,
            estado: enc.estado_label || enc.estado
          }));
        } else {
          encuestas.value = (data || []).map(enc => ({
            ...enc,
            totalPreguntas: enc.preguntas[0]?.count || 0
          }));
        }
      }
    }
  } catch (error) {
    console.error('Error cargando encuestas:', error);
    // Fallback a datos demo
    try {
      const demoData = await mockEncuestasService.getEncuestas();
      encuestas.value = (demoData || []).map(enc => ({
        ...enc,
        totalPreguntas: enc.preguntas?.length || 0,
        estado: enc.estado_label || enc.estado
      }));
    } catch (demoError) {
      console.error('Error cargando datos demo:', demoError);
    }
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
    if (DEMO_MODE.enabled) {
      await mockEncuestasService.deleteSurvey(id);
    } else {
      const { error } = await supabase
        .from('encuestas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }
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
    <div class="card p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
            <FileText class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Encuestas de Bienestar</h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ encuestas.length }} encuesta{{ encuestas.length !== 1 ? 's' : '' }} en el sistema
            </p>
          </div>
        </div>
        <button
          @click="crearEncuesta"
          class="btn btn-primary"
        >
          <Plus class="h-4 w-4 mr-2" />
          Nueva Encuesta
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner h-12 w-12"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasEncuestas" class="card empty-state">
      <div class="empty-state-icon">
        <FileText class="h-16 w-16 text-gray-400" />
      </div>
      <h3 class="empty-state-title">Sin encuestas creadas</h3>
      <p class="empty-state-description">
        Crea tu primera encuesta para comenzar a medir el bienestar de tu equipo
      </p>
      <button
        @click="crearEncuesta"
        class="btn btn-primary"
      >
        <Plus class="h-4 w-4 mr-2" />
        Crear primera encuesta
      </button>
    </div>

    <!-- Lista de Encuestas -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="encuesta in encuestas"
        :key="encuesta.id"
        class="card-hover overflow-hidden"
      >
        <!-- Content -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 pr-4">
              <h3 class="text-base font-semibold text-gray-900 mb-1">
                {{ encuesta.titulo }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ encuesta.descripcion || 'Sin descripción' }}
              </p>
            </div>
            <span
              class="badge"
              :class="{
                'badge-success': encuesta.estado === 'Activa' || encuesta.estado === 'activa',
                'badge-warning': encuesta.estado === 'borrador' || encuesta.estado === 'Borrador',
                'badge-info': encuesta.estado === 'programada' || encuesta.estado === 'Programada',
                'badge-light': encuesta.estado === 'completada' || encuesta.estado === 'Completada' || encuesta.estado === 'Finalizada'
              }"
            >
              {{ encuesta.estado }}
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs text-gray-600 mb-4">
            <span>{{ getCategoriaLabel(encuesta.categoria) }}</span>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>{{ encuesta.totalPreguntas }} pregunta{{ encuesta.totalPreguntas !== 1 ? 's' : '' }}</span>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span class="text-gray-500 text-xs block mb-1">Creada</span>
                <span class="font-medium text-gray-900 text-xs">
                  {{ formatearFecha(encuesta.fecha_creacion) }}
                </span>
              </div>
              <div>
                <span class="text-gray-500 text-xs block mb-1">Privacidad</span>
                <span class="font-medium text-gray-900 text-xs capitalize">
                  {{ encuesta.privacidad_nivel.replace('_', ' ') }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                v-if="encuesta.estado === 'Activa' || encuesta.estado === 'activa' || encuesta.estado === 'Completada' || encuesta.estado === 'completada'"
                @click="verResultados(encuesta.id)"
                class="flex-1 btn btn-primary text-xs py-2"
              >
                <BarChart3 class="h-3.5 w-3.5 mr-1.5" />
                Resultados
              </button>
              <button
                @click="editarEncuesta(encuesta.id)"
                class="flex-1 btn btn-outline text-xs py-2"
              >
                <Edit class="h-3.5 w-3.5 mr-1.5" />
                Editar
              </button>
              <button
                @click="confirmarEliminar(encuesta.id)"
                class="btn btn-ghost text-xs py-2 px-3 text-red-600 hover:bg-red-50"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
