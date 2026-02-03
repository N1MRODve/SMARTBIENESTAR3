<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = async () => {
  errorMsg.value = '';
  try {
    await authStore.login(email.value, password.value);

    // Verificar si necesita onboarding
    if (authStore.isAdmin && authStore.empresaId) {
      const { data: empresa } = await supabase
        .from('empresas')
        .select('onboarding_completado')
        .eq('id', authStore.empresaId)
        .maybeSingle();

      if (empresa && !empresa.onboarding_completado) {
        router.push('/admin/onboarding');
        return;
      }
    }

    // Redirección basada en el rol
    const role = authStore.userRole;
    if (['superadmin', 'soporte', 'comercial'].includes(role)) {
      router.push('/platform/dashboard');
    } else if (role === 'admin') {
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

      <div class="mt-6 pt-6 border-t border-outline/30 space-y-4">
        <!-- Register -->
        <div class="text-center">
          <p class="text-sm text-on-surface-variant">
            ¿Tu empresa aún no está registrada?
          </p>
          <button
            @click="router.push('/register')"
            type="button"
            class="mt-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Registra tu empresa aquí
          </button>
        </div>
      </div>
    </div>
  </div>
</template>