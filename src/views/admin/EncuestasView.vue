<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { getEncuestas } from '@/services/mock/encuestas.service.js';

// --- Inicialización ---
const encuestas = ref([]);
const isLoading = ref(true);
const router = useRouter();

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    encuestas.value = await getEncuestas();
  } catch (error) {
    console.error("Error al cargar las encuestas:", error);
  } finally {
    isLoading.value = false;
  }
});

const verResultados = (encuestaId) => {
  // Usamos el nombre de la ruta que definimos para una navegación más robusta
  router.push({ name: 'admin-encuesta-resultados', params: { encuestaId: encuestaId } });
};
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-on-background">Gestión de Encuestas</h1>
        <p class="text-on-surface-variant">Crea, gestiona y analiza todas las encuestas de tu organización.</p>
      </div>
      <Button @click="router.push('/admin/encuestas/crear')" variant="primary">
        Crear Nueva Encuesta
      </Button>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando encuestas...</p>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="encuesta in encuestas" :key="encuesta.id">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <div>
            <h2 class="text-xl font-semibold text-on-surface">{{ encuesta.titulo }}</h2>
            <div class="flex items-center gap-4 mt-2 text-sm text-on-surface-variant">
              <span><strong>Estado:</strong> {{ encuesta.estado }}</span>
              <span><strong>Participantes:</strong> {{ encuesta.totalParticipantes }}</span>
              <span class="font-bold text-primary">Tasa de Participación: {{ encuesta.tasaParticipacion }}</span>
            </div>
          </div>
          <div class="flex gap-2 self-end md:self-center">
            <Button @click="verResultados(encuesta.id)" variant="primary" :disabled="encuesta.estado === 'Borrador'">
              Ver Resultados
            </Button>
            <Button variant="outline">Editar</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>