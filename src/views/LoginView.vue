<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { supabase } from '@/lib/supabase';
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-vue-next';

const authStore = useAuthStore();
const router = useRouter();

// Estado de la vista: 'login' | 'forgot' | 'forgot-sent'
const vista = ref('login');

// Login
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMsg = ref('');
const loading = ref(false);

// Forgot password
const forgotEmail = ref('');
const forgotError = ref('');
const forgotLoading = ref(false);

const isEmailValid = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
});

const canLogin = computed(() => {
  return isEmailValid.value && password.value.length >= 6;
});

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = async () => {
  forgotError.value = '';
  forgotLoading.value = true;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.value, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`
    });
    if (error) throw error;
    vista.value = 'forgot-sent';
  } catch (error) {
    forgotError.value = 'No pudimos enviar el correo. Verifica que el email sea correcto.';
    console.error('Error al enviar reset:', error);
  } finally {
    forgotLoading.value = false;
  }
};

const volverALogin = () => {
  vista.value = 'login';
  forgotEmail.value = '';
  forgotError.value = '';
};

const abrirForgot = () => {
  vista.value = 'forgot';
  forgotEmail.value = email.value; // Pre-llenar si ya escribió email
  errorMsg.value = '';
};
</script>

<template>
  <div class="min-h-screen flex">

    <!-- Panel izquierdo: Branding (solo desktop) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700">
      <!-- Patrón decorativo -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-300 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 flex flex-col justify-between p-12 w-full">
        <!-- Logo -->
        <span class="text-2xl font-bold text-white">SMART Bienestar</span>

        <!-- Contenido central -->
        <div class="space-y-8">
          <div>
            <h2 class="inline-block bg-black text-white text-4xl font-bold leading-tight px-4 py-2 rounded-lg">
              Mide, mejora y transforma el bienestar de tu equipo
            </h2>
            <p class="mt-4 text-lg text-indigo-100 leading-relaxed">
              La plataforma que conecta el bienestar de los colaboradores con los resultados del negocio.
            </p>
          </div>

          <!-- Features pills -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle class="h-5 w-5 text-emerald-300" />
              </div>
              <span class="text-white/90">Encuestas inteligentes con análisis automático</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle class="h-5 w-5 text-emerald-300" />
              </div>
              <span class="text-white/90">Dashboards en tiempo real para cada dimensión</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle class="h-5 w-5 text-emerald-300" />
              </div>
              <span class="text-white/90">100% confidencial y seguro para todos</span>
            </div>
          </div>
        </div>

        <!-- Footer branding -->
        <div class="text-indigo-200 text-sm">
          &copy; {{ new Date().getFullYear() }} SMART Bienestar &middot; smartbienestar.es
        </div>
      </div>
    </div>

    <!-- Panel derecho: Formularios -->
    <div class="flex-1 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
      <div class="w-full max-w-md">

        <!-- Logo mobile -->
        <div class="lg:hidden flex items-center justify-center mb-10">
          <span class="text-2xl font-bold text-gray-900">SMART Bienestar</span>
        </div>

        <!-- ==================== LOGIN ==================== -->
        <div v-if="vista === 'login'">
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
            <p class="mt-2 text-gray-500">Inicia sesión para acceder a tu panel</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  required
                  autocomplete="email"
                  placeholder="tu@empresa.com"
                  class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  @click="abrirForgot"
                  class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  required
                  autocomplete="current-password"
                  placeholder="Tu contraseña"
                  class="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeOff v-if="showPassword" class="h-5 w-5" />
                  <Eye v-else class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Error -->
            <div v-if="errorMsg" class="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-red-700">{{ errorMsg }}</p>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading || !canLogin"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
              <template v-else>
                Iniciar Sesión
                <ArrowRight class="h-5 w-5" />
              </template>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <div class="text-center">
              <p class="text-sm text-gray-500">¿Tu empresa aún no está registrada?</p>
              <button
                @click="router.push('/register')"
                type="button"
                class="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Registra tu empresa aquí
              </button>
            </div>

            <div class="text-center">
              <p class="text-sm text-gray-500">¿Te han invitado como colaborador?</p>
              <button
                @click="router.push('/unirse')"
                type="button"
                class="mt-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Únete a tu empresa
              </button>
            </div>
          </div>
        </div>

        <!-- ==================== FORGOT PASSWORD ==================== -->
        <div v-else-if="vista === 'forgot'">
          <button
            @click="volverALogin"
            type="button"
            class="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-8"
          >
            <ArrowLeft class="h-4 w-4" />
            Volver al inicio de sesión
          </button>

          <div class="mb-8">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
              <Mail class="h-7 w-7 text-indigo-600" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Recupera tu contraseña</h1>
            <p class="mt-2 text-gray-500">
              Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <form @submit.prevent="handleForgotPassword" class="space-y-5">
            <div>
              <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  v-model="forgotEmail"
                  required
                  autocomplete="email"
                  placeholder="tu@empresa.com"
                  class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
              </div>
            </div>

            <!-- Error -->
            <div v-if="forgotError" class="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-red-700">{{ forgotError }}</p>
            </div>

            <button
              type="submit"
              :disabled="forgotLoading || !forgotEmail"
              class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Loader2 v-if="forgotLoading" class="h-5 w-5 animate-spin" />
              <template v-else>
                Enviar enlace de recuperación
              </template>
            </button>
          </form>
        </div>

        <!-- ==================== FORGOT SENT ==================== -->
        <div v-else-if="vista === 'forgot-sent'" class="text-center">
          <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="h-8 w-8 text-emerald-500" />
          </div>

          <h1 class="text-2xl font-bold text-gray-900 mb-3">¡Correo enviado!</h1>
          <p class="text-gray-500 mb-2">
            Hemos enviado un enlace de recuperación a:
          </p>
          <p class="font-semibold text-gray-900 mb-6">{{ forgotEmail }}</p>

          <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-left">
            <p class="text-sm text-amber-800">
              <strong>Revisa tu bandeja de entrada</strong> y también la carpeta de spam.
              El enlace expira en 1 hora.
            </p>
          </div>

          <button
            @click="volverALogin"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            <ArrowLeft class="h-5 w-5" />
            Volver al inicio de sesión
          </button>

          <p class="mt-6 text-sm text-gray-500">
            ¿No recibiste el correo?
            <button
              @click="vista = 'forgot'"
              class="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Reenviar
            </button>
          </p>
        </div>

      </div>
    </div>

  </div>
</template>
