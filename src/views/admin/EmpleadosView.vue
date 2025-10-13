<template>
  <div class="p-4 md:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Empleados</h1>
      <button @click="isModalVisible = true" class="bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
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
            <th class="p-4 font-semibold">Departamento</th>
            <th class="p-4 font-semibold">Estado</th>
            <th class="p-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.id" class="border-b">
            <td class="p-4">{{ empleado.nombre }}</td>
            <td class="p-4">{{ empleado.email }}</td>
            <td class="p-4">
              <span :class="getDepartamentoBadgeClass(empleado.departamento)" class="px-3 py-1 text-sm font-medium rounded-full inline-block">
                {{ empleado.departamento || 'Sin asignar' }}
              </span>
            </td>
            <td class="p-4">
              <span :class="{
                'bg-green-100 text-green-800': empleado.estado === 'Activo',
                'bg-yellow-100 text-yellow-800': empleado.estado === 'Invitado'
              }" class="px-2 py-1 text-sm font-medium rounded-full">
                {{ empleado.estado }}
              </span>
            </td>
            <td class="p-4">
              <button @click="abrirModalEditar(empleado)" class="text-primary hover:underline">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <InvitarEmpleadosModal
      v-if="isModalVisible"
      @close="isModalVisible = false"
      @submit="handleInvitar"
    />

    <EditarEmpleadoModal
      v-if="isEditModalVisible"
      :empleado="empleadoSeleccionado"
      @close="isEditModalVisible = false"
      @submit="handleActualizarEmpleado"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEmpleados, invitarEmpleados, actualizarEmpleado } from '@/services/mock/empleados.service.js';
import InvitarEmpleadosModal from '@/components/admin/InvitarEmpleadosModal.vue';
import EditarEmpleadoModal from '@/components/admin/EditarEmpleadoModal.vue';

const empleados = ref([]);
const isLoading = ref(true);
const isModalVisible = ref(false);
const isEditModalVisible = ref(false);
const empleadoSeleccionado = ref(null);

const cargarEmpleados = async () => {
  isLoading.value = true;
  try {
    empleados.value = await getEmpleados();
  } catch (error) {
    console.error("Error al cargar los empleados:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(cargarEmpleados);

const handleInvitar = async (data) => {
  await invitarEmpleados(data.emails, data.departamento);
  isModalVisible.value = false;
  await cargarEmpleados();
};

const abrirModalEditar = (empleado) => {
  empleadoSeleccionado.value = empleado;
  isEditModalVisible.value = true;
};

const handleActualizarEmpleado = async (datosActualizados) => {
  await actualizarEmpleado(empleadoSeleccionado.value.id, datosActualizados);
  isEditModalVisible.value = false;
  await cargarEmpleados();
};

// TODO: vincular con tabla "departamentos" y campo "empleados.departamento_id" en futuras iteraciones.
const getDepartamentoBadgeClass = (departamento) => {
  const colorMap = {
    'RRHH': 'bg-purple-50 text-purple-800',
    'Ventas': 'bg-blue-50 text-blue-800',
    'Marketing': 'bg-pink-50 text-pink-800',
    'Producción': 'bg-green-50 text-green-800',
    'Atención al Cliente': 'bg-yellow-50 text-yellow-800',
    'Desarrollo': 'bg-indigo-50 text-indigo-800',
    'Finanzas': 'bg-emerald-50 text-emerald-800',
    'Operaciones': 'bg-orange-50 text-orange-800',
    'Calidad': 'bg-teal-50 text-teal-800',
    'Administración': 'bg-gray-50 text-gray-800'
  };
  return colorMap[departamento] || 'bg-gray-100 text-gray-600';
};
</script>