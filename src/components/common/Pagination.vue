<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  info: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['goToPage', 'prev', 'next']);

// Generar rango de páginas para mostrar
const pageRange = computed(() => {
  const range = [];
  const delta = 2; // Cuántas páginas mostrar a cada lado de la actual

  for (let i = Math.max(1, props.currentPage - delta); i <= Math.min(props.totalPages, props.currentPage + delta); i++) {
    range.push(i);
  }

  return range;
});

const showFirstPage = computed(() => !pageRange.value.includes(1));
const showLastPage = computed(() => !pageRange.value.includes(props.totalPages));
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
    <!-- Mobile -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="emit('prev')"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      <button
        @click="emit('next')"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </div>

    <!-- Desktop -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          <span class="font-medium">{{ info.start }}</span>
          a
          <span class="font-medium">{{ info.end }}</span>
          de
          <span class="font-medium">{{ info.total }}</span>
          resultados
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- First Page -->
          <button
            v-if="showFirstPage"
            @click="emit('goToPage', 1)"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
          >
            <ChevronsLeft class="h-5 w-5" />
          </button>

          <!-- Previous -->
          <button
            @click="emit('prev')"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'rounded-l-md': !showFirstPage }"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>

          <!-- Pages -->
          <button
            v-for="page in pageRange"
            :key="page"
            @click="emit('goToPage', page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20',
              page === currentPage
                ? 'z-10 bg-gray-900 text-white hover:bg-gray-800'
                : 'text-gray-900'
            ]"
          >
            {{ page }}
          </button>

          <!-- Next -->
          <button
            @click="emit('next')"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'rounded-r-md': !showLastPage }"
          >
            <ChevronRight class="h-5 w-5" />
          </button>

          <!-- Last Page -->
          <button
            v-if="showLastPage"
            @click="emit('goToPage', totalPages)"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
          >
            <ChevronsRight class="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
