<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Asumimos que el store y el componente de botón están en estas rutas
import { useAuthStore } from '@/stores/auth.store.js';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  try {
    // Usamos el login del mock, asumiendo que sigue disponible
    await authStore.login(email.value, password.value);

    // Redirección basada en el rol del mock
    if (authStore.user?.role === 'administrador') {
      router.push('/admin/dashboard');
    } else {
      router.push('/empleado/dashboard');
    }
  } catch (error) {
    errorMsg.value = 'Email o contraseña incorrectos. Inténtalo de nuevo.';
    console.error("Error de login:", error);
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-md">

      <div class="text-center">
        <h1 class="text-3xl font-bold text-primary">SMART Bienestar</h1>
        <p class="mt-2 text-on-surface-variant">Inicia sesión para acceder a tu panel</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-on-surface-variant">Email</label>
          <input 
            id="email" 
            type="email" 
            v-model="email"
            required
            class="w-full px-3 py-2 mt-1 border border-outline rounded-lg focus:ring-primary focus:border-primary bg-surface"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-on-surface-variant">Contraseña</label>
          <input 
            id="password" 
            type="password" 
            v-model="password"
            required
            class="w-full px-3 py-2 mt-1 border border-outline rounded-lg focus:ring-primary focus:border-primary bg-surface"
          />
        </div>

        <div v-if="errorMsg" class="p-3 text-center text-sm text-error bg-error/10 rounded-lg">
          {{ errorMsg }}
        </div>

        <div>
          <Button type="submit" class="w-full">
            Ingresar
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>