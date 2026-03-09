<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { CheckCircle, XCircle, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const status = ref('loading'); // 'loading' | 'success' | 'error'
const errorMessage = ref('');

onMounted(async () => {
  try {
    // Supabase maneja automáticamente el token en la URL cuando usa PKCE
    // Solo necesitamos verificar si hay una sesión válida
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    // Verificar si hay tokens en el hash de la URL (para flujo implícito)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Establecer sesión manualmente si hay tokens en el hash
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (setSessionError) throw setSessionError;
    }

    // Verificar si hay un código en la URL (para flujo PKCE)
    const code = route.query.code;
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    }

    // Obtener el usuario actualizado
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!user) {
      throw new Error('No se pudo verificar la sesión');
    }

    // Verificar que el email está confirmado
    if (!user.email_confirmed_at) {
      throw new Error('El email aún no ha sido verificado');
    }

    // Email verificado correctamente
    status.value = 'success';

    // Reinicializar auth store para cargar datos del empleado
    await authStore.initialize();

    // Redirigir al dashboard correspondiente después de 2 segundos
    setTimeout(() => {
      const role = authStore.userRole;
      if (['superadmin', 'soporte', 'comercial'].includes(role)) {
        router.push('/platform/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/empleado/dashboard');
      }
    }, 2000);

  } catch (error) {
    console.error('Error en callback de autenticación:', error);
    status.value = 'error';
    errorMessage.value = error.message || 'Error al verificar la cuenta';
  }
});

const irALogin = () => {
  router.push('/login');
};

const irAVerificacion = () => {
  router.push('/verificacion-pendiente');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">

      <!-- Loading State -->
      <template v-if="status === 'loading'">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 class="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Verificando tu cuenta...
        </h1>
        <p class="text-gray-600">
          Por favor espera mientras confirmamos tu email.
        </p>
      </template>

      <!-- Success State -->
      <template v-else-if="status === 'success'">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle class="w-10 h-10 text-green-600" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Cuenta verificada
        </h1>
        <p class="text-gray-600 mb-6">
          Tu email ha sido verificado correctamente. Serás redirigido al dashboard en unos segundos...
        </p>
        <div class="flex justify-center">
          <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </template>

      <!-- Error State -->
      <template v-else-if="status === 'error'">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle class="w-10 h-10 text-red-600" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Error de verificación
        </h1>
        <p class="text-gray-600 mb-6">
          {{ errorMessage }}
        </p>
        <div class="space-y-3">
          <button
            @click="irAVerificacion"
            class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Solicitar nuevo enlace
          </button>
          <button
            @click="irALogin"
            class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </template>

    </div>
  </div>
</template>
