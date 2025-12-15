<template>
  <div class="min-h-screen bg-gray-50">

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Centro de Comunicación Interna
          </h1>
          <p class="text-gray-600 mt-2">
            Gestiona los comunicados, su alcance y el historial de envíos
          </p>
        </div>

        <!-- Tabs -->
        <div class="mb-6">
          <div class="flex gap-4 border-b border-gray-200">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="tabActiva = tab.id"
              class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2"
              :class="tabActiva === tab.id
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'"
            >
              <component :is="tab.icon" class="h-5 w-5" />
              {{ tab.nombre }}
            </button>
          </div>
        </div>

        <!-- Contenido de tabs -->
        <div>
          <!-- Tab: Crear Comunicado -->
          <div v-if="tabActiva === 'crear'" class="space-y-6">
            <FormularioCrearComunicado
              :comunicado-inicial="comunicadoEditando"
              @comunicado-creado="handleComunicadoCreado"
              @cancelar="limpiarEdicion"
            />
          </div>

          <!-- Tab: Historial -->
          <div v-else-if="tabActiva === 'historial'" class="space-y-6">
            <HistorialComunicados
              @ver-comunicado="verComunicado"
              @duplicar-comunicado="duplicar"
              @eliminar-comunicado="confirmarEliminar"
            />
          </div>

          <!-- Tab: Analítica -->
          <div v-else-if="tabActiva === 'analitica'" class="space-y-6">
            <AnaliticaDifusion />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Comunicado -->
    <Dialog
      v-model:visible="modalVerAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Mail class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              {{ comunicadoSeleccionado?.titulo }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="obtenerColorEstado(comunicadoSeleccionado?.estado).badge"
              >
                {{ comunicadoSeleccionado?.estado }}
              </span>
              <span class="text-xs text-gray-500">
                {{ comunicadoSeleccionado?.tipo }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="comunicadoSeleccionado" class="space-y-6">
        <!-- Metadatos -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Fecha de envío</h4>
            <p class="text-base text-gray-900">
              {{ formatearFecha(comunicadoSeleccionado.fecha_envio) }}
            </p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Interacciones</h4>
            <p class="text-base font-semibold" :class="obtenerColorInteraccion(comunicadoSeleccionado.interacciones)">
              {{ comunicadoSeleccionado.interacciones }}%
            </p>
          </div>
        </div>

        <!-- Destinatarios -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Destinatarios</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="dept in comunicadoSeleccionado.destinatarios"
              :key="dept"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
            >
              {{ dept }}
            </span>
          </div>
        </div>

        <!-- Roles -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Roles</h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="rol in comunicadoSeleccionado.roles"
              :key="rol"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700"
            >
              {{ rol }}
            </span>
          </div>
        </div>

        <!-- Contenido -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Contenido</h4>
          <div class="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-gray-900">
            {{ comunicadoSeleccionado.contenido }}
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Modal Confirmación Eliminación -->
    <Dialog
      v-model:visible="modalConfirmacionAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '30rem' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle class="h-6 w-6 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">
            Confirmar eliminación
          </h3>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700">
          ¿Estás seguro de que deseas eliminar este comunicado?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm font-semibold text-gray-900">
            {{ comunicadoAEliminar?.titulo }}
          </p>
          <p class="text-xs text-gray-600 mt-1">
            Tipo: {{ comunicadoAEliminar?.tipo }}
          </p>
        </div>
        <p class="text-sm text-red-600">
          Esta acción no se puede deshacer.
        </p>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <button
            @click="modalConfirmacionAbierto = false"
            class="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="eliminar"
            class="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import FormularioCrearComunicado from '@/components/admin/FormularioCrearComunicado.vue';
import HistorialComunicados from '@/components/admin/HistorialComunicados.vue';
import AnaliticaDifusion from '@/components/admin/AnaliticaDifusion.vue';
import {
  Send,
  FileText,
  BarChart3,
  Mail,
  AlertTriangle
} from 'lucide-vue-next';

// TODO: Load comunicados from Supabase comunicados, departamentos, and usuarios tables

const toast = useToast();

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

const tabs = [
  { id: 'crear', nombre: 'Crear comunicado', icon: Send },
  { id: 'historial', nombre: 'Historial', icon: FileText },
  { id: 'analitica', nombre: 'Analítica', icon: BarChart3 }
];

const tabActiva = ref('crear');
const comunicadoEditando = ref(null);
const comunicadoSeleccionado = ref(null);
const comunicadoAEliminar = ref(null);
const modalVerAbierto = ref(false);
const modalConfirmacionAbierto = ref(false);

const formatearFecha = (fecha) => {
  if (!fecha) return 'No enviado';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const handleComunicadoCreado = () => {
  toast.success('Comunicado creado correctamente', {
    timeout: 4000
  });
  tabActiva.value = 'historial';
  limpiarEdicion();
};

const verComunicado = (comunicado) => {
  comunicadoSeleccionado.value = comunicado;
  modalVerAbierto.value = true;
};

const duplicar = (comunicado) => {
  // TODO: Implement duplication with Supabase
  comunicadoEditando.value = { ...comunicado, id: null };
  tabActiva.value = 'crear';
  toast.info('Comunicado duplicado. Puedes editarlo y enviarlo nuevamente', {
    timeout: 4000
  });
};

const confirmarEliminar = (comunicado) => {
  comunicadoAEliminar.value = comunicado;
  modalConfirmacionAbierto.value = true;
};

const eliminar = () => {
  if (comunicadoAEliminar.value) {
    // TODO: Delete from Supabase
    console.log('Eliminando comunicado:', comunicadoAEliminar.value.id);
    toast.success('Comunicado eliminado correctamente', {
      timeout: 3000
    });
    modalConfirmacionAbierto.value = false;
    comunicadoAEliminar.value = null;
  }
};

const limpiarEdicion = () => {
  comunicadoEditando.value = null;
};
</script>
