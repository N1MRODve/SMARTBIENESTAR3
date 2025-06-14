<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth.store';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RouterLink } from 'vue-router';

// Componentes de UI
import PageLoader from '@/components/ui/PageLoader.vue';
import Button from '@/components/ui/Button.vue';
import DataTable from '@/components/ui/DataTable.vue';

// Íconos
import { Plus } from 'lucide-vue-next';

const authStore = useAuthStore();
const adminStore = useAdminStore();

// Definimos las columnas para nuestra tabla de datos.
const columns = [
  { 
    key: 'titulo', 
    header: 'Título de la Encuesta',
    render: (row) => row.titulo
  },
  { 
    key: 'estado', 
    header: 'Estado',
    render: (row) => {
        const estadoCapitalizado = row.estado.charAt(0).toUpperCase() + row.estado.slice(1);
        let colorClasses = 'bg-gray-100 text-gray-800';
        if (row.estado === 'activa') colorClasses = 'bg-green-100 text-green-800';
        if (row.estado === 'finalizada') colorClasses = 'bg-blue-100 text-blue-800';
        if (row.estado === 'borrador') colorClasses = 'bg-yellow-100 text-yellow-800';
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClasses}">${estadoCapitalizado}</span>`;
    }
  },
  { 
    key: 'participacion', 
    header: 'Participación',
    render: (row) => `${row.respuestas_count || 0} / ${row.participantes_count || 0}`
  },
  { 
    key: 'fecha_creacion', 
    header: 'Fecha de Creación',
    render: (row) => format(new Date(row.fecha_creacion), 'PP', { locale: es })
  },
  {
    key: 'acciones',
    header: 'Acciones',
    render: (row) => {
      // Usamos una etiqueta <a> que Vue Router interceptará para navegar sin recargar la página.
      return `<a href="/admin/encuestas/${row.id}/resultados" class="btn btn-outline p-2 text-xs">Ver Resultados</a>`
    }
  }
];

// Al cargar el componente, le pedimos a la tienda que traiga las encuestas.
onMounted(() => {
  if (authStore.user?.empresa_id) {
    adminStore.loadEncuestas(authStore.user.empresa_id);
  }
});
</script>

<template>
  <div class="p-6 md:p-8 space-y-6">
    <div class="flex flex-wrap gap-4 justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Encuestas</h1>
        <p class="mt-1 text-lg text-gray-600">Crea, visualiza y gestiona las encuestas de tu empresa.</p>
      </div>
      <router-link :to="{ name: 'AdminCrearEncuesta' }">
        <Button>
          <Plus class="w-4 h-4 mr-2" />
          Crear Nueva Encuesta
        </Button>
      </router-link>
    </div>

    <div v-if="adminStore.encuestasLoading">
      <PageLoader text="Cargando encuestas..." />
    </div>
    
    <div v-else-if="adminStore.error" class="bg-red-100 text-red-700 p-4 rounded-lg">
      <p><strong>Error:</strong> {{ adminStore.error }}</p>
    </div>

    <div v-else>
      <DataTable
        :data="adminStore.encuestas"
        :columns="columns"
        title="Listado de Encuestas"
      />
    </div>
  </div>
</template>