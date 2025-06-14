<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <div class="flex justify-center mb-6">
        <FileQuestion class="h-24 w-24 text-primary" />
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Página No Encontrada
      </h1>
      
      <p class="text-lg text-gray-600 mb-8">
        La página que estás buscando no existe o ha sido movida
      </p>
      
      <div class="space-y-4">
        <Button
          @click="router.back()"
          variant="outline"
        >
          Volver Atrás
        </Button>
        
        <Button
          @click="router.push('/')"
          class="ml-4"
        >
          Ir al Inicio
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { FileQuestion } from 'lucide-vue-next';
import Button from '../components/common/Button.vue';

const router = useRouter();
</script>