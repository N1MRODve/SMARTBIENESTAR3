<template>
  <div class="bg-white shadow-sm rounded-xl overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          Historial de Comunicados
        </h2>
        <div class="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full">
          <FileText class="h-5 w-5 text-indigo-600" />
          <span class="text-sm font-semibold text-indigo-700">
            {{ comunicados.length }} comunicado{{ comunicados.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
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

    <!-- Estado vacío -->
    <div v-if="comunicados.length === 0" class="text-center py-12">
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
import { ref } from 'vue';
import {
  FileText,
  Calendar,
  Eye,
  Copy,
  Trash2
} from 'lucide-vue-next';
import {
  comunicadosMock,
  obtenerColorEstado,
  obtenerColorInteraccion
} from '@/utils/comunicadosAvanzadosMock.js';

defineEmits(['ver-comunicado', 'duplicar-comunicado', 'eliminar-comunicado']);

const comunicados = ref(comunicadosMock);

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin enviar';
  const date = new Date(fecha + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
</script>
