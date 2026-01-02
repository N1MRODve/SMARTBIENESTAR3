<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { empleadosService } from '@/services/empleados.service.js';
import { useAuthStore } from '@/stores/auth.store.js';

// --- Estado Reactivo ---
const especialistas = ref([]);
const isLoading = ref(true);
const authStore = useAuthStore();

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    // Obtener empleados de la empresa del usuario actual
    const empresaId = authStore.empresaId;
    if (!empresaId) {
      console.error('No se encontró empresaId');
      return;
    }

    // Filter empleados by role or specialty for mental health specialists
    const allEmpleados = await empleadosService.getAll(empresaId);
    // Filter for mental health specialists if there's a way to identify them
    especialistas.value = allEmpleados.filter(e =>
      e.puesto?.toLowerCase().includes('psicólogo') ||
      e.puesto?.toLowerCase().includes('terapeuta') ||
      e.departamentos?.nombre?.toLowerCase().includes('salud mental')
    );
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