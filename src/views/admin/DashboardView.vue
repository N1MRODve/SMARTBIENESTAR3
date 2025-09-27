<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Asumimos que estos componentes de UI y servicios ya existen
// import ScoreGauge from '@/components/admin/ScoreGauge.vue';
// import InsightCard from '@/components/admin/InsightCard.vue';
// import { getAnalyticsSummary } from '@/services/mock/analytics.service.js';

// --- Estado Reactivo ---
// Simulación de datos que vendrían de los servicios
const wellnessScore = ref(7.8);
const insights = ref([
  { type: 'strength', text: 'Excelente comunicación interna' },
  { type: 'weakness', text: 'Niveles de estrés en aumento' }
]);
const recomendaciones = ref([
  { id: 'serv-01', titulo: 'Taller de Mindfulness y Gestión del Estrés', descripcion: 'Una sesión grupal para aprender técnicas de meditación...' }
]);
const proximasSesiones = ref([
  { id: 'ses-01', titulo: 'Clase de Yoga', inscritos: 15, total: 20 }
]);
const ultimosComentarios = ref([
  { id: 'com-01', texto: 'Agradecería más flexibilidad en los horarios.' },
  { id: 'com-02', texto: 'El nuevo proyecto tiene al equipo muy motivado.' }
]);

</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <Card class="h-full text-center">
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Índice de Bienestar</h2>
            </template>
            <p class="text-6xl font-bold text-primary py-4">{{ wellnessScore }}</p>
            <p class="text-on-surface-variant">sobre 10</p>
        </Card>
      </div>
      <div class="lg:col-span-2">
        <Card class="h-full">
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Insights Clave</h2>
            </template>
            <div class="space-y-4">
                <div v-for="insight in insights" :key="insight.text" class="p-3 bg-background rounded-lg">
                    <p :class="insight.type === 'strength' ? 'text-green-700' : 'text-red-700'">
                        {{ insight.text }}
                    </p>
                </div>
            </div>
        </Card>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Recomendaciones Accionables</h2>
            </template>
            <div v-for="rec in recomendaciones" :key="rec.id">
                <h3 class="font-bold">{{ rec.titulo }}</h3>
                <p class="text-sm text-on-surface-variant my-2">{{ rec.descripcion }}</p>
                <div class="text-right">
                    <Button variant="primary">Ver Servicio</Button>
                </div>
            </div>
        </Card>
        <Card>
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Próximas Sesiones</h2>
            </template>
             <div v-for="sesion in proximasSesiones" :key="sesion.id">
                <p>{{ sesion.titulo }} - <strong>{{ sesion.inscritos }}/{{ sesion.total }} inscritos</strong></p>
            </div>
        </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Accesos Directos</h2>
            </template>
            <div class="grid grid-cols-2 gap-4">
                <Button variant="outline" class="w-full">Crear Encuesta</Button>
                <Button variant="outline" class="w-full">Gestionar Empleados</Button>
                <Button variant="outline" class="w-full">Gestionar Recompensas</Button>
                <Button variant="outline" class="w-full">Crear Comunicado</Button>
            </div>
        </Card>
         <Card>
            <template #header>
                <h2 class="text-xl font-semibold text-on-surface">Feedback Reciente</h2>
            </template>
            <div class="space-y-2">
                <p v-for="comentario in ultimosComentarios" :key="comentario.id" class="text-sm italic text-on-surface-variant p-2 bg-background rounded-md">
                   "{{ comentario.texto }}"
                </p>
            </div>
        </Card>
    </div>
  </div>
</template>