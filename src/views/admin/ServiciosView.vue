<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth.store';

// Componentes
import PageLoader from '@/components/ui/PageLoader.vue';
import Button from '@/components/ui/Button.vue';
import ServicioCard from '@/components/admin/ServicioCard.vue'; // <-- Importamos nuestro nuevo componente

const authStore = useAuthStore();
const adminStore = useAdminStore();

onMounted(() => {
  if (authStore.user?.empresa_id) {
    // La acción para cargar los datos ya existe, no hay que cambiarla.
    adminStore.loadServiciosContratados(authStore.user.empresa_id);
  }
});
</script>

<template>
  <div class="p-6 space-y-8">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Servicios Contratados</h1>
        <p class="mt-1 text-lg text-gray-600">Revisa el plan de bienestar de tu empresa.</p>
      </div>
      <Button :disabled="true">
        Modificar Plan
      </Button>
    </div>

    <div v-if="adminStore.serviciosContratadosLoading">
      <PageLoader text="Cargando tus servicios..." />
    </div>
    
    <div v-else-if="!adminStore.error && adminStore.serviciosContratados.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ServicioCard
          v-for="servicio in adminStore.serviciosContratados"
          :key="servicio.id"
          :servicio="servicio"
        />
      </div>
    </div>
    
    <div v-else-if="!adminStore.error" class="text-center py-16">
        <p class="text-gray-500">No tienes servicios contratados actualmente.</p>
    </div>

    <div v-else class="bg-red-100 text-red-700 p-4 rounded-lg">
      <p><strong>Error:</strong> {{ adminStore.error }}</p>
    </div>
  </div>
</template>