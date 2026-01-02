<template>
  <div class="bg-white shadow-sm rounded-xl overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          Historial de Comunicados
        </h2>
        <div class="flex items-center gap-3">
          <button
            @click="cargarComunicados"
            :disabled="loading"
            class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 16h5v5"/>
            </svg>
          </button>
          <div class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
            <FileText class="h-5 w-5 text-indigo-600" />
            <span class="text-sm font-semibold text-indigo-700">
              {{ comunicados.length }} comunicado{{ comunicados.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="p-8">
      <div class="flex flex-col items-center justify-center">
        <Loader2 class="h-8 w-8 text-indigo-600 animate-spin mb-3" />
        <p class="text-gray-600">Cargando comunicados...</p>
      </div>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="p-8">
      <div class="flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle class="h-8 w-8 text-red-600" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="cargarComunicados"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Tabla de comunicados -->
    <div v-else-if="comunicados.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destinatarios
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interacciones
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="comunicado in comunicados"
            :key="comunicado.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <!-- Fecha -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2 text-sm text-gray-900">
                <Calendar class="h-4 w-4 text-gray-400" />
                {{ formatearFecha(comunicado.fecha_envio) }}
              </div>
            </td>

            <!-- Título -->
            <td class="px-6 py-4">
              <div class="max-w-xs">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ comunicado.titulo }}
                </p>
              </div>
            </td>

            <!-- Tipo -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-xs text-gray-600">
                {{ comunicado.tipo }}
              </span>
            </td>

            <!-- Destinatarios -->
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1 max-w-xs">
                <span
                  v-for="(dept, index) in comunicado.destinatarios.slice(0, 2)"
                  :key="dept"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700"
                >
                  {{ dept }}
                </span>
                <span
                  v-if="comunicado.destinatarios.length > 2"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  +{{ comunicado.destinatarios.length - 2 }}
                </span>
              </div>
            </td>

            <!-- Estado -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="obtenerColorEstado(comunicado.estado).badge"
              >
                {{ comunicado.estado }}
              </span>
            </td>

            <!-- Interacciones -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2 w-16">
                  <div
                    class="h-2 rounded-full transition-all duration-300"
                    :class="comunicado.interacciones >= 80 ? 'bg-green-500' : comunicado.interacciones >= 60 ? 'bg-orange-500' : 'bg-red-500'"
                    :style="{ width: `${comunicado.interacciones}%` }"
                  ></div>
                </div>
                <span
                  class="text-sm font-semibold"
                  :class="obtenerColorInteraccion(comunicado.interacciones)"
                >
                  {{ comunicado.interacciones }}%
                </span>
              </div>
            </td>

            <!-- Acciones -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <button
                  @click="$emit('ver-comunicado', comunicado)"
                  class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Ver comunicado"
                >
                  <Eye class="h-5 w-5" />
                </button>
                <button
                  @click="$emit('duplicar-comunicado', comunicado)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Duplicar"
                >
                  <Copy class="h-5 w-5" />
                </button>
                <button
                  @click="$emit('eliminar-comunicado', comunicado)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vacío (solo si no está cargando y no hay error) -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText class="h-8 w-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        No hay comunicados registrados
      </h3>
      <p class="text-gray-600">
        Los comunicados aparecerán aquí una vez creados
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth.store';
import {
  FileText,
  Calendar,
  Eye,
  Copy,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-vue-next';

defineEmits(['ver-comunicado', 'duplicar-comunicado', 'eliminar-comunicado']);

const authStore = useAuthStore();

// Estado
const comunicados = ref([]);
const loading = ref(true);
const error = ref(null);

// ==========================================
// CARGAR COMUNICADOS DE LA EMPRESA
// ==========================================
const cargarComunicados = async () => {
  loading.value = true;
  error.value = null;

  try {
    const empresaId = authStore.empresaId;
    if (!empresaId) {
      throw new Error('No se encontró el ID de la empresa');
    }

    // Obtener comunicados de la empresa
    const { data: comunicadosData, error: comError } = await supabase
      .from('comunicados')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (comError) throw comError;

    // Para cada comunicado, calcular las interacciones (lecturas)
    const comunicadosConMetricas = await Promise.all(
      (comunicadosData || []).map(async (com) => {
        // Contar total de destinatarios potenciales
        let alcanceEstimado = com.alcance_estimado || 0;

        // Contar lecturas reales
        const { count: lecturas } = await supabase
          .from('comunicados_lecturas')
          .select('*', { count: 'exact', head: true })
          .eq('comunicado_id', com.id);

        // Calcular porcentaje de interacción
        const totalLecturas = lecturas || 0;
        const interacciones = alcanceEstimado > 0
          ? Math.round((totalLecturas / alcanceEstimado) * 100)
          : 0;

        // Normalizar estado para mostrar correctamente
        let estadoMostrar = com.estado;
        if (estadoMostrar) {
          estadoMostrar = estadoMostrar.charAt(0).toUpperCase() + estadoMostrar.slice(1).toLowerCase();
        }

        return {
          ...com,
          estado: estadoMostrar,
          interacciones: Math.min(interacciones, 100), // Máximo 100%
          totalLecturas,
          alcanceEstimado
        };
      })
    );

    comunicados.value = comunicadosConMetricas;
    console.log('[Historial] Comunicados cargados:', comunicadosConMetricas.length);
  } catch (err) {
    console.error('[Historial] Error cargando comunicados:', err);
    error.value = err.message || 'Error al cargar el historial';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarComunicados);

// Exponer función para refrescar desde el padre
defineExpose({ cargarComunicados });

const obtenerColorEstado = (estado) => {
  const colores = {
    'Enviado': { badge: 'bg-green-100 text-green-800' },
    'Programado': { badge: 'bg-yellow-100 text-yellow-800' },
    'Borrador': { badge: 'bg-gray-100 text-gray-800' }
  };
  return colores[estado] || { badge: 'bg-gray-100 text-gray-800' };
};

const obtenerColorInteraccion = (interacciones) => {
  if (interacciones >= 80) return 'text-green-600';
  if (interacciones >= 60) return 'text-orange-600';
  return 'text-red-600';
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin enviar';
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};
</script>
