<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Asumimos que este servicio ya existe y funciona
import { getEspecialistasSaludMental } from '@/services/mock/colaboradores.service.js';

// --- Estado Reactivo ---
const especialistas = ref([]);
const isLoading = ref(true);

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    // Obtenemos solo los colaboradores de salud mental
    especialistas.value = await getEspecialistasSaludMental();
  } catch (error) {
    console.error("Error al cargar los especialistas:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Encuentra Apoyo Profesional</h1>
      <p class="text-on-surface-variant mt-2">
        Reserva una sesión confidencial con uno de nuestros especialistas cualificados. Tu privacidad está 100% garantizada.
      </p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando especialistas...</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="especialista in especialistas" :key="especialista.id" class="text-center">
        <div class="flex flex-col items-center">
          <img :src="especialista.foto" :alt="especialista.nombre" class="w-24 h-24 rounded-full mb-4 ring-2 ring-primary/50">
          <h2 class="text-xl font-semibold text-on-surface">{{ especialista.nombre }}</h2>
          <p class="text-primary font-medium">{{ especialista.especialidad }}</p>
          <p class="text-sm text-on-surface-variant mt-2">{{ especialista.bio }}</p>
        </div>

        <template #footer>
          <router-link :to="{ name: 'empleado-reservar-sesion', params: { colaboradorId: especialista.id } }" class="w-full">
            <Button variant="primary" class="w-full">
              Ver Disponibilidad
            </Button>
          </router-link>
        </template>
      </Card>
    </div>
    
    <div v-if="!isLoading && especialistas.length === 0" class="text-center py-10">
        <p class="text-on-surface-variant">No hay especialistas disponibles en este momento.</p>
    </div>
  </div>
</template>