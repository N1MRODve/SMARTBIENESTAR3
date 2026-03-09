<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase.js';
import {
  Mail,
  User,
  Lock,
  Building2,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Heart,
  Shield,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Search,
  ExternalLink
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

// Estado
const loading = ref(false);
const validandoToken = ref(true);
const errorMsg = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const buscandoEmpresa = ref(false);

// Modo: 'invitacion' o 'autoregistro'
const modo = ref('autoregistro');

// Datos de invitacion (prellenados)
const invitacion = ref({
  empleadoId: null,
  email: '',
  nombre: '',
  empresaId: null,
  empresaNombre: '',
  departamentoId: null,
  departamentoNombre: ''
});

// Formulario
const formData = ref({
  email: '',
  nombre: '',
  password: '',
  passwordConfirm: '',
  aceptaTerminos: false,
  aceptaPrivacidad: false
});

// Empresa encontrada (para autoregistro)
const empresaEncontrada = ref(null);

// Validaciones
const passwordsMatch = computed(() => {
  return formData.value.password === formData.value.passwordConfirm;
});

const isValidCorporateEmail = computed(() => {
  if (!formData.value.email) return true;
  const domain = formData.value.email.split('@')[1]?.toLowerCase();
  const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
  return domain && !publicDomains.includes(domain);
});

const canSubmit = computed(() => {
  if (modo.value === 'invitacion') {
    return (
      formData.value.nombre.trim() &&
      formData.value.password.length >= 6 &&
      passwordsMatch.value &&
      formData.value.aceptaTerminos &&
      formData.value.aceptaPrivacidad
    );
  } else {
    return (
      formData.value.email &&
      isValidCorporateEmail.value &&
      empresaEncontrada.value &&
      formData.value.nombre.trim() &&
      formData.value.password.length >= 6 &&
      passwordsMatch.value &&
      formData.value.aceptaTerminos &&
      formData.value.aceptaPrivacidad
    );
  }
});

// Validar token al montar
onMounted(async () => {
  const token = route.query.token;

  if (token) {
    modo.value = 'invitacion';
    await validarToken(token);
  } else {
    modo.value = 'autoregistro';
    validandoToken.value = false;
  }
});

const validarToken = async (token) => {
  try {
    const { data, error } = await supabase.rpc('validar_token_invitacion', {
      p_token: token
    });

    if (error) throw error;

    const resultado = data?.[0];

    if (!resultado || !resultado.valido) {
      errorMsg.value = resultado?.mensaje || 'Token de invitación no válido';
      validandoToken.value = false;
      return;
    }

    // Token válido - prellenar datos
    invitacion.value = {
      empleadoId: resultado.empleado_id,
      email: resultado.email,
      nombre: resultado.nombre || '',
      empresaId: resultado.empresa_id,
      empresaNombre: resultado.empresa_nombre,
      departamentoId: resultado.departamento_id,
      departamentoNombre: resultado.departamento_nombre
    };

    formData.value.nombre = resultado.nombre || '';

  } catch (error) {
    console.error('Error validando token:', error);
    errorMsg.value = 'Error al validar la invitación';
  } finally {
    validandoToken.value = false;
  }
};

// Buscar empresa por dominio de email
const buscarEmpresa = async () => {
  if (!formData.value.email || !isValidCorporateEmail.value) {
    empresaEncontrada.value = null;
    return;
  }

  buscandoEmpresa.value = true;
  try {
    const { data, error } = await supabase.rpc('buscar_empresa_por_email', {
      p_email: formData.value.email
    });

    if (error) throw error;

    const resultado = data?.[0];

    if (resultado?.encontrada) {
      empresaEncontrada.value = {
        id: resultado.empresa_id,
        nombre: resultado.empresa_nombre,
        dominio: resultado.dominio
      };
    } else {
      empresaEncontrada.value = null;
    }
  } catch (error) {
    console.error('Error buscando empresa:', error);
    empresaEncontrada.value = null;
  } finally {
    buscandoEmpresa.value = false;
  }
};

// Registro
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  loading.value = true;
  errorMsg.value = '';

  try {
    if (modo.value === 'invitacion') {
      await registrarConInvitacion();
    } else {
      await registrarAutoregistro();
    }
  } catch (error) {
    console.error('Error en registro:', error);
    errorMsg.value = error.message || 'Error al completar el registro';
  } finally {
    loading.value = false;
  }
};

const registrarConInvitacion = async () => {
  const token = route.query.token;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: invitacion.value.email,
    password: formData.value.password,
    options: {
      data: {
        nombre: formData.value.nombre,
        es_admin: false
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (authError) throw authError;

  if (!authData.user) {
    throw new Error('No se pudo crear el usuario');
  }

  const { error: completeError } = await supabase.rpc('completar_registro_empleado', {
    p_token: token,
    p_auth_user_id: authData.user.id,
    p_nombre: formData.value.nombre
  });

  if (completeError) throw completeError;

  router.push('/verificacion-pendiente');
};

const registrarAutoregistro = async () => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        nombre: formData.value.nombre,
        es_admin: false
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (authError) throw authError;

  if (!authData.user) {
    throw new Error('No se pudo crear el usuario');
  }

  const { data: departamentos } = await supabase
    .from('departamentos')
    .select('id')
    .eq('empresa_id', empresaEncontrada.value.id)
    .order('nombre')
    .limit(1);

  const departamentoId = departamentos?.[0]?.id || null;

  const { error: empleadoError } = await supabase
    .from('empleados')
    .insert({
      auth_user_id: authData.user.id,
      empresa_id: empresaEncontrada.value.id,
      departamento_id: departamentoId,
      nombre: formData.value.nombre,
      email: formData.value.email,
      es_admin: false,
      estado: 'Activo',
      puntos: 0
    });

  if (empleadoError) {
    console.error('Error creando empleado:', empleadoError);
    throw new Error('No se pudo completar el registro');
  }

  router.push('/verificacion-pendiente');
};

const irARegistroEmpresa = () => {
  router.push('/register');
};

const irALogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row">

    <!-- Panel izquierdo: Branding -->
    <div class="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white flex-col justify-between p-10 relative overflow-hidden">
      <!-- Decoración de fondo -->
      <div class="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
      <div class="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

      <!-- Logo -->
      <div class="relative z-10">
        <div class="mb-12">
          <span class="text-xl font-bold tracking-tight">SMART Bienestar</span>
        </div>

        <h1 class="inline-block bg-black text-white text-3xl lg:text-4xl font-bold leading-tight mb-5 px-4 py-2 rounded-lg">
          Únete al bienestar<br>de tu equipo
        </h1>
        <p class="text-indigo-100 text-base leading-relaxed max-w-md">
          Tu empresa ya está en la plataforma. Regístrate con tu correo corporativo y comienza a participar.
        </p>
      </div>

      <!-- Features -->
      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Shield class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Tus respuestas son 100% confidenciales</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <BarChart3 class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Accede a tu dashboard de bienestar personal</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Users class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Participa en encuestas y programas de tu empresa</span>
        </div>
      </div>

      <!-- Footer -->
      <p class="relative z-10 text-xs text-indigo-200/60">
        © {{ new Date().getFullYear() }} SMART Bienestar · smartbienestar.es
      </p>
    </div>

    <!-- Panel derecho: Formulario -->
    <div class="flex-1 flex items-center justify-center bg-gray-50/80 p-6 sm:p-8 lg:p-12">

      <!-- Logo móvil -->
      <div class="lg:hidden absolute top-6 left-6">
        <span class="text-base font-bold text-gray-900">SMART Bienestar</span>
      </div>

      <div class="w-full max-w-lg mt-12 lg:mt-0">

        <!-- LOADING: Validando token -->
        <div v-if="validandoToken" class="text-center py-16">
          <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Loader2 class="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
          <p class="text-gray-500">Validando tu invitación...</p>
        </div>

        <!-- ERROR: Token inválido -->
        <div v-else-if="modo === 'invitacion' && errorMsg && !invitacion.empleadoId" class="text-center py-12">
          <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <AlertCircle class="w-8 h-8 text-red-500" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Invitación no válida</h2>
          <p class="text-gray-500 mb-8 max-w-sm mx-auto">{{ errorMsg }}</p>
          <button
            @click="irALogin"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Ir a iniciar sesión
          </button>
          <p class="text-sm text-gray-400 mt-4">
            ¿Necesitas una nueva invitación? Contacta a tu administrador.
          </p>
        </div>

        <!-- FORMULARIO DE REGISTRO -->
        <div v-else>
          <!-- Header con info de empresa (modo invitación) -->
          <div v-if="modo === 'invitacion'" class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Completa tu registro</h1>
            <p class="text-gray-500">Has sido invitado a unirte</p>

            <div class="mt-4 flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 class="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">{{ invitacion.empresaNombre }}</p>
                <p class="text-xs text-gray-500 flex items-center gap-1">
                  <Users class="w-3 h-3" />
                  {{ invitacion.departamentoNombre || 'Sin departamento asignado' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Header autoregistro -->
          <div v-else class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Únete a tu empresa</h1>
            <p class="text-gray-500">Regístrate con tu correo corporativo para comenzar</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">

            <!-- Email (readonly en invitación) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>

              <div v-if="modo === 'invitacion'" class="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm">
                <Mail class="w-4 h-4 text-gray-400 flex-shrink-0" />
                {{ invitacion.email }}
              </div>

              <div v-else>
                <div class="relative">
                  <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    v-model="formData.email"
                    type="email"
                    required
                    @blur="buscarEmpresa"
                    placeholder="tu.nombre@empresa.com"
                    class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                  />
                  <Loader2 v-if="buscandoEmpresa" class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
                  <Search v-else class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>

                <!-- Email no corporativo -->
                <div v-if="formData.email && !isValidCorporateEmail" class="mt-2 flex items-center gap-2 text-red-600 text-xs">
                  <AlertCircle class="w-3.5 h-3.5 flex-shrink-0" />
                  Solo se permiten correos corporativos
                </div>

                <!-- Empresa encontrada -->
                <div v-if="empresaEncontrada" class="mt-3 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <CheckCircle class="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p class="font-semibold text-emerald-800 text-sm">{{ empresaEncontrada.nombre }}</p>
                    <p class="text-xs text-emerald-600">Te unirás a esta empresa</p>
                  </div>
                </div>

                <!-- Empresa no encontrada -->
                <div v-if="formData.email && isValidCorporateEmail && empresaEncontrada === null && !buscandoEmpresa" class="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <p class="text-sm text-amber-800 mb-2 flex items-center gap-1.5">
                    <AlertCircle class="w-4 h-4 flex-shrink-0" />
                    No encontramos tu empresa registrada
                  </p>
                  <button
                    type="button"
                    @click="irARegistroEmpresa"
                    class="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    Registrar mi empresa
                    <ArrowRight class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre completo <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="formData.nombre"
                  type="text"
                  required
                  placeholder="Tu nombre completo"
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Contraseña -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Mínimo 6 caracteres"
                  class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar contraseña <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="formData.passwordConfirm"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  required
                  placeholder="Repite la contraseña"
                  class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
                <button type="button" @click="showPasswordConfirm = !showPasswordConfirm" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <EyeOff v-if="showPasswordConfirm" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
              <p v-if="formData.passwordConfirm && !passwordsMatch" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" />
                Las contraseñas no coinciden
              </p>
            </div>

            <!-- Consentimiento RGPD -->
            <div class="pt-3 border-t border-gray-200 space-y-3">
              <div class="flex items-start gap-3">
                <input
                  id="aceptaTerminos"
                  v-model="formData.aceptaTerminos"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="aceptaTerminos" class="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  He leído y acepto las
                  <router-link to="/aviso-legal" target="_blank" class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5">
                    Condiciones de Uso
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  <span class="text-red-400">*</span>
                </label>
              </div>

              <div class="flex items-start gap-3">
                <input
                  id="aceptaPrivacidad"
                  v-model="formData.aceptaPrivacidad"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="aceptaPrivacidad" class="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  He leído y acepto la
                  <router-link to="/politica-privacidad" target="_blank" class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5">
                    Política de Privacidad
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  y la
                  <router-link to="/politica-cookies" target="_blank" class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5">
                    Política de Cookies
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  <span class="text-red-400">*</span>
                </label>
              </div>

              <p class="text-[11px] text-gray-400 leading-relaxed pl-7">
                Responsable: DIANI ANDREÍNA ELÍAS OCHOA (S.M.A.R.T BIENESTAR) · NIF: 51.034.346-Z · Finalidad: gestión del registro y acceso a la plataforma · Base legal: ejecución del contrato y consentimiento · Derechos: acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a
                <a href="mailto:privacidad@smartbienestar.es" class="text-indigo-600 hover:text-indigo-800 underline">privacidad@smartbienestar.es</a>.
                Más info en nuestra <router-link to="/politica-privacidad" target="_blank" class="text-indigo-600 hover:text-indigo-800 underline">Política de Privacidad</router-link>.
              </p>
            </div>

            <!-- Error -->
            <div v-if="errorMsg" class="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{{ errorMsg }}</span>
            </div>

            <!-- Botón submit -->
            <button
              type="submit"
              :disabled="!canSubmit || loading"
              class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <template v-if="loading">Registrando...</template>
              <template v-else>
                Crear mi cuenta
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>
          </form>

          <!-- Links -->
          <div class="mt-8 pt-6 border-t border-gray-200 space-y-3 text-center">
            <p class="text-sm text-gray-500">
              ¿Ya tienes cuenta?
              <button @click="irALogin" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">
                Inicia sesión
              </button>
            </p>
            <p class="text-sm text-gray-500">
              ¿Tu empresa no está registrada?
              <button @click="irARegistroEmpresa" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">
                Regístrala aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
