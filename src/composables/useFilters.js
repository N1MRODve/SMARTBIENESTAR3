import { ref, computed } from 'vue';

export function useFilters(items, config = {}) {
  const filters = ref({});
  const searchQuery = ref('');

  // Inicializar filtros basados en config
  Object.keys(config).forEach(key => {
    filters.value[key] = '';
  });

  const filteredItems = computed(() => {
    let result = [...items.value];

    // Aplicar búsqueda general
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(item => {
        return config.searchFields?.some(field => {
          const value = getNestedProperty(item, field);
          return value?.toString().toLowerCase().includes(query);
        });
      });
    }

    // Aplicar filtros específicos
    Object.keys(filters.value).forEach(filterKey => {
      const filterValue = filters.value[filterKey];
      if (filterValue && filterValue !== '' && filterValue !== 'all') {
        result = result.filter(item => {
          const itemValue = getNestedProperty(item, filterKey);
          return itemValue === filterValue;
        });
      }
    });

    return result;
  });

  const setFilter = (filterKey, value) => {
    filters.value[filterKey] = value;
  };

  const clearFilters = () => {
    Object.keys(filters.value).forEach(key => {
      filters.value[key] = '';
    });
    searchQuery.value = '';
  };

  const activeFiltersCount = computed(() => {
    let count = searchQuery.value ? 1 : 0;
    count += Object.values(filters.value).filter(v => v && v !== '' && v !== 'all').length;
    return count;
  });

  // Helper para acceder a propiedades anidadas
  function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  return {
    filters,
    searchQuery,
    filteredItems,
    setFilter,
    clearFilters,
    activeFiltersCount
  };
}
