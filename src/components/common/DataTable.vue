<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="p-4 border-b">
      <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
    </div>

    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Cargando datos...</p>
    </div>

    <div v-else-if="!data.length" class="p-8 text-center">
      <p class="text-gray-500">No hay datos disponibles</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >
              <template v-if="column.render">
                <span
                  v-if="typeof column.render(row) === 'object'"
                  :class="['px-2 py-1 rounded-full text-xs', column.render(row).class]"
                >
                  {{ column.render(row).text }}
                </span>
                <template v-else>
                  {{ column.render(row) }}
                </template>
              </template>
              <template v-else>
                {{ row[column.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  }
});
</script>