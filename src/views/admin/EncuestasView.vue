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

    <!-- Header con Color -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <FileText class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Encuestas de Bienestar</h1>
            <p class="text-white/80 mt-1">
              {{ encuestas.length }} encuesta{{ encuestas.length !== 1 ? 's' : '' }} en el sistema
            </p>
          </div>
        </div>
        <button
          @click="crearEncuesta"
          class="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center shadow-lg"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Encuesta
        </button>
      </div>
    </div>

    <!-- Panel Informativo de Puntos -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-md mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-bold text-amber-900 mb-2">Sistema de Recompensas por Participación</h3>
          <p class="text-sm text-amber-800 mb-3">Los empleados ganan puntos automáticamente al completar encuestas. Configura cuántos puntos otorga cada encuesta al crearla o editarla.</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div class="bg-white rounded-lg p-3 border border-amber-200">
              <p class="text-xl font-bold text-amber-600">+100 pts</p>
              <p class="text-xs text-amber-800">Encuesta estándar</p>
            </div>
            <div class="bg-white rounded-lg p-3 border border-amber-200">
              <p class="text-xl font-bold text-amber-600">+150 pts</p>
              <p class="text-xs text-amber-800">Respuesta rápida</p>
            </div>
            <div class="bg-white rounded-lg p-3 border border-amber-200">
              <p class="text-xl font-bold text-amber-600">Variable</p>
              <p class="text-xs text-amber-800">Según tu configuración</p>
            </div>
          </div>
          <p class="text-xs text-amber-700 mt-3">💡 Los puntos se acreditan automáticamente al completar la encuesta. Los empleados pueden canjearlos en el catálogo de recompensas.</p>
        </div>
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
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <!-- Badge de Puntos -->
            <div class="inline-flex items-center bg-amber-50 rounded-full px-2.5 py-1 border border-amber-200">
              <svg class="w-3.5 h-3.5 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-xs font-bold text-amber-700">{{ encuesta.puntos_otorgados || 100 }} pts</span>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <div class="grid grid-cols-3 gap-4 text-sm mb-4">
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
              <div>
                <span class="text-gray-500 text-xs block mb-1">Recompensa</span>
                <div class="flex items-center">
                  <svg class="w-3 h-3 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="font-bold text-amber-600 text-xs">{{ encuesta.puntos_otorgados || 100 }}</span>
                </div>
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
