<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { comunicadosService } from '@/services/comunicados.service.js';
import { notificacionesService } from '@/services/notificaciones.service';
import { useAuthStore } from '@/stores/auth.store';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const titulo = ref('');
const contenido = ref('');
const publicando = ref(false);

const handlePublicar = async () => {
  if (!titulo.value || !contenido.value) {
    toast.warning('El título y el contenido son obligatorios.');
    return;
  }

  publicando.value = true;

  try {
    const comunicado = await comunicadosService.create({
      titulo: titulo.value,
      contenido: contenido.value,
      autor_id: authStore.empleado?.id,
      fecha_publicacion: new Date().toISOString()
    });

    toast.success('¡Comunicado publicado con éxito!');

    // Notificar a los colaboradores por email
    try {
      await notificacionesService.notificarNuevoComunicado(
        authStore.empresaId,
        {
          id: comunicado?.id,
          titulo: titulo.value,
          contenido: contenido.value
        }
      );
      toast.info('Se ha notificado a los colaboradores por correo electrónico');
    } catch (notifError) {
      console.error('Error al enviar notificaciones:', notifError);
      toast.warning('El comunicado se publicó, pero hubo un problema al enviar las notificaciones');
    }

    router.push('/admin/dashboard');
  } catch (error) {
    console.error('Error al publicar comunicado:', error);
    toast.error('Error al publicar el comunicado.');
  } finally {
    publicando.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-3xl font-bold text-on-background">Crear Nuevo Comunicado</h1>
      <p class="text-on-surface-variant">Redacta y publica un anuncio para todos los colaboradores.</p>
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
          <Button type="submit" variant="primary" :disabled="publicando">
            <span v-if="publicando" class="inline-flex items-center">
              <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Publicando...
            </span>
            <span v-else>Publicar Comunicado</span>
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>