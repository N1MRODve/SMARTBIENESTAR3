<script setup>
import { ref } from 'vue';
import { useAdminStore } from '@/stores/admin';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from 'primevue/usetoast';

// Componentes
import Button from '@/components/ui/Button.vue';
import Textarea from 'primevue/textarea';

const emit = defineEmits(['close']);

const adminStore = useAdminStore();
const authStore = useAuthStore();
const toast = useToast();

const emails = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!emails.value.trim()) {
    toast.add({ severity: 'warn', summary: 'Campo Vacío', detail: 'Por favor, introduce al menos un correo electrónico.', life: 3000 });
    return;
  }
  
  isLoading.value = true;
  
  // Convertimos el texto en un array de emails limpios
  const emailArray = emails.value
    .split(/[\n,;]+/) // Divide por nueva línea, coma o punto y coma
    .map(email => email.trim())
    .filter(email => email !== ''); // Elimina líneas vacías

  try {
    const empresaId = authStore.user?.empresa_id;
    if (!empresaId) throw new Error("No se pudo identificar la empresa del administrador.");

    const resultados = await adminStore.invitarEmpleados(empresaId, emailArray);
    
    toast.add({ severity: 'success', summary: 'Proceso Completado', detail: `Se han procesado ${emailArray.length} invitaciones.`, life: 4000 });
    
    // Cerramos el modal después de un envío exitoso
    emit('close');
  } catch (error) {
    console.error("Error al enviar invitaciones:", error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron enviar las invitaciones.', life: 4000 });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="emails-textarea" class="block text-sm font-medium text-gray-700 mb-2">
        Correos Electrónicos de los Empleados
      </label>
      <Textarea
        id="emails-textarea"
        v-model="emails"
        rows="8"
        class="w-full"
        placeholder="Pega aquí los correos, uno por línea o separados por comas."
      />
      <p class="text-xs text-gray-500 mt-1">Puedes separar los correos por comas, punto y coma, o saltos de línea.</p>
    </div>
    <div class="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" @click="$emit('close')">
        Cancelar
      </Button>
      <Button type="submit" :loading="isLoading">
        {{ isLoading ? 'Enviando...' : 'Enviar Invitaciones' }}
      </Button>
    </div>
  </form>
</template>