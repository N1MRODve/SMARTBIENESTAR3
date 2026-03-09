<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase.js';
import { useAuthStore } from '@/stores/auth.store.js';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const resending = ref(false);
const message = ref('');
const messageType = ref(''); // 'success' | 'error'

// Obtener email del usuario actual (puede estar en sesión aunque no verificado)
const userEmail = ref('');

const init = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    userEmail.value = user.email || '';

    // Si ya está verificado, redirigir
    if (user.email_confirmed_at) {
      await authStore.initialize();
      const role = authStore.userRole;
      if (['superadmin', 'soporte', 'comercial'].includes(role)) {
        router.push('/platform/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/empleado/dashboard');
      }
    }
  }
};

init();

const verificarEstado = async () => {
  loading.value = true;
  message.value = '';

  try {
    // Refrescar la sesión para obtener el estado actualizado
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (user?.email_confirmed_at) {
      message.value = 'Cuenta verificada correctamente. Redirigiendo...';
      messageType.value = 'success';

      // Reinicializar auth store y redirigir
      await authStore.initialize();

      setTimeout(() => {
        const role = authStore.userRole;
        if (['superadmin', 'soporte', 'comercial'].includes(role)) {
          router.push('/platform/dashboard');
        } else if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/empleado/dashboard');
        }
      }, 1500);
    } else {
      message.value = 'Tu cuenta aún no ha sido verificada. Revisa tu bandeja de entrada.';
      messageType.value = 'error';
    }
  } catch (error) {
    console.error('Error verificando estado:', error);
    message.value = 'Error al verificar el estado de la cuenta.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const reenviarEmail = async () => {
  resending.value = true;
  message.value = '';

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: userEmail.value,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;

    message.value = 'Email de verificación reenviado. Revisa tu bandeja de entrada.';
    messageType.value = 'success';
  } catch (error) {
    console.error('Error reenviando email:', error);
    message.value = 'Error al reenviar el email. Intenta de nuevo más tarde.';
    messageType.value = 'error';
  } finally {
    resending.value = false;
  }
};

const cerrarSesion = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <!-- Icon -->
      <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail class="w-10 h-10 text-blue-600" />
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Verifica tu correo electrónico
      </h1>

      <p class="text-gray-600 mb-6">
        Hemos enviado un enlace de verificación a
        <strong class="text-gray-900">{{ userEmail }}</strong>.
        Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
      </p>

      <!-- Message Alert -->
      <div
        v-if="message"
        :class="[
          'mb-6 p-4 rounded-lg flex items-center gap-3',
          messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        ]"
      >
        <CheckCircle v-if="messageType === 'success'" class="w-5 h-5 flex-shrink-0" />
        <AlertCircle v-else class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm">{{ message }}</span>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <button
          @click="verificarEstado"
          :disabled="loading"
          class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw v-if="loading" class="w-5 h-5 animate-spin" />
          <span>{{ loading ? 'Verificando...' : 'Ya verifiqué mi cuenta' }}</span>
        </button>

        <button
          @click="reenviarEmail"
          :disabled="resending"
          class="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {{ resending ? 'Reenviando...' : 'Reenviar email de verificación' }}
        </button>
      </div>

      <!-- Tips -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-500 mb-4">
          ¿No encuentras el email? Revisa tu carpeta de spam o correo no deseado.
        </p>

        <button
          @click="cerrarSesion"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Usar otro correo electrónico
        </button>
      </div>
    </div>
  </div>
</template>
