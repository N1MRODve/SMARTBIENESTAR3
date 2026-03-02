<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { encuestasService } from '@/services/encuestas.service';

const encuestas = ref([]);
const isLoading = ref(false);
const router = useRouter();

const verResultados = (encuestaId) => {
  router.push(`/admin/encuestas/${encuestaId}/resultados`);
};

const cargarEncuestas = async () => {
  isLoading.value = true;
  try {
    const data = await encuestasService.getAll();
    encuestas.value = data || [];
  } catch (err) {
    encuestas.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(cargarEncuestas);
</script>

<template>
  <div class="space-y-6">
    <header class="flex justify-between items-center">
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

    <div v-else-if="encuestas.length === 0" class="text-center py-10">
      <p class="text-on-surface-variant">No hay encuestas creadas aún.</p>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="encuesta in encuestas" :key="encuesta.id">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
          <div>
            <h2 class="text-xl font-semibold text-on-surface">{{ encuesta.titulo }}</h2>
            <div class="flex items-center gap-4 mt-2 text-sm text-on-surface-variant">
              <span><strong>Estado:</strong> {{ encuesta.estado }}</span>
              <span v-if="encuesta.total_respuestas != null"><strong>Respuestas:</strong> {{ encuesta.total_respuestas }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button @click="verResultados(encuesta.id)" variant="primary">
              Ver Resultados
            </Button>
            <Button @click="router.push(`/admin/encuestas/${encuesta.id}/editar`)" variant="outline">Editar</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
