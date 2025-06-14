<script setup>
import { onMounted, computed, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth.store';

// Componentes de UI y PrimeVue
import PageLoader from '@/components/ui/PageLoader.vue';
import Button from '@/components/ui/Button.vue';
import DataTable from '@/components/ui/DataTable.vue';
import StatsCard from '@/components/ui/StatsCard.vue';
import Dialog from 'primevue/dialog';
import InvitarEmpleadosModal from '@/components/admin/InvitarEmpleadosModal.vue';

// Íconos
import { Users, UserCheck, UserX, Plus } from 'lucide-vue-next';

const authStore = useAuthStore();
const adminStore = useAdminStore();

// State para controlar la visibilidad del modal
const isInviteModalVisible = ref(false);

const statsCards = computed(() => {
  const total = adminStore.empleados.length;
  const activos = adminStore.empleados.filter(e => e.activo).length;
  return [
    { title: "Total Empleados", value: total, icon: Users, bgColorClass: 'bg-blue-100', colorClass: 'text-blue-600' },
    { title: "Empleados Activos", value: activos, icon: UserCheck, bgColorClass: 'bg-green-100', colorClass: 'text-green-600' },
    { title: "Empleados Inactivos", value: total - activos, icon: UserX, bgColorClass: 'bg-gray-200', colorClass: 'text-gray-700' },
  ];
});

const columns = [
  { key: 'nombre', header: 'Nombre', render: (row) => `${row.nombre} ${row.apellido || ''}` },
  { key: 'email', header: 'Email', render: (row) => `<a href="mailto:${row.email}" class="text-primary hover:underline">${row.email}</a>` },
  { key: 'cargo', header: 'Cargo', render: (row) => row.cargo || 'No especificado' },
  { key: 'departamento', header: 'Departamento', render: (row) => row.departamento || 'No especificado' },
  {
    key: 'estado',
    header: 'Estado',
    render: (row) => {
      const estado = row.activo ? 'Activo' : 'Inactivo';
      const colorClasses = row.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
      return `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClasses}">${estado}</span>`;
    }
  }
];

onMounted(() => {
  if (authStore.user?.empresa_id) {
    adminStore.loadEmpleados(authStore.user.empresa_id);
  }
});
</script>

<template>
  <div class="p-6 md:p-8 space-y-8">
    <div class="flex flex-wrap gap-4 justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
        <p class="mt-1 text-lg text-gray-600">Visualiza, gestiona e invita a los miembros de tu equipo.</p>
      </div>
      <Button @click="isInviteModalVisible = true">
        <Plus class="w-4 h-4 mr-2" />
        Invitar Empleados
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        v-for="card in statsCards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :bgColorClass="card.bgColorClass"
        :colorClass="card.colorClass"
      />
    </div>

    <div v-if="adminStore.empleadosLoading">
        <PageLoader text="Cargando empleados..." />
    </div>
    <div v-else-if="adminStore.error">
        <p class="bg-red-100 text-red-700 p-4 rounded-lg">Error: {{ adminStore.error }}</p>
    </div>
    <DataTable
      v-else
      :data="adminStore.empleados"
      :columns="columns"
      title="Listado de Empleados"
    />

    <Dialog 
      v-model:visible="isInviteModalVisible" 
      modal 
      header="Invitar Nuevos Empleados" 
      :style="{ width: '40rem' }"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <InvitarEmpleadosModal @close="isInviteModalVisible = false" />
    </Dialog>
  </div>
</template>