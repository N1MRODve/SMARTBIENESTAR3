<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import {
  Gift, Plus, Settings, TrendingUp, Award, Users, CheckCircle, Clock,
  Sparkles, Info, HelpCircle, Edit, Trash2, History, AlertCircle, RefreshCw,
  FileText, Target, Crown, Zap, Star
} from 'lucide-vue-next';
import Button from '@/components/common/Button.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import RecompensaFormModal from '@/components/admin/RecompensaFormModal.vue';
import { useToast } from '@/composables/useToast';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const recompensas = ref([]);
const historialCanjes = ref([]);
const encuestas = ref([]);
const loading = ref(true);
const error = ref(null);
const mostrarModal = ref(false);
const mostrarConfiguracion = ref(false);
const recompensaSeleccionada = ref(null);
const guardando = ref(false);
const vistaActual = ref('recompensas');

// Configuración de puntos (valores default - los reales vienen de BD por encuesta)
const configuracionPuntos = ref({
  encuesta_estandar: 50,  // Puntos base por defecto
  encuesta_bonus_rapido: 25, // Bonus por respuesta rápida
  asistencia_evento: 75,
  sugerencia_implementada: 300,
  referir_empleado: 50,
  participacion_mensual: 200
});

// Computed - Stats KPIs
const stats = computed(() => {
  const total = recompensas.value.length;
  const activas = recompensas.value.filter(r => r.activa).length;

  // Calcular puntos otorgados totales (basado en historial)
  const puntosOtorgados = historialCanjes.value.reduce((sum, canje) =>
    sum + (canje.puntos_gastados || 0), 0
  );

  // Recompensa más popular
  const canjesPorRecompensa = {};
  historialCanjes.value.forEach(canje => {
    const id = canje.recompensa_id;
    canjesPorRecompensa[id] = (canjesPorRecompensa[id] || 0) + 1;
  });

  let recompensaMasPopular = null;
  let maxCanjes = 0;
  Object.entries(canjesPorRecompensa).forEach(([id, cantidad]) => {
    if (cantidad > maxCanjes) {
      maxCanjes = cantidad;
      recompensaMasPopular = recompensas.value.find(r => r.id === parseInt(id));
    }
  });

  return {
    puntosOtorgados,
    recompensasActivas: activas,
    totalCanjes: historialCanjes.value.length,
    recompensaMasPopular: recompensaMasPopular?.nombre || 'N/A',
    totalRecompensas: total
  };
});

const hasRecompensas = computed(() => recompensas.value.length > 0);

onMounted(async () => {
  await Promise.all([
    cargarRecompensas(),
    cargarHistorial(),
    cargarEncuestas()
  ]);
  cargarConfiguracion();
});

const cargarConfiguracion = () => {
  const saved = localStorage.getItem('configuracion_puntos');
  if (saved) {
    configuracionPuntos.value = JSON.parse(saved);
  }
};

const guardarConfiguracion = () => {
  localStorage.setItem('configuracion_puntos', JSON.stringify(configuracionPuntos.value));
  toast.success('Configuración de puntos guardada correctamente', { icon: '⚙️' });
  mostrarConfiguracion.value = false;
};

const cargarRecompensas = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { data, error: err } = await supabase
      .from('recompensas')
      .select('*')
      .eq('empresa_id', authStore.empresaId)
      .order('costo_puntos', { ascending: true });

    if (err) throw err;
    recompensas.value = data || [];
  } catch (err) {
    console.error('Error cargando recompensas:', err);
    error.value = 'No se pudieron cargar las recompensas';
    recompensas.value = [];
  } finally {
    loading.value = false;
  }
};

const cargarHistorial = async () => {
  try {
    const { data, error: err } = await supabase
      .from('canjes_recompensas')
      .select(`
        *,
        empleado:empleados (
          id,
          nombre,
          email
        ),
        recompensa:recompensas (
          id,
          nombre,
          categoria
        )
      `)
      .eq('recompensa.empresa_id', authStore.empresaId)
      .order('fecha_canje', { ascending: false });

    if (err) throw err;
    historialCanjes.value = data || [];
  } catch (err) {
    console.error('Error cargando historial:', err);
    historialCanjes.value = [];
  }
};

const cargarEncuestas = async () => {
  try {
    const { data, error: err } = await supabase
      .from('encuestas')
      .select('id, titulo, estado, puntos_recompensa')
      .eq('empresa_id', authStore.empresaId)
      .eq('estado', 'Activa')
      .limit(5);

    if (err) throw err;
    encuestas.value = data || [];
  } catch (err) {
    console.error('Error cargando encuestas:', err);
    encuestas.value = [];
  }
};

const cambiarVista = async (vista) => {
  vistaActual.value = vista;
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

    const action = recompensaSeleccionada.value?.id ? 'actualizada' : 'creada';
    toast.success(`Recompensa ${action} correctamente`, { icon: '🎁' });
  } catch (err) {
    console.error('Error guardando recompensa:', err);
    toast.error('Error al guardar la recompensa. Por favor, verifica los datos e intenta de nuevo.');
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
    toast.success('Recompensa eliminada correctamente', { icon: '🗑️' });
  } catch (err) {
    console.error('Error eliminando recompensa:', err);
    toast.error('Error al eliminar la recompensa. Por favor, intenta de nuevo.');
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

const irAEncuestas = () => {
  router.push('/admin/encuestas');
};
</script>

<template>
  <div class="space-y-6">

    <!-- Header con gradiente -->
    <div class="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl shadow-xl p-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Gift class="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Sistema de Recompensas</h1>
            <p class="text-white/90 mt-1 text-lg">Incentiva la participación y refuerza hábitos saludables mediante puntos canjeables</p>
          </div>
        </div>
        <button
          v-if="hasRecompensas"
          @click="abrirModalCrear"
          class="bg-white text-orange-600 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg flex items-center"
        >
          <Plus class="h-5 w-5 mr-2" />
          Nueva Recompensa
        </button>
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
      <Button @click="cargarRecompensas()">
        <RefreshCw class="h-4 w-4 mr-2" />
        Reintentar
      </Button>
    </div>

    <!-- ESTADO VACÍO - Onboarding Completo -->
    <template v-else-if="!hasRecompensas">

      <!-- Bloque de Bienvenida -->
      <div class="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200 p-8 mb-6">
        <div class="max-w-3xl mx-auto text-center">
          <div class="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles class="h-10 w-10 text-orange-600" />
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            Motiva hasta un 40% más la participación con recompensas
          </h2>

          <p class="text-gray-700 text-lg mb-6 leading-relaxed">
            Las recompensas transforman puntos en beneficios reales, creando un ciclo de motivación
            que <strong>aumenta la participación en encuestas, eventos y programas de bienestar</strong>.
          </p>

          <!-- CTA Principal -->
          <button
            @click="abrirModalCrear"
            class="group bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-xl inline-flex items-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus class="h-6 w-6 mr-2 group-hover:scale-110 transition-transform" />
            Crear primera recompensa
            <Sparkles class="h-5 w-5 ml-2 group-hover:rotate-12 transition-transform" />
          </button>

          <p class="text-sm text-gray-500 mt-3">💡 Comienza con 3-5 recompensas de diferentes rangos de puntos</p>
        </div>

        <!-- Cómo funciona - 3 pasos -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-orange-100 mt-6 max-w-4xl mx-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
            <Info class="h-5 w-5 mr-2 text-orange-600" />
            Cómo funciona el sistema (3 pasos)
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Paso 1 -->
            <div class="text-left">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-orange-700 font-bold text-sm">1</span>
                </div>
                <h4 class="font-semibold text-gray-900">Crea recompensas</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">
                Define beneficios atractivos: días libres, tarjetas regalo, desayunos, formación, eventos especiales.
              </p>
            </div>

            <!-- Paso 2 -->
            <div class="text-left">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-orange-700 font-bold text-sm">2</span>
                </div>
                <h4 class="font-semibold text-gray-900">Asigna puntos</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">
                Configura cuántos puntos cuesta cada recompensa. Recomendación: 200-500 para básicas, 1000+ para premium.
              </p>
            </div>

            <!-- Paso 3 -->
            <div class="text-left">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-orange-700 font-bold text-sm">3</span>
                </div>
                <h4 class="font-semibold text-gray-900">Los empleados canjean</h4>
              </div>
              <p class="text-sm text-gray-600 ml-11">
                Los empleados acumulan puntos participando y los canjean por las recompensas que prefieras.
              </p>
            </div>
          </div>
        </div>

        <!-- Garantías visuales -->
        <div class="flex flex-wrap items-center justify-center gap-4 mt-6">
          <div class="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-100">
            <CheckCircle class="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
            <span class="text-sm font-medium text-gray-700">Canjes automáticos</span>
          </div>
          <div class="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-100">
            <TrendingUp class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
            <span class="text-sm font-medium text-gray-700">Tracking en tiempo real</span>
          </div>
          <div class="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-orange-100">
            <Award class="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
            <span class="text-sm font-medium text-gray-700">Totalmente personalizable</span>
          </div>
        </div>
      </div>

      <!-- Configuración de Sistema de Puntos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <Star class="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-white">Configuración del Sistema de Puntos</h3>
                <p class="text-white/80 text-sm">Define cuántos puntos ganan los empleados por cada actividad</p>
              </div>
            </div>
            <button
              @click="mostrarConfiguracion = !mostrarConfiguracion"
              class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Settings class="h-4 w-4 mr-2" />
              {{ mostrarConfiguracion ? 'Ocultar' : 'Configurar' }}
            </button>
          </div>
        </div>

        <div v-if="mostrarConfiguracion" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <FileText class="h-4 w-4 inline mr-1 text-purple-600" />
                Encuesta estándar
              </label>
              <input
                v-model.number="configuracionPuntos.encuesta_estandar"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">5-10 preguntas</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <Zap class="h-4 w-4 inline mr-1 text-yellow-600" />
                Respuesta rápida
              </label>
              <input
                v-model.number="configuracionPuntos.encuesta_rapida"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">&lt;24 horas</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <FileText class="h-4 w-4 inline mr-1 text-indigo-600" />
                Encuesta extensa
              </label>
              <input
                v-model.number="configuracionPuntos.encuesta_extensa"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">20+ preguntas</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <Users class="h-4 w-4 inline mr-1 text-green-600" />
                Asistencia a evento
              </label>
              <input
                v-model.number="configuracionPuntos.asistencia_evento"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Talleres, charlas</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <Target class="h-4 w-4 inline mr-1 text-blue-600" />
                Sugerencia implementada
              </label>
              <input
                v-model.number="configuracionPuntos.sugerencia_implementada"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Ideas adoptadas</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                <Award class="h-4 w-4 inline mr-1 text-pink-600" />
                Participación mensual
              </label>
              <input
                v-model.number="configuracionPuntos.participacion_mensual"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">Bonus mensual</p>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex items-start">
              <Info class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-blue-800 font-medium">💡 Consejos de configuración</p>
                <ul class="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                  <li>Los puntos se acreditan automáticamente al completar cada actividad</li>
                  <li>Puedes modificar estos valores en cualquier momento</li>
                  <li>Recomendación: mantén ratios 1:1 con el tiempo invertido (100pts = 10 min)</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="guardarConfiguracion"
              class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <CheckCircle class="h-4 w-4 mr-2" />
              Guardar configuración
            </button>
          </div>
        </div>
      </div>

      <!-- Preview del Estado Futuro -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <Crown class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Vista previa: Cuando tengas recompensas</h3>
            <p class="text-sm text-gray-600">Así se verá el catálogo cuando crees tus primeras recompensas</p>
          </div>
        </div>

        <!-- Mock de KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-4 border-2 border-dashed border-orange-200">
            <div class="flex items-center justify-between mb-2">
              <Star class="h-8 w-8 text-orange-400" />
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
            <p class="text-2xl font-bold text-gray-400">12,450</p>
            <p class="text-sm text-gray-500">Puntos canjeados</p>
          </div>

          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-dashed border-green-200">
            <div class="flex items-center justify-between mb-2">
              <Gift class="h-8 w-8 text-green-400" />
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
            <p class="text-2xl font-bold text-gray-400">8</p>
            <p class="text-sm text-gray-500">Recompensas activas</p>
          </div>

          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-dashed border-blue-200">
            <div class="flex items-center justify-between mb-2">
              <TrendingUp class="h-8 w-8 text-blue-400" />
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
            <p class="text-2xl font-bold text-gray-400">23</p>
            <p class="text-sm text-gray-500">Recompensas canjeadas</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-dashed border-purple-200">
            <div class="flex items-center justify-between mb-2">
              <Award class="h-8 w-8 text-purple-400" />
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
            <p class="text-xl font-bold text-gray-400">Tarjeta Amazon</p>
            <p class="text-sm text-gray-500">Más popular</p>
          </div>
        </div>

        <!-- Mock de Card de Recompensa -->
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-1 max-w-sm mx-auto">
          <div class="bg-white rounded-lg overflow-hidden opacity-60">
            <div class="h-32 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center relative">
              <Gift class="h-16 w-16 text-white/50" />
              <div class="absolute top-2 right-2 bg-white/80 rounded-full px-3 py-1">
                <span class="text-sm font-bold text-gray-600">500 pts</span>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-bold text-gray-600 mb-1">Tarjeta Regalo Amazon</h4>
              <p class="text-xs text-gray-500 mb-2">Tarjeta de $25 USD para Amazon</p>
              <div class="flex gap-2">
                <div class="flex-1 bg-gray-200 rounded py-1.5 text-center text-xs text-gray-500">Editar</div>
                <div class="bg-gray-200 rounded px-3 py-1.5 text-xs text-gray-500">🗑️</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de características -->
        <div class="mt-6 bg-gray-50 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-700 mb-3">Al crear recompensas, desbloquearás:</p>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Catálogo visual de recompensas organizadas por puntos</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Historial completo de canjes con datos de empleados</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>KPIs de puntos canjeados y recompensas más populares</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Control de stock en tiempo real</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Edición y activación/desactivación de recompensas</span>
            </li>
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>Categorías personalizables (Wellness, Formación, Tiempo Libre, etc.)</span>
            </li>
          </ul>
        </div>

        <!-- Footer motivacional -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 mb-3">
            <strong>Comienza creando 3-5 recompensas</strong> en diferentes rangos de puntos para motivar a tu equipo
          </p>
          <button
            @click="abrirModalCrear"
            class="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all inline-flex items-center"
          >
            <Plus class="h-4 w-4 mr-2" />
            Crear mi primera recompensa
          </button>
        </div>
      </div>

    </template>

    <!-- ESTADO CON DATOS -->
    <template v-else>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Puntos Canjeados -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <Star class="h-8 w-8 text-orange-600" />
            <div class="cursor-help" title="Total de puntos canjeados por empleados en recompensas">
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.puntosOtorgados.toLocaleString() }}</p>
          <p class="text-sm text-gray-600 mt-1">Puntos Canjeados</p>
        </div>

        <!-- Recompensas Activas -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <Gift class="h-8 w-8 text-green-600" />
            <div class="cursor-help" title="Recompensas disponibles actualmente para canjear">
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.recompensasActivas }}</p>
          <p class="text-sm text-gray-600 mt-1">Recompensas Activas</p>
          <p class="text-xs text-gray-500 mt-1">de {{ stats.totalRecompensas }} totales</p>
        </div>

        <!-- Total Canjes -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <TrendingUp class="h-8 w-8 text-blue-600" />
            <div class="cursor-help" title="Número total de veces que empleados han canjeado recompensas">
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900">{{ stats.totalCanjes }}</p>
          <p class="text-sm text-gray-600 mt-1">Recompensas Canjeadas</p>
        </div>

        <!-- Más Popular -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <Award class="h-8 w-8 text-purple-600" />
            <div class="cursor-help" title="Recompensa con más canjes realizados">
              <HelpCircle class="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <p class="text-xl font-bold text-gray-900 truncate">{{ stats.recompensaMasPopular }}</p>
          <p class="text-sm text-gray-600 mt-1">Más Popular</p>
        </div>
      </div>

      <!-- Conexión con Encuestas -->
      <div v-if="encuestas.length > 0" class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FileText class="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Encuestas Activas Otorgando Puntos</h3>
              <p class="text-sm text-gray-600">Las siguientes encuestas están generando puntos canjeables</p>
            </div>
          </div>
          <button
            @click="irAEncuestas"
            class="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
          >
            Ver todas
            <Sparkles class="h-4 w-4 ml-1" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="encuesta in encuestas.slice(0, 3)"
            :key="encuesta.id"
            class="bg-white rounded-lg p-4 border border-purple-200 flex items-center justify-between"
          >
            <div class="flex-1">
              <p class="font-medium text-gray-900 text-sm">{{ encuesta.titulo }}</p>
              <div class="flex items-center mt-1">
                <Star class="h-3 w-3 text-orange-500 mr-1" />
                <span class="text-xs text-gray-600">+{{ encuesta.puntos_recompensa || configuracionPuntos.encuesta_estandar }} puntos</span>
              </div>
            </div>
            <CheckCircle class="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
          </div>
        </div>

        <div class="mt-4 bg-white/50 rounded-lg p-3 text-center">
          <p class="text-xs text-purple-800">
            💡 <strong>Las recompensas funcionan mejor cuando se comunican junto a la encuesta.</strong>
            Incluye el número de puntos en el mensaje de invitación.
          </p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              @click="cambiarVista('recompensas')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center',
                vistaActual === 'recompensas'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <Gift class="h-5 w-5 mr-2" />
              Catálogo ({{ recompensas.length }})
            </button>
            <button
              @click="cambiarVista('historial')"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center',
                vistaActual === 'historial'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <History class="h-5 w-5 mr-2" />
              Historial de Canjes
              <span v-if="stats.totalCanjes > 0" class="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                {{ stats.totalCanjes }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Catálogo de Recompensas -->
      <div v-if="vistaActual === 'recompensas'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="recompensa in recompensas"
            :key="recompensa.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:scale-105"
          >
            <div class="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex flex-col items-center justify-center relative">
              <Gift class="h-20 w-20 text-white mb-3" />
              <!-- Badge de Puntos -->
              <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div class="flex items-center">
                  <Star class="w-5 h-5 text-orange-500 mr-1" />
                  <span class="text-lg font-bold text-gray-900">{{ (recompensa.costo_puntos || 0).toLocaleString() }}</span>
                </div>
                <p class="text-xs text-gray-500 text-center">puntos</p>
              </div>
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ recompensa.nombre }}</h3>
                <span
                  :class="recompensa.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="px-2 py-1 text-xs font-medium rounded-full flex-shrink-0"
                >
                  {{ recompensa.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ recompensa.descripcion }}</p>
              <div class="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-3">
                <div>
                  <span class="text-xs text-gray-500 uppercase font-medium">Categoría</span>
                  <div class="text-sm font-semibold text-gray-900 capitalize">{{ recompensa.categoria }}</div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-500 uppercase font-medium">Stock</span>
                  <div class="text-sm font-semibold" :class="recompensa.stock === 0 ? 'text-red-600' : 'text-gray-900'">
                    {{ recompensa.stock === -1 ? '∞ Ilimitado' : `${recompensa.stock} disponibles` }}
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="abrirModalEditar(recompensa)"
                  class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Edit class="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  @click="confirmarEliminar(recompensa.id)"
                  class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
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
        <div v-if="historialCanjes.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200">
          <EmptyState
            :icon="History"
            title="Sin canjes aún"
            description="Los canjes realizados por los empleados aparecerán aquí."
          />
        </div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                <tr v-for="canje in historialCanjes" :key="canje.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ formatearFecha(canje.fecha_canje) }}</div>
                    <div class="text-xs text-gray-500">{{ formatearFechaCompleta(canje.fecha_canje) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
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
                    <div class="flex items-center bg-orange-50 rounded-lg px-3 py-1.5 inline-flex">
                      <Star class="w-4 h-4 text-orange-500 mr-1.5" />
                      <span class="text-sm font-bold text-orange-700">{{ (canje.puntos_gastados || 0).toLocaleString() }}</span>
                      <span class="text-xs text-orange-600 ml-1">pts</span>
                    </div>
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

    </template>

    <!-- Modal -->
    <RecompensaFormModal
      v-model:visible="mostrarModal"
      :recompensa="recompensaSeleccionada"
      :loading="guardando"
      @save="handleGuardarRecompensa"
    />

  </div>
</template>
