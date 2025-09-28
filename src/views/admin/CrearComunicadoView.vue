<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { addComunicado } from '@/services/mock/comunicados.service.js';

const router = useRouter();
const titulo = ref('');
const contenido = ref('');

const handlePublicar = async () => {
  if (!titulo.value || !contenido.value) {
    alert('El título y el contenido son obligatorios.');
    return;
  }
  await addComunicado({ titulo: titulo.value, contenido: contenido.value });
  alert('Comunicado publicado con éxito.');
  router.push('/admin/dashboard'); // Vuelve al dashboard
};
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Crear Nuevo Comunicado</h1>
      <p class="text-on-surface-variant">Redacta y publica un anuncio para todos los empleados.</p>
    </header>
    <Card>
      <form @submit.prevent="handlePublicar" class="p-6 space-y-4">
        <div>
          <label for="titulo" class="block text-sm font-medium text-on-surface-variant">Título</label>
          <input type="text" id="titulo" v-model="titulo" class="w-full mt-1 p-2 border border-outline rounded-lg bg-surface">
        </div>
        <div>
          <label for="contenido" class="block text-sm font-medium text-on-surface-variant">Contenido</label>
          <textarea id="contenido" v-model="contenido" rows="10" class="w-full mt-1 p-2 border border-outline rounded-lg bg-surface"></textarea>
        </div>
        <div class="text-right">
          <Button type="submit" variant="primary">Publicar Comunicado</Button>
        </div>
      </form>
    </Card>
  </div>
</template>