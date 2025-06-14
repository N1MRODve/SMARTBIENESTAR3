<script setup>
import { defineProps } from 'vue';
import PageLoader from '@/components/ui/PageLoader.vue';

// --- Explicación de las Props ---
// 'title': Un título para la tabla.
// 'data': El array de objetos que queremos mostrar (ej. la lista de encuestas).
// 'columns': La configuración de las columnas. ¡Esta es la parte más potente!
//            Nos permite definir las cabeceras y cómo renderizar el dato de cada celda.
// 'loading': Un booleano para mostrar el estado de carga.
defineProps({
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
    </div>

    <div v-if="loading">
      <PageLoader text="Cargando datos de la tabla..." />
    </div>

    <div v-else-if="data.length === 0" class="p-6 text-center text-gray-500">
      <p>No hay datos disponibles para mostrar.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              scope="col" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ col.header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50 transition-colors">
            <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              <div v-html="col.render(item)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Estilos específicos para la tabla si fueran necesarios */
</style>