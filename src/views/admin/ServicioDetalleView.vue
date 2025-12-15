<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { serviciosService } from '@/services/servicios.service.js';

// --- Inicialización ---
const route = useRoute();
const servicio = ref(null);
const isLoading = ref(true);

// --- Carga de Datos ---
onMounted(async () => {
  const servicioId = route.params.id; // Asume que el ID viene de la ruta
  isLoading.value = true;
  try {
    servicio.value = await serviciosService.getById(servicioId);
  } catch (error) {
    console.error("Error al cargar el servicio:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleSolicitarInfo = () => {
  // Simulación del envío de un formulario
  alert('¡Solicitud enviada con éxito! Un asesor de SMART Bienestar se pondrá en contacto contigo en breve.');
};
</script>

<template>
  <div v-if="isLoading" class="text-center py-12">
    <p>Cargando información del servicio...</p>
  </div>

  <div v-else-if="servicio" class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">{{ servicio.titulo }}</h1>
      <p class="text-on-surface-variant mt-2">Detalles del servicio y solicitud de información.</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <Card>
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Descripción del Servicio</h2>
          </template>
          <div class="prose max-w-none text-on-surface-variant">
            <p>{{ servicio.descripcion }}</p>
            <h4>Beneficios Clave</h4>
            <ul>
              <li>Reduce el estrés y la ansiedad.</li>
              <li>Mejora la concentración y el enfoque.</li>
              <li>Fomenta un ambiente de trabajo positivo.</li>
            </ul>
            <h4>Duración</h4>
            <p>Sesión de 60 minutos. Se recomienda un ciclo de 4 semanas.</p>
          </div>
        </Card>
      </div>

      <div class="lg:col-span-1">
        <Card>
          <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Solicitar más Información</h2>
          </template>
          <form @submit.prevent="handleSolicitarInfo" class="space-y-4">
            <div>
              <label for="nombre" class="block text-sm font-medium text-on-surface-variant">Tu Nombre</label>
              <input type="text" id="nombre" class="w-full mt-1 p-2 border border-outline rounded-lg bg-surface" required>
            </div>
             <div>
              <label for="email" class="block text-sm font-medium text-on-surface-variant">Tu Email</label>
              <input type="email" id="email" class="w-full mt-1 p-2 border border-outline rounded-lg bg-surface" required>
            </div>
            <div>
              <label for="mensaje" class="block text-sm font-medium text-on-surface-variant">Mensaje (opcional)</label>
              <textarea id="mensaje" rows="4" class="w-full mt-1 p-2 border border-outline rounded-lg bg-surface"></textarea>
            </div>
            <Button type="submit" variant="primary" class="w-full">
              Enviar Solicitud
            </Button>
          </form>
        </Card>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-12">
      <p class="text-on-surface-variant">No se ha podido encontrar la información del servicio.</p>
  </div>
</template>

<style scoped>
/* Estilos para mejorar la legibilidad del texto en la descripción */
.prose ul {
  list-style-position: inside;
}
.prose li {
  margin-left: 1rem;
}
</style>