<script setup>
import { ref, onMounted } from 'vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
// Asumimos que estos servicios y componentes ya existen
import { getRecompensas, addRecompensa, updateRecompensa, deleteRecompensa } from '@/services/mock/recompensas.service.js';
// import RecompensaFormModal from '@/components/admin/RecompensaFormModal.vue';

// --- Estado Reactivo ---
const recompensas = ref([]);
const isLoading = ref(true);
// const isModalVisible = ref(false);
// const recompensaSeleccionada = ref(null);

// --- Carga de Datos ---
onMounted(async () => {
  isLoading.value = true;
  try {
    recompensas.value = await getRecompensas();
  } catch (error) {
    console.error("Error al cargar las recompensas:", error);
  } finally {
    isLoading.value = false;
  }
});

// --- Lógica CRUD (Simulada) ---
const handleEdit = (recompensa) => {
  // Lógica para abrir el modal de edición
  alert(`Editando: ${recompensa.titulo}`);
};
const handleDelete = (recompensaId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta recompensa?")) {
    alert("Recompensa eliminada (simulación).");
    // Lógica para llamar a deleteRecompensa y actualizar la lista
  }
};
const handleAdd = () => {
  alert("Abriendo formulario para añadir nueva recompensa.");
};
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-on-background">Gestionar Recompensas</h1>
        <p class="text-on-surface-variant">Añade, edita o elimina las recompensas disponibles para los empleados.</p>
      </div>
      <Button @click="handleAdd" variant="primary">
        + Añadir Recompensa
      </Button>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <p>Cargando catálogo de recompensas...</p>
    </div>

    <Card v-else>
      <table class="w-full text-left">
        <thead class="border-b-2 border-surface-variant">
          <tr>
            <th class="p-4 font-semibold">Título</th>
            <th class="p-4 font-semibold">Descripción</th>
            <th class="p-4 font-semibold">Coste (Puntos)</th>
            <th class="p-4 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recompensa in recompensas" :key="recompensa.id" class="border-b border-surface-variant">
            <td class="p-4 font-medium">{{ recompensa.titulo }}</td>
            <td class="p-4 text-on-surface-variant">{{ recompensa.descripcion }}</td>
            <td class="p-4 font-bold text-primary">{{ recompensa.coste }}</td>
            <td class="p-4 flex gap-2">
              <Button @click="handleEdit(recompensa)" variant="outline">Editar</Button>
              <Button @click="handleDelete(recompensa.id)" variant="destructive">Eliminar</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
    
    </div>
</template>