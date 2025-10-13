<template>
  <div class="min-h-screen bg-gray-50">
    <Header subtitulo="Solicitudes de Servicios" />

    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                Solicitudes de Servicios
              </h1>
              <p class="text-gray-600 mt-2">
                Gestiona las solicitudes de implementación de programas y talleres
              </p>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
              <FileText class="h-5 w-5 text-indigo-600" />
              <span class="text-sm font-semibold text-indigo-700">
                {{ solicitudes.length }} solicitud{{ solicitudes.length !== 1 ? 'es' : '' }}
              </span>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Pendientes</p>
                  <p class="text-2xl font-bold text-yellow-700">{{ contarPorEstado('Pendiente') }}</p>
                </div>
                <Clock class="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">En curso</p>
                  <p class="text-2xl font-bold text-blue-700">{{ contarPorEstado('En curso') }}</p>
                </div>
                <PlayCircle class="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Completados</p>
                  <p class="text-2xl font-bold text-green-700">{{ contarPorEstado('Completado') }}</p>
                </div>
                <CheckCircle class="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-gray-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total</p>
                  <p class="text-2xl font-bold text-gray-700">{{ solicitudes.length }}</p>
                </div>
                <FileCheck class="h-8 w-8 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de Solicitudes -->
        <div class="bg-white shadow-sm rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Implementación
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="solicitud in solicitudes"
                  :key="solicitud.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <!-- Servicio -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">{{ solicitud.servicio.icono }}</span>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">
                          {{ solicitud.servicio.nombre }}
                        </p>
                        <p class="text-xs text-gray-500">
                          ID: {{ solicitud.id }}
                        </p>
                      </div>
                    </div>
                  </td>

                  <!-- Departamento -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <Building class="h-4 w-4 text-gray-400" />
                      <span class="text-sm text-gray-900">{{ solicitud.departamento }}</span>
                    </div>
                  </td>

                  <!-- Fecha -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <Calendar class="h-4 w-4 text-gray-400" />
                      <span class="text-sm text-gray-900">{{ formatearFecha(solicitud.fecha_implementacion) }}</span>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="px-6 py-4">
                    <select
                      :value="solicitud.estado"
                      @change="cambiarEstado(solicitud.id, $event.target.value)"
                      class="text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer transition-colors"
                      :class="obtenerColorEstado(solicitud.estado).badge"
                    >
                      <option v-for="estado in estadosDisponibles" :key="estado" :value="estado">
                        {{ estado }}
                      </option>
                    </select>
                  </td>

                  <!-- Acciones -->
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <button
                        @click="verDetalles(solicitud)"
                        class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye class="h-5 w-5" />
                      </button>
                      <button
                        @click="confirmarEliminar(solicitud)"
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

          <!-- Estado vacío -->
          <div v-if="solicitudes.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              No hay solicitudes registradas
            </h3>
            <p class="text-gray-600 mb-4">
              Las solicitudes de implementación aparecerán aquí
            </p>
            <button
              @click="irACatalogo"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus class="h-5 w-5" />
              Explorar servicios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles -->
    <Dialog
      v-model:visible="modalDetallesAbierto"
      modal
      :dismissableMask="true"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <span class="text-3xl">{{ solicitudSeleccionada?.servicio.icono }}</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Detalles de la Solicitud
            </h3>
            <p class="text-sm text-gray-600">
              ID: {{ solicitudSeleccionada?.id }}
            </p>
          </div>
        </div>
      </template>

      <div v-if="solicitudSeleccionada" class="space-y-6">
        <!-- Servicio -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Servicio</h4>
          <p class="text-base text-gray-900">{{ solicitudSeleccionada.servicio.nombre }}</p>
        </div>

        <!-- Info Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Departamento</h4>
            <p class="text-base text-gray-900">{{ solicitudSeleccionada.departamento }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Estado</h4>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="obtenerColorEstado(solicitudSeleccionada.estado).badge"
            >
              {{ solicitudSeleccionada.estado }}
            </span>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Fecha de Solicitud</h4>
            <p class="text-base text-gray-900">{{ formatearFecha(solicitudSeleccionada.fecha_solicitud) }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Fecha de Implementación</h4>
            <p class="text-base text-gray-900">{{ formatearFecha(solicitudSeleccionada.fecha_implementacion) }}</p>
          </div>
        </div>

        <!-- Objetivos -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Objetivos Específicos</h4>
          <p class="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">
            {{ solicitudSeleccionada.objetivos }}
          </p>
        </div>

        <!-- Comentarios -->
        <div v-if="solicitudSeleccionada.comentarios">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Comentarios</h4>
          <p class="text-sm text-gray-900 bg-gray-50 p-4 rounded-lg">
            {{ solicitudSeleccionada.comentarios }}
          </p>
        </div>

        <!-- Solicitante -->
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Solicitante</h4>
          <p class="text-base text-gray-900">{{ solicitudSeleccionada.solicitante }}</p>
        </div>
      </div>
    </Dialog>

    <!-- Modal de Confirmación de Eliminación -->
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
          ¿Estás seguro de que deseas eliminar esta solicitud?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-sm font-semibold text-gray-900">
            {{ solicitudAEliminar?.servicio.nombre }}
          </p>
          <p class="text-xs text-gray-600 mt-1">
            Departamento: {{ solicitudAEliminar?.departamento }}
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import Dialog from 'primevue/dialog';
import Header from '@/components/common/Header.vue';
import {
  FileText,
  Clock,
  PlayCircle,
  CheckCircle,
  FileCheck,
  Building,
  Calendar,
  Eye,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-vue-next';
import {
  solicitudesMock,
  estadosDisponibles,
  obtenerColorEstado,
  actualizarEstadoSolicitud,
  eliminarSolicitud
} from '@/utils/solicitudesMock.js';

// TODO: conectar con tablas "solicitudes_servicios" y "departamentos" en futuras iteraciones.

const router = useRouter();
const toast = useToast();

const solicitudes = ref(solicitudesMock);
const solicitudSeleccionada = ref(null);
const solicitudAEliminar = ref(null);
const modalDetallesAbierto = ref(false);
const modalConfirmacionAbierto = ref(false);

const contarPorEstado = (estado) => {
  return solicitudes.value.filter(s => s.estado === estado).length;
};

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const cambiarEstado = (id, nuevoEstado) => {
  actualizarEstadoSolicitud(id, nuevoEstado);
  toast.info(`Estado actualizado a "${nuevoEstado}"`, {
    timeout: 3000
  });
};

const verDetalles = (solicitud) => {
  solicitudSeleccionada.value = solicitud;
  modalDetallesAbierto.value = true;
};

const confirmarEliminar = (solicitud) => {
  solicitudAEliminar.value = solicitud;
  modalConfirmacionAbierto.value = true;
};

const eliminar = () => {
  if (solicitudAEliminar.value) {
    eliminarSolicitud(solicitudAEliminar.value.id);
    toast.success('Solicitud eliminada correctamente', {
      timeout: 3000
    });
    modalConfirmacionAbierto.value = false;
    solicitudAEliminar.value = null;
  }
};

const irACatalogo = () => {
  router.push({ name: 'admin-servicios' });
};
</script>
