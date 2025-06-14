<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { useToast } from 'primevue/usetoast';

// Componentes y íconos
import Button from '@/components/ui/Button.vue';
import { Mail, Lock, ActivitySquare } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    // 1. Llamamos a la acción de login y esperamos su respuesta
    const redirectPath = await authStore.login(email.value, password.value);
    
    toast.add({ severity: 'success', summary: '¡Bienvenido!', detail: 'Has iniciado sesión correctamente.', life: 3000 });

    // 2. Usamos la ruta devuelta para navegar.
    // Usamos 'replace' en lugar de 'push' para que el usuario no pueda
    // volver a la página de login con el botón "atrás" del navegador.
    router.replace(redirectPath || '/');

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    toast.add({ severity: 'error', summary: 'Error de Autenticación', detail: error.message || 'Credenciales incorrectas.', life: 5000 });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="flex justify-center mb-6">
            <ActivitySquare class="h-16 w-16 text-primary" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            SMART<span class="text-primary">Bienestar</span>
          </h1>
          <p class="text-gray-600">Plataforma de gestión del bienestar corporativo</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="email" 
                v-model="email"
                type="email" 
                class="input pl-10" 
                placeholder="correo@empresa.com" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400" />
              </div>
              <input 
                id="password" 
                v-model="password"
                type="password" 
                class="input pl-10" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <Button type="submit" :loading="loading" class="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  </div>
</template>