<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Mis Reservas</h1>
    
    <div class="grid gap-6">
      <!-- Reservas Activas -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Reservas Activas</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesión</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!reservas.length">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No tienes reservas activas
                </td>
              </tr>
              <tr v-for="reserva in reservas" :key="reserva.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">{{ reserva.titulo }}</td>
                <td class="px-6 py-4">{{ formatDate(reserva.fecha) }}</td>
                <td class="px-6 py-4">{{ reserva.modalidad }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(reserva.estado)" class="px-2 py-1 rounded-full text-xs">
                    {{ reserva.estado }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <button 
                    class="text-indigo-600 hover:text-indigo-900"
                    @click="verDetalles(reserva.id)"
                  >
                    Ver detalles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Historial de Reservas -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Historial de Reservas</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesión</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!historial.length">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No hay historial de reservas
                </td>
              </tr>
              <tr v-for="reserva in historial" :key="reserva.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">{{ reserva.titulo }}</td>
                <td class="px-6 py-4">{{ formatDate(reserva.fecha) }}</td>
                <td class="px-6 py-4">{{ reserva.modalidad }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(reserva.estado)" class="px-2 py-1 rounded-full text-xs">
                    {{ reserva.estado }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <span v-if="reserva.calificacion" class="text-yellow-400">
                      ★ {{ reserva.calificacion }}
                    </span>
                    <button 
                      v-else
                      class="text-indigo-600 hover:text-indigo-900"
                      @click="calificar(reserva.id)"
                    >
                      Calificar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const reservas = ref([]);
const historial = ref([]);

// Funciones auxiliares
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  const classes = {
    'confirmada': 'bg-green-100 text-green-800',
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'cancelada': 'bg-red-100 text-red-800',
    'completada': 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Acciones
const verDetalles = (id) => {
  router.push(`/empleado/reservas/${id}`);
};

const calificar = (id) => {
  // Implementar lógica para calificar
  console.log('Calificar reserva:', id);
};

// Cargar datos
onMounted(async () => {
  try {
    // Aquí implementar la carga de datos desde la API
    reservas.value = [];
    historial.value = [];
  } catch (error) {
    console.error('Error al cargar las reservas:', error);
  }
});
</script>