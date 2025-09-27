<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start">
      <!-- Icono -->
      <div class="flex-shrink-0 mr-4">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Megaphone class="h-5 w-5 text-white" />
        </div>
      </div>
      
      <!-- Contenido -->
      <div class="flex-1 min-w-0">
        <!-- Título -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ comunicado.titulo }}
        </h3>
        
        <!-- Fecha -->
        <div class="flex items-center text-sm text-gray-500 mb-3">
          <Calendar class="h-4 w-4 mr-1" />
          <span>{{ fechaFormateada }}</span>
          <span class="mx-2">•</span>
          <Clock class="h-4 w-4 mr-1" />
          <span>{{ tiempoTranscurrido }}</span>
        </div>
        
        <!-- Contenido -->
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ comunicado.contenido }}
          </p>
        </div>
        
        <!-- Badge de nuevo (si es reciente) -->
        <div v-if="esReciente" class="mt-4">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
            Nuevo
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Megaphone, Calendar, Clock } from 'lucide-vue-next';

const props = defineProps({
  comunicado: {
    type: Object,
    required: true,
    validator: (comunicado) => {
      return comunicado && 
             typeof comunicado.titulo === 'string' && 
             typeof comunicado.contenido === 'string' && 
             comunicado.fechaCreacion;
    }
  }
});

// Computed properties
const fechaFormateada = computed(() => {
  return new Date(props.comunicado.fechaCreacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const tiempoTranscurrido = computed(() => {
  const ahora = new Date();
  const fechaComunicado = new Date(props.comunicado.fechaCreacion);
  const diferencia = ahora - fechaComunicado;
  
  const minutos = Math.floor(diferencia / (1000 * 60));
  const horas = Math.floor(diferencia / (1000 * 60 * 60));
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  
  if (minutos < 60) {
    return minutos <= 1 ? 'Hace un momento' : `Hace ${minutos} minutos`;
  } else if (horas < 24) {
    return horas === 1 ? 'Hace 1 hora' : `Hace ${horas} horas`;
  } else if (dias < 7) {
    return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
  } else {
    return fechaFormateada.value;
  }
});

const esReciente = computed(() => {
  const ahora = new Date();
  const fechaComunicado = new Date(props.comunicado.fechaCreacion);
  const diferencia = ahora - fechaComunicado;
  const horas = diferencia / (1000 * 60 * 60);
  
  // Considerar "reciente" si fue publicado en las últimas 24 horas
  return horas < 24;
});
</script>

<style scoped>
.prose p {
  margin-bottom: 0;
}
</style>