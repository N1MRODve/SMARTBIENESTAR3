<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div class="flex items-center">
        <MessageSquare class="h-5 w-5 text-gray-600 mr-2" />
        <h3 class="text-lg font-semibold text-gray-900">
          Comentarios Anónimos
        </h3>
        <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {{ comentarios.filter(c => c && c.trim()).length }} comentarios
        </span>
      </div>
      <p class="text-sm text-gray-500 mt-1">
        Feedback cualitativo de los empleados (100% anónimo)
      </p>
    </div>

    <div class="p-6">
      <!-- Empty State -->
      <div v-if="comentarios.filter(c => c && c.trim()).length === 0" class="text-center py-12">
        <MessageSquare class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h4 class="text-lg font-medium text-gray-900 mb-2">No se han recibido comentarios</h4>
        <p class="text-gray-500">
          Los empleados aún no han dejado comentarios en las preguntas de texto abierto.
        </p>
      </div>

      <!-- Comments Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="(comentario, index) in comentariosFiltrados" 
          :key="index"
          class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Quote class="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-800 leading-relaxed">
                "{{ comentario }}"
              </p>
              <div class="flex items-center mt-2 text-xs text-gray-500">
                <User class="h-3 w-3 mr-1" />
                <span>Empleado anónimo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div v-if="comentarios.filter(c => c && c.trim()).length > 0" class="mt-6 pt-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ comentarios.filter(c => c && c.trim()).length }}</p>
            <p class="text-sm text-gray-500">Comentarios Recibidos</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ promedioLongitud }}</p>
            <p class="text-sm text-gray-500">Palabras Promedio</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ porcentajeParticipacion }}%</p>
            <p class="text-sm text-gray-500">Tasa de Participación</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { MessageSquare, Quote, User } from 'lucide-vue-next';

const props = defineProps({
  comentarios: {
    type: Array,
    required: true,
    default: () => []
  },
  totalRespuestas: {
    type: Number,
    default: 0
  }
});

// Filtrar comentarios vacíos o solo con espacios
const comentariosFiltrados = computed(() => {
  return props.comentarios.filter(comentario => 
    comentario && comentario.trim() && comentario.trim() !== 'Sin comentarios adicionales por ahora.' && comentario.trim() !== 'Todo bien en general.'
  );
});

// Calcular promedio de longitud en palabras
const promedioLongitud = computed(() => {
  const comentariosConTexto = comentariosFiltrados.value;
  if (comentariosConTexto.length === 0) return 0;
  
  const totalPalabras = comentariosConTexto.reduce((total, comentario) => {
    return total + comentario.trim().split(/\s+/).length;
  }, 0);
  
  return Math.round(totalPalabras / comentariosConTexto.length);
});

// Calcular porcentaje de participación
const porcentajeParticipacion = computed(() => {
  if (props.totalRespuestas === 0) return 0;
  return Math.round((comentariosFiltrados.value.length / props.totalRespuestas) * 100);
});
</script>

<style scoped>
/* Estilos específicos para el componente de comentarios */
</style>