<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { supabase } from '@/lib/supabase';
import {
  FileText, Plus, BarChart3, Edit, Trash2, ArrowRight,
  CheckCircle, Settings, Sparkles, TrendingUp, Clock, Users,
  Shield, Info
} from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

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

// Determina si se puede ver resultados según el estado
const puedeVerResultados = (estado) => {
  if (!estado) return false;
  const estadoLower = estado.toLowerCase();
  return ['activa', 'completada', 'finalizada'].includes(estadoLower);
};

const verResultados = (encuestaId) => {
  console.log('[EncuestasView] verResultados llamado con ID:', encuestaId);
  if (!encuestaId) {
    console.error('[EncuestasView] ID de encuesta no válido');
    return;
  }
  router.push({ name: 'admin-encuesta-resultados', params: { encuestaId } });
};

const editarEncuesta = (encuestaId) => {
  router.push({ name: 'admin-editar-encuesta', params: { encuestaId } });
};

const crearEncuesta = () => {
  router.push('/admin/encuestas/crear');
};

const configurarPuntos = () => {
  toast.info('Configura los puntos al crear o editar cada encuesta', { icon: '⚙️' });
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
    toast.success('Encuesta eliminada correctamente', { icon: '🗑️' });
  } catch (error) {
    console.error('Error eliminando encuesta:', error);
    toast.error('Error al eliminar la encuesta. Por favor, intenta de nuevo.');
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
            <h1 class="text-3xl font-bold text-white">Encuestas de Bienestar</h1>
            <p class="text-white/80 mt-1">
              {{ encuestas.length }} encuesta{{ encuestas.length !== 1 ? 's' : '' }} en el sistema
            </p>
          </div>
        </div>
        <button
          v-if="hasEncuestas"
          @click="crearEncuesta"
          class="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-colors inline-flex items-center shadow-lg"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Encuesta
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>

    <!-- Estado Vacío - Onboarding Completo -->
    <template v-else-if="!hasEncuestas">
      <!-- Bienvenida y Valor -->
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-8 shadow-sm">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
            <Sparkles class="h-10 w-10 text-purple-600" />
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            Toma decisiones basadas en datos reales de tu equipo
          </h2>

          <p class="text-gray-600 text-lg mb-6 leading-relaxed">
            Las encuestas de bienestar te permiten detectar riesgos, identificar oportunidades de mejora
            y medir el impacto de tus iniciativas. Todo de forma anónima y segura.
          </p>

          <!-- CTA Principal Único -->
          <div class="mb-6">
            <button
              @click="crearEncuesta"
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center text-lg group"
            >
              <Plus class="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
              Crear encuesta de bienestar
              <ArrowRight class="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <p class="text-sm text-gray-500 mt-3">
              ⏱️ Tardarás menos de 2 minutos
            </p>
          </div>

          <!-- Pasos Claros -->
          <div class="bg-white rounded-xl p-6 shadow-sm border border-purple-100 mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Info class="h-5 w-5 mr-2 text-purple-600" />
              Cómo funciona (3 pasos simples)
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Paso 1 -->
              <div class="text-left">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-700 font-bold text-sm">1</span>
                  </div>
                  <h4 class="font-semibold text-gray-900">Crea tu encuesta</h4>
                </div>
                <p class="text-sm text-gray-600 ml-11">
                  Elige una plantilla o crea preguntas personalizadas sobre salud mental, carga laboral o clima.
                </p>
              </div>

              <!-- Paso 2 -->
              <div class="text-left">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-700 font-bold text-sm">2</span>
                  </div>
                  <h4 class="font-semibold text-gray-900">Asigna recompensas</h4>
                </div>
                <p class="text-sm text-gray-600 ml-11">
                  Define cuántos puntos ganarán los empleados al completarla (base: 50, bonus opcional).
                </p>
              </div>

              <!-- Paso 3 -->
              <div class="text-left">
                <div class="flex items-center mb-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-purple-700 font-bold text-sm">3</span>
                  </div>
                  <h4 class="font-semibold text-gray-900">Publica y analiza</h4>
                </div>
                <p class="text-sm text-gray-600 ml-11">
                  Envíala a tu equipo y recibe resultados agregados en tiempo real, 100% anónimos.
                </p>
              </div>
            </div>
          </div>

          <!-- Garantías de Privacidad -->
          <div class="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div class="flex items-center">
              <Shield class="h-4 w-4 text-green-600 mr-2" />
              <span>Respuestas anónimas</span>
            </div>
            <div class="flex items-center">
              <BarChart3 class="h-4 w-4 text-blue-600 mr-2" />
              <span>Datos agregados</span>
            </div>
            <div class="flex items-center">
              <TrendingUp class="h-4 w-4 text-purple-600 mr-2" />
              <span>Insights accionables</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sistema de Recompensas - Card Interactiva -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
          <h3 class="text-lg font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Sistema de Recompensas
          </h3>
        </div>

        <div class="p-6">
          <p class="text-gray-700 mb-6">
            Incentiva la participación otorgando puntos que tus empleados podrán canjear por recompensas.
            Tú decides cuántos puntos vale cada encuesta.
          </p>

          <!-- Tipos de Puntos -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl font-bold text-amber-600">100</span>
                <span class="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium">Estándar</span>
              </div>
              <p class="text-sm text-gray-700 font-medium mb-1">Encuesta corta</p>
              <p class="text-xs text-gray-600">5-10 preguntas rápidas</p>
            </div>

            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl font-bold text-amber-600">150</span>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Recomendado</span>
              </div>
              <p class="text-sm text-gray-700 font-medium mb-1">Encuesta completa</p>
              <p class="text-xs text-gray-600">10-20 preguntas detalladas</p>
            </div>

            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-2xl font-bold text-amber-600">200+</span>
                <span class="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">Premium</span>
              </div>
              <p class="text-sm text-gray-700 font-medium mb-1">Evaluación extensa</p>
              <p class="text-xs text-gray-600">20+ preguntas o evaluación 360</p>
            </div>
          </div>

          <!-- Info y CTA Secundario -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-blue-900 flex items-start">
              <Info class="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
              <span>
                <strong>Configurable:</strong> Puedes modificar los puntos de cada encuesta en cualquier momento.
                Los puntos se acreditan automáticamente al completar la encuesta.
              </span>
            </p>
          </div>

          <button
            @click="configurarPuntos"
            class="w-full bg-white border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center"
          >
            <Settings class="h-5 w-5 mr-2" />
            Configurar sistema de puntos
          </button>
        </div>
      </div>

      <!-- Preview del Estado Futuro -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <FileText class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Vista previa: Tus encuestas</h3>
            <p class="text-sm text-gray-600">Esto es lo que verás cuando tengas encuestas activas</p>
          </div>
        </div>

        <!-- Preview de Card de Encuesta -->
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
          <div class="space-y-4">
            <!-- Header simulado -->
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <div class="h-4 w-32 bg-gray-300 rounded"></div>
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Activa</span>
                </div>
                <div class="h-3 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>

            <!-- Meta info -->
            <div class="flex items-center gap-3 text-xs">
              <div class="flex items-center gap-1">
                <Users class="h-3 w-3 text-gray-400" />
                <span class="text-gray-600">Participación: 67%</span>
              </div>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <div class="flex items-center gap-1">
                <Clock class="h-3 w-3 text-gray-400" />
                <span class="text-gray-600">Última respuesta: Hace 2h</span>
              </div>
            </div>

            <!-- Lista de características -->
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-3">Información que verás:</p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Estado (Activa/Borrador/Cerrada)
                </div>
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Porcentaje de participación
                </div>
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Puntos otorgados
                </div>
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Última respuesta recibida
                </div>
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Fecha de creación
                </div>
                <div class="flex items-center text-gray-600">
                  <CheckCircle class="h-3 w-3 text-green-500 mr-2" />
                  Acciones rápidas (Editar/Duplicar)
                </div>
              </div>
            </div>

            <!-- Botones de acción simulados -->
            <div class="flex gap-2 pt-2">
              <div class="flex-1 h-9 bg-purple-200 rounded-lg flex items-center justify-center text-xs text-purple-700 font-medium">
                <BarChart3 class="h-3 w-3 mr-1" />
                Ver Resultados
              </div>
              <div class="flex-1 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-700 font-medium">
                <Edit class="h-3 w-3 mr-1" />
                Editar
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-500 mt-4 text-center">
          Comienza creando tu primera encuesta para desbloquear análisis y métricas en tiempo real
        </p>
      </div>
    </template>

    <!-- Lista de Encuestas (Estado con Datos) -->
    <div v-else class="space-y-6">
      <!-- Panel Informativo de Puntos (solo cuando hay encuestas) -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-sm">
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
                <p class="text-xl font-bold text-amber-600">+50 pts</p>
                <p class="text-xs text-amber-800">Puntos base (estándar)</p>
              </div>
              <div class="bg-white rounded-lg p-3 border border-amber-200">
                <p class="text-xl font-bold text-amber-600">+Bonus</p>
                <p class="text-xs text-amber-800">Por respuesta rápida</p>
              </div>
              <div class="bg-white rounded-lg p-3 border border-amber-200">
                <p class="text-xl font-bold text-amber-600">Configurable</p>
                <p class="text-xs text-amber-800">Al crear encuesta</p>
              </div>
            </div>
            <p class="text-xs text-amber-700 mt-3">💡 Los puntos se acreditan automáticamente al completar la encuesta. Los empleados pueden canjearlos en el catálogo de recompensas.</p>
          </div>
        </div>
      </div>

      <!-- Grid de Encuestas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="encuesta in encuestas"
          :key="encuesta.id"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800': encuesta.estado === 'Activa' || encuesta.estado === 'activa',
                  'bg-yellow-100 text-yellow-800': encuesta.estado === 'borrador' || encuesta.estado === 'Borrador',
                  'bg-blue-100 text-blue-800': encuesta.estado === 'programada' || encuesta.estado === 'Programada',
                  'bg-gray-100 text-gray-800': encuesta.estado === 'completada' || encuesta.estado === 'Completada' || encuesta.estado === 'Finalizada'
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
                <span class="text-xs font-bold text-amber-700">{{ encuesta.puntos_base || 50 }} pts</span>
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
                    <span class="font-bold text-amber-600 text-xs">{{ encuesta.puntos_base || 50 }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  v-if="puedeVerResultados(encuesta.estado)"
                  @click.stop="verResultados(encuesta.id)"
                  class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center text-xs"
                >
                  <BarChart3 class="h-3.5 w-3.5 mr-1.5" />
                  Resultados
                </button>
                <button
                  @click="editarEncuesta(encuesta.id)"
                  class="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center justify-center text-xs"
                >
                  <Edit class="h-3.5 w-3.5 mr-1.5" />
                  Editar
                </button>
                <button
                  @click="confirmarEliminar(encuesta.id)"
                  class="bg-white border border-gray-300 hover:bg-red-50 text-red-600 font-medium py-2 px-3 rounded-lg transition-colors text-xs"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Animaciones suaves */
.card-hover {
  @apply transition-all duration-200;
}

.card-hover:hover {
  @apply shadow-lg -translate-y-1;
}
</style>
