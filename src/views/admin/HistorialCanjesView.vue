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
      <table class="w-full text-left">
        <thead class="border-b-2 border-surface-variant">
          <tr>
            <th class="p-4 font-semibold">Fecha</th>
            <th class="p-4 font-semibold">Empleado</th>
            <th class="p-4 font-semibold">Recompensa</th>
            <th class="p-4 font-semibold">Coste</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historial" :key="item.id" class="border-b border-surface-variant">
            <td class="p-4">{{ item.fecha }}</td>
            <td class="p-4 font-medium">{{ item.nombreEmpleado }}</td>
            <td class="p-4">{{ item.recompensaTitulo }}</td>
            <td class="p-4 font-bold text-primary">{{ item.coste }} Puntos</td>
          </tr>
        </tbody>
      </table>
    </Card>

    <div v-else class="text-center py-10 bg-surface rounded-xl">
      <p class="text-on-surface-variant">Aún no se ha canjeado ninguna recompensa.</p>
    </div>
  </div>
</template>