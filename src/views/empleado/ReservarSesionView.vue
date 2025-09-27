<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getColaboradorInfo, getDisponibilidad } from '@/services/mock/colaboradores.service.js';
import { useReservasStore } from '@/stores/reservas.store.js';

const route = useRoute();
const router = useRouter();
const reservasStore = useReservasStore();
// Simulación del ID de usuario
const usuarioIdDemo = 'user-empleado-01';
const colaborador = ref(null);
const disponibilidad = ref([]);
const isLoading = ref(true);

// Agrupa los huecos por fecha para una mejor visualización
const disponibilidadAgrupada = computed(() => {
  return disponibilidad.value.reduce((acc, slot) => {
    if (!acc[slot.fecha]) {
      acc[slot.fecha] = [];
    }
    acc[slot.fecha].push(slot);
    return acc;
  }, {});
});

onMounted(async () => {
  const colaboradorId = route.params.colaboradorId;
  isLoading.value = true;
  try {
    // Obtenemos la info del colaborador y su disponibilidad en paralelo
    const [info, slots] = await Promise.all([
      getColaboradorInfo(colaboradorId),
      getDisponibilidad(colaboradorId)
    ]);
    colaborador.value = info;
    disponibilidad.value = slots;
  } catch (error) {
    console.error("Error al cargar la disponibilidad:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleReservarClick = async (slot) => {
  const sesionInfo = {
    id: slot.id,
    titulo: `Sesión con ${colaborador.value.nombre}`,
    fecha: slot.fecha,
    hora: slot.hora,
    especialista: colaborador.value.nombre
  };

  const confirmacion = confirm(`¿Confirmas tu reserva para el ${sesionInfo.fecha} a las ${sesionInfo.hora}?`);

  if (confirmacion) {
    await reservasStore.crearReserva(usuarioIdDemo, sesionInfo);
    slot.disponible = false; // Actualiza la UI localmente
    alert('¡Tu sesión ha sido reservada con éxito!');
    router.push('/empleado/dashboard'); // Redirige al dashboard
  }
};
</script>

<template>
  <div class="space-y-8">
    <div v-if="isLoading" class="text-center py-12">
      <p>Cargando disponibilidad...</p>
    </div>

    <div v-else-if="colaborador">
      <div class="flex items-center mb-8">
        <img :src="colaborador.foto" :alt="colaborador.nombre" class="w-24 h-24 rounded-full mr-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Reservar sesión con</h1>
          <h2 class="text-2xl text-primary">{{ colaborador.nombre }}</h2>
          <p class="text-gray-600">{{ colaborador.especialidad }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div v-for="(slots, fecha) in disponibilidadAgrupada" :key="fecha">
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
            {{ new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) }}
          </h3>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <button 
              v-for="slot in slots" 
              :key="slot.id"
              @click="handleReservarClick(slot)"
              :disabled="!slot.disponible"
              class="p-2 border rounded-md text-center font-medium transition-colors duration-200"
              :class="{
                'border-primary text-primary hover:bg-primary hover:text-white': slot.disponible,
                'bg-gray-200 text-gray-400 cursor-not-allowed': !slot.disponible
              }">
              {{ slot.hora }}
            </button>
          </div>
        </div>
         <div v-if="Object.keys(disponibilidadAgrupada).length === 0" class="text-center py-10 bg-gray-50 rounded-lg">
            <p class="text-gray-600">Este especialista no tiene huecos disponibles en los próximos 7 días.</p>
         </div>
      </div>
    </div>
  </div>
</template>