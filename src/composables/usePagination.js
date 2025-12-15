import { ref, computed } from 'vue';

export function usePagination(items, itemsPerPageDefault = 25) {
  const currentPage = ref(1);
  const itemsPerPage = ref(itemsPerPageDefault);

  const totalPages = computed(() => {
    return Math.ceil(items.value.length / itemsPerPage.value);
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return items.value.slice(start, end);
  });

  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const setItemsPerPage = (count) => {
    itemsPerPage.value = count;
    currentPage.value = 1; // Reset to first page
  };

  const resetPagination = () => {
    currentPage.value = 1;
  };

  // Info útil para mostrar en la UI
  const paginationInfo = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value + 1;
    const end = Math.min(currentPage.value * itemsPerPage.value, items.value.length);
    return {
      start,
      end,
      total: items.value.length,
      currentPage: currentPage.value,
      totalPages: totalPages.value
    };
  });

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
    setItemsPerPage,
    resetPagination,
    paginationInfo
  };
}
