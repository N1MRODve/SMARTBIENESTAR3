<template>
  <div class="p-4 md:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Empleados</h1>
      <button class="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
        Invitar Empleados
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando empleados...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md">
      <table class="w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 font-semibold">Nombre</th>
            <th class="p-4 font-semibold">Email</th>
            <th class="p-4 font-semibold">Estado</th>
            <th class="p-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.id" class="border-b">
            <td class="p-4">{{ empleado.nombre }}</td>
            <td class="p-4">{{ empleado.email }}</td>
            <td class="p-4">
              <span :class="{
                'bg-green-100 text-green-800': empleado.estado === 'Activo',
                'bg-yellow-100 text-yellow-800': empleado.estado === 'Invitado'
              }" class="px-2 py-1 text-sm font-medium rounded-full">
                {{ empleado.estado }}
              </span>
            </td>
            <td class="p-4">
              <button class="text-primary hover:underline">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEmpleados } from '@/services/mock/empleados.service.js';
// Importa el componente de tabla si ya tienes uno genérico
// import DataTable from '@/components/ui/DataTable.vue'; 

const empleados = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    empleados.value = await getEmpleados();
  } catch (error) {
    console.error("Error al cargar los empleados:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>