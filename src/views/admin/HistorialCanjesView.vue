<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import { recompensasService } from '@/services/recompensas.service';

const historial = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const data = await recompensasService.getHistorialCanjes();
    historial.value = data.map(canje => ({
      id: canje.id,
      fecha: new Date(canje.fecha_canje).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      nombreEmpleado: canje.empleado_nombre || 'Empleado',
      recompensaTitulo: canje.recompensa_nombre || 'Recompensa',
      coste: canje.puntos_utilizados || canje.puntos_gastados || 0,
      estado: canje.estado
    }));
  } catch (error) {
    console.error("Error al cargar el historial de canjes:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Historial de Canjes</h1>
      <p class="text-on-surface-variant">Revisa todas las recompensas canjeadas por los empleados.</p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando historial...</p>
    </div>

    <Card v-else-if="historial.length > 0">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="p-4 font-semibold text-gray-600 uppercase text-xs">Fecha</th>
              <th class="p-4 font-semibold text-gray-600 uppercase text-xs">Empleado</th>
              <th class="p-4 font-semibold text-gray-600 uppercase text-xs">Recompensa</th>
              <th class="p-4 font-semibold text-gray-600 uppercase text-xs">Puntos Canjeados</th>
              <th class="p-4 font-semibold text-gray-600 uppercase text-xs">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historial" :key="item.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="p-4 text-sm text-gray-700">{{ item.fecha }}</td>
              <td class="p-4 font-medium text-gray-900">{{ item.nombreEmpleado }}</td>
              <td class="p-4 text-sm text-gray-700">{{ item.recompensaTitulo }}</td>
              <td class="p-4">
                <div class="flex items-center bg-orange-50 rounded-lg px-3 py-1.5 inline-flex">
                  <svg class="w-4 h-4 text-orange-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-sm font-bold text-orange-700">{{ item.coste.toLocaleString() }}</span>
                  <span class="text-xs text-orange-600 ml-1">pts</span>
                </div>
              </td>
              <td class="p-4">
                <span
                  :class="{
                    'bg-green-100 text-green-800': item.estado === 'utilizado',
                    'bg-yellow-100 text-yellow-800': item.estado === 'pendiente',
                    'bg-blue-100 text-blue-800': item.estado === 'procesado'
                  }"
                  class="px-3 py-1 text-xs font-medium rounded-full capitalize"
                >
                  {{ item.estado }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <div v-else class="text-center py-10 bg-surface rounded-xl">
      <p class="text-on-surface-variant">Aún no se ha canjeado ninguna recompensa.</p>
    </div>
  </div>
</template>