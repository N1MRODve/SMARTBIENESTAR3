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

    // Si es modo demo, ir directo al dashboard
    if (authStore.isDemoMode) {
      router.push('/admin/dashboard');
      return;
    }

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
    if (authStore.userRole === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/empleado/dashboard');
    }
  } catch (error) {
    errorMsg.value = 'Email o contraseña incorrectos. Inténtalo de nuevo.';
    console.error("Error de login:", error);
  }
};

const handleDemoAccess = async () => {
  errorMsg.value = '';
  try {
    await authStore.login('demo@fitcorp.com', 'demo');
    router.push('/admin/dashboard');
  } catch (error) {
    errorMsg.value = 'Error al acceder al modo demo. Inténtalo de nuevo.';
    console.error("Error de demo:", error);
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
        <!-- Demo Access -->
        <div class="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
          <div class="flex items-center justify-center gap-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <h3 class="text-sm font-bold text-gray-900">Demo Sector Deportivo</h3>
          </div>
          <p class="text-xs text-gray-700 text-center mb-3">
            Explora la plataforma con datos de <span class="font-semibold">FitCorp High Performance</span>
          </p>
          <button
            @click="handleDemoAccess"
            type="button"
            class="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
            Acceder a Demo FitCorp
          </button>
          <div class="mt-3 flex items-center justify-center gap-4 text-xs text-gray-600">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <polyline points="16 11 18 13 22 9"/>
              </svg>
              Sin registro
            </span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Datos seguros
            </span>
          </div>
        </div>

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