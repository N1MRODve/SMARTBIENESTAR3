<script setup>
import { ref } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';

// --- Simulación de datos que vendrían de un servicio de analítica ---
const wellnessScore = ref(7.8);
const subScores = ref([
  { titulo: 'Salud Mental', puntuacion: 6.5 },
  { titulo: 'Carga Laboral', puntuacion: 7.1 },
  { titulo: 'Comunicación', puntuacion: 8.9 },
]);
const recomendaciones = ref([
  { 
    id: 'serv-01', 
    titulo: 'Taller de Mindfulness y Gestión del Estrés', 
    descripcion: 'Debido a la puntuación en Salud Mental, recomendamos esta sesión para dar herramientas al equipo.' 
  }
]);
</script>

<template>
  <div class="space-y-8">
    <Card>
        <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Índice de Bienestar General</h2>
        </template>
        <div class="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
            <div class="text-center">
                <p class="text-7xl font-bold text-primary">{{ wellnessScore }}</p>
                <p class="text-on-surface-variant">sobre 10</p>
            </div>
            <div class="flex-grow space-y-4">
                <div v-for="score in subScores" :key="score.titulo" class="p-3 bg-background rounded-lg">
                    <div class="flex justify-between items-center">
                        <p class="font-semibold text-on-background">{{ score.titulo }}</p>
                        <p class="text-xl font-bold text-secondary-dark">{{ score.puntuacion }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Card>

    <Card>
        <template #header>
            <h2 class="text-xl font-semibold text-on-surface">Recomendaciones Accionables</h2>
        </template>
        <div v-if="recomendaciones.length > 0" class="space-y-4">
            <div v-for="rec in recomendaciones" :key="rec.id" class="p-4 bg-primary/10 rounded-lg">
                <h3 class="font-bold text-primary-dark">{{ rec.titulo }}</h3>
                <p class="text-sm text-on-surface-variant my-2">{{ rec.descripcion }}</p>
                <div class="text-right">
                    <Button variant="primary">Ver Servicio</Button>
                </div>
            </div>
        </div>
        <p v-else class="text-on-surface-variant">No hay recomendaciones por el momento. ¡Buen trabajo!</p>
    </Card>
  </div>
</template>