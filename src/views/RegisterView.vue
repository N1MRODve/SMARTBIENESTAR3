<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store.js';
import { supabase } from '@/lib/supabase.js';
import {
  FileText, X, ExternalLink, Heart, Building2, Globe, Phone, MapPin, Users, Briefcase,
  Mail, User, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, ArrowRight, Shield,
  BarChart3, CheckCircle, ChevronRight
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

// Datos de la empresa
const razonSocial = ref('');
const ruc = ref('');
const telefono = ref('');
const direccion = ref('');
const pais = ref('');
const ciudad = ref('');
const industria = ref('');
const numEmpleados = ref('');
const sitioWeb = ref('');

// Datos del administrador
const adminNombre = ref('');
const adminEmail = ref('');
const adminPassword = ref('');
const adminPasswordConfirm = ref('');

// UI
const errorMsg = ref('');
const loading = ref(false);
const currentStep = ref(1);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// Aceptación legal
const aceptaContrato = ref(false);
const aceptaPrivacidad = ref(false);
const showContratoModal = ref(false);

// Validaciones
const passwordsMatch = computed(() => {
  return adminPassword.value === adminPasswordConfirm.value;
});

const isValidCorporateEmail = computed(() => {
  if (!adminEmail.value) return true;
  const domain = adminEmail.value.split('@')[1]?.toLowerCase();
  const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'live.com'];
  return domain && !publicDomains.includes(domain);
});

const emailDomain = computed(() => {
  if (!adminEmail.value) return '';
  return adminEmail.value.split('@')[1]?.toLowerCase() || '';
});

const canProceedStep1 = computed(() => {
  return razonSocial.value &&
         adminEmail.value &&
         isValidCorporateEmail.value;
});

const canProceedStep2 = computed(() => {
  return adminNombre.value &&
         adminPassword.value &&
         adminPasswordConfirm.value &&
         passwordsMatch.value &&
         aceptaContrato.value &&
         aceptaPrivacidad.value;
});

const nextStep = () => {
  if (currentStep.value === 1 && canProceedStep1.value) {
    currentStep.value = 2;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleRegister = async () => {
  errorMsg.value = '';

  if (!canProceedStep2.value) {
    errorMsg.value = 'Por favor completa todos los campos requeridos';
    return;
  }

  loading.value = true;

  try {
    // 1. Verificar si ya existe una empresa con este dominio
    const { data: empresaExistente, error: checkError } = await supabase
      .from('empresas')
      .select('id')
      .eq('dominio', emailDomain.value)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (empresaExistente) {
      throw new Error('Ya existe una empresa con este dominio. Un compañero de tu empresa debe invitarte.');
    }

    // 2. Crear empresa PRIMERO (antes del usuario)
    const { data: empresaData, error: empresaError } = await supabase.rpc('crear_empresa_completa', {
      p_email: adminEmail.value,
      p_razon_social: razonSocial.value,
      p_dominio: emailDomain.value,
      p_ruc: ruc.value || null,
      p_telefono: telefono.value || null,
      p_direccion: direccion.value || null,
      p_pais: pais.value || null,
      p_ciudad: ciudad.value || null,
      p_industria: industria.value || null,
      p_num_empleados: numEmpleados.value ? parseInt(numEmpleados.value) : null,
      p_sitio_web: sitioWeb.value || null,
      p_admin_user_id: null
    });

    if (empresaError) throw empresaError;

    // 3. Ahora crear el usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail.value,
      password: adminPassword.value,
      options: {
        data: {
          nombre: adminNombre.value,
          es_admin: true
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario');
    }

    // 4. Actualizar empresa con admin_user_id
    const { error: updateEmpresaError } = await supabase
      .from('empresas')
      .update({ admin_user_id: authData.user.id })
      .eq('dominio', emailDomain.value);

    if (updateEmpresaError) {
      console.warn('No se pudo actualizar admin_user_id:', updateEmpresaError);
    }

    // 5. Obtener departamento
    const { data: departamentos } = await supabase
      .from('departamentos')
      .select('id')
      .eq('empresa_id', empresaData)
      .order('nombre')
      .limit(1);

    const departamentoId = departamentos && departamentos.length > 0 ? departamentos[0].id : null;

    // 6. Crear empleado manualmente
    const { error: empleadoError } = await supabase
      .from('empleados')
      .insert({
        auth_user_id: authData.user.id,
        empresa_id: empresaData,
        nombre: adminNombre.value,
        email: adminEmail.value,
        departamento_id: departamentoId,
        cargo: 'Administrador',
        es_admin: true,
        estado: 'Activo',
        puntos: 0
      });

    if (empleadoError) {
      console.error('Error al crear empleado:', empleadoError);
      throw new Error('No se pudo crear el perfil del colaborador');
    }

    // 7. Redirigir a verificación pendiente
    router.push('/verificacion-pendiente');

  } catch (error) {
    console.error('Error en el registro:', error);

    if (error.message?.includes('correos corporativos')) {
      errorMsg.value = 'Solo se permiten correos corporativos. No uses Gmail, Yahoo, Hotmail, etc.';
    } else if (error.message?.includes('User already registered')) {
      errorMsg.value = 'Este correo ya está registrado. Intenta iniciar sesión.';
    } else if (error.message?.includes('Ya existe una empresa')) {
      errorMsg.value = 'Ya existe una empresa con este dominio. Un compañero de tu empresa debe invitarte.';
    } else if (error.message?.includes('Database error')) {
      errorMsg.value = 'Error en la base de datos. Por favor verifica tus datos e intenta de nuevo.';
    } else {
      errorMsg.value = error.message || 'Error al registrar. Por favor intenta de nuevo.';
    }
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goToUnirse = () => {
  router.push('/unirse');
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
          Registra tu empresa<br>y transforma el bienestar
        </h1>
        <p class="text-indigo-100 text-base leading-relaxed max-w-md">
          Únete a las empresas que ya miden, mejoran y transforman el bienestar de sus equipos.
        </p>
      </div>

      <!-- Features -->
      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <BarChart3 class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Dashboards en tiempo real con IA</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Shield class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">100% confidencial y seguro para todos</span>
        </div>
        <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
          <Users class="w-5 h-5 text-indigo-200 flex-shrink-0" />
          <span class="text-sm text-indigo-50">Encuestas inteligentes con análisis automático</span>
        </div>
      </div>

      <!-- Footer -->
      <p class="relative z-10 text-xs text-indigo-200/60">
        © {{ new Date().getFullYear() }} SMART Bienestar · smartbienestar.es
      </p>
    </div>

    <!-- Panel derecho: Formulario -->
    <div class="flex-1 flex flex-col bg-gray-50/80 overflow-y-auto">

      <!-- Logo móvil -->
      <div class="lg:hidden p-6 pb-0">
        <span class="text-base font-bold text-gray-900">SMART Bienestar</span>
      </div>

      <div class="flex-1 flex items-start justify-center p-6 sm:p-8 lg:p-12 lg:pt-8">
        <div class="w-full max-w-xl">

          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Registra tu Empresa</h1>
            <p class="text-gray-500 text-sm">Comienza a mejorar el bienestar de tu equipo</p>
          </div>

          <!-- Progress Steps -->
          <div class="flex items-center gap-3 mb-8">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              ]">1</div>
              <span :class="['text-sm font-medium hidden sm:inline', currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400']">
                Empresa
              </span>
            </div>
            <div class="flex-1 h-0.5 bg-gray-200 rounded">
              <div :class="['h-full bg-indigo-600 rounded transition-all duration-300', currentStep >= 2 ? 'w-full' : 'w-0']"></div>
            </div>
            <div class="flex items-center gap-2">
              <div :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              ]">2</div>
              <span :class="['text-sm font-medium hidden sm:inline', currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400']">
                Administrador
              </span>
            </div>
          </div>

          <!-- Step 1: Información de la Empresa -->
          <div v-show="currentStep === 1" class="space-y-5">
            <!-- Razón Social -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Razón Social <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <Building2 class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="razonSocial"
                  type="text"
                  required
                  placeholder="Ej: Empresa Europea S.L."
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Email corporativo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Email Corporativo del Administrador <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="adminEmail"
                  type="email"
                  required
                  placeholder="admin@tuempresa.com"
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
              <p v-if="!isValidCorporateEmail && adminEmail" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" />
                Solo se permiten correos corporativos
              </p>
              <p v-if="isValidCorporateEmail && adminEmail" class="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5" />
                Dominio: {{ emailDomain }}
              </p>
            </div>

            <!-- CIF/NIF + Teléfono -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">CIF / NIF</label>
                <input
                  v-model="ruc"
                  type="text"
                  placeholder="Ej: B12345678"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                <div class="relative">
                  <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    v-model="telefono"
                    type="tel"
                    placeholder="+34 612 345 678"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
              <div class="relative">
                <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="direccion"
                  type="text"
                  placeholder="Ej: Calle Gran Vía 28, 28013"
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            <!-- País + Ciudad -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">País</label>
                <input
                  v-model="pais"
                  type="text"
                  placeholder="Ej: España"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                <input
                  v-model="ciudad"
                  type="text"
                  placeholder="Ej: Madrid"
                  class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Industria + Colaboradores -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Industria / Sector</label>
                <div class="relative">
                  <Briefcase class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    v-model="industria"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none appearance-none"
                  >
                    <option value="">Selecciona</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Salud">Salud</option>
                    <option value="Educación">Educación</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufactura">Manufactura</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nº Colaboradores</label>
                <div class="relative">
                  <Users class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    v-model="numEmpleados"
                    class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none appearance-none"
                  >
                    <option value="">Selecciona</option>
                    <option value="35">20-50</option>
                    <option value="75">51-100</option>
                    <option value="175">101-250</option>
                    <option value="375">251-500</option>
                    <option value="750">501-1000</option>
                    <option value="2000">1000+</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Sitio Web -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Sitio Web</label>
              <div class="relative">
                <Globe class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="sitioWeb"
                  type="url"
                  placeholder="https://www.tuempresa.com"
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Step 2: Datos del Administrador -->
          <div v-show="currentStep === 2" class="space-y-5">
            <!-- Info box -->
            <div class="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <Building2 class="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p class="text-sm text-indigo-800">
                Estás creando la cuenta de administrador para <strong>{{ razonSocial }}</strong>. Tendrás acceso completo a la plataforma.
              </p>
            </div>

            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre Completo <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="adminNombre"
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Email (readonly) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Email Corporativo</label>
              <div class="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm">
                <Mail class="w-4 h-4 text-gray-400 flex-shrink-0" />
                {{ adminEmail }}
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
                  v-model="adminPassword"
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

            <!-- Confirmar Contraseña -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">
                Confirmar Contraseña <span class="text-red-400">*</span>
              </label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  v-model="adminPasswordConfirm"
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
              <p v-if="adminPasswordConfirm && !passwordsMatch" class="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" />
                Las contraseñas no coinciden
              </p>
            </div>

            <!-- Aceptación Legal RGPD -->
            <div class="pt-4 border-t border-gray-200 space-y-3">
              <h3 class="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText class="w-4 h-4 text-indigo-600" />
                Consentimiento y condiciones legales
              </h3>

              <div class="flex items-start gap-3">
                <input
                  id="aceptaContrato"
                  v-model="aceptaContrato"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="aceptaContrato" class="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  He leído y acepto el
                  <button
                    type="button"
                    @click="showContratoModal = true"
                    class="text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    Contrato de Licencia de Uso
                  </button>
                  y las
                  <router-link
                    to="/aviso-legal"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5"
                  >
                    Condiciones de Uso
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  <span class="text-red-400">*</span>
                </label>
              </div>

              <div class="flex items-start gap-3">
                <input
                  id="aceptaPrivacidad"
                  v-model="aceptaPrivacidad"
                  type="checkbox"
                  class="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label for="aceptaPrivacidad" class="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  He leído y acepto la
                  <router-link
                    to="/politica-privacidad"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5"
                  >
                    Política de Privacidad
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  y la
                  <router-link
                    to="/politica-cookies"
                    target="_blank"
                    class="text-indigo-600 hover:text-indigo-800 underline font-medium inline-flex items-center gap-0.5"
                  >
                    Política de Cookies
                    <ExternalLink class="w-3 h-3" />
                  </router-link>
                  <span class="text-red-400">*</span>
                </label>
              </div>

              <p class="text-[11px] text-gray-400 leading-relaxed pl-7">
                Responsable: DIANI ANDREÍNA ELÍAS OCHOA (S.M.A.R.T BIENESTAR) · NIF: 51.034.346-Z · Finalidad: gestión del registro y prestación del servicio · Base legal: ejecución del contrato y consentimiento · Destinatarios: no se cederán datos a terceros salvo obligación legal · Derechos: acceso, rectificación, supresión, portabilidad, limitación y oposición escribiendo a
                <a href="mailto:privacidad@smartbienestar.es" class="text-indigo-600 hover:text-indigo-800 underline">privacidad@smartbienestar.es</a>.
                Puede presentar reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline">AEPD</a>.
              </p>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMsg" class="mt-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex items-center gap-3">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              type="button"
              class="px-5 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <ArrowLeft class="w-4 h-4" />
              Anterior
            </button>

            <div class="flex-1"></div>

            <button
              v-if="currentStep === 1"
              @click="nextStep"
              :disabled="!canProceedStep1"
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
            >
              Siguiente
              <ArrowRight class="w-4 h-4" />
            </button>

            <button
              v-if="currentStep === 2"
              @click="handleRegister"
              :disabled="!canProceedStep2 || loading"
              type="button"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
              <ArrowRight v-if="!loading" class="w-4 h-4" />
            </button>
          </div>

          <!-- Links -->
          <div class="mt-8 pt-6 border-t border-gray-200 space-y-3 text-center">
            <p class="text-sm text-gray-500">
              ¿Ya tienes una cuenta?
              <button @click="goToLogin" type="button" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">
                Inicia sesión
              </button>
            </p>
            <p class="text-sm text-gray-500">
              ¿Te han invitado como colaborador?
              <button @click="goToUnirse" type="button" class="text-indigo-600 hover:text-indigo-800 font-semibold ml-1">
                Únete a tu empresa
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Contrato de Licencia -->
    <Teleport to="body">
      <div
        v-if="showContratoModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="showContratoModal = false"
        ></div>

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText class="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Contrato de Licencia de Uso</h2>
                <p class="text-xs text-gray-500">SMART Bienestar — Programa Informático</p>
              </div>
            </div>
            <button
              @click="showContratoModal = false"
              class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="flex-1 overflow-y-auto p-6 legal-content text-sm text-gray-700 leading-relaxed">
            <h2 class="text-lg font-bold text-gray-900 mb-3">INTRODUCCIÓN</h2>
            <p class="mb-3">Gracias por elegir S.M.A.R.T BIENESTAR. DIANI ANDREÍNA ELÍAS OCHOA ofrece, a través de su plataforma informática accesible en modalidad Software as a Service (SaaS), una herramienta integral para la medición y mejora del bienestar organizacional.</p>
            <p class="mb-3">El usuario, al utilizar cualesquiera de estos servicios de S.M.A.R.T BIENESTAR, incluyendo todas sus características y funcionalidades asociadas, está suscribiendo un contrato de licencia de uso de la aplicación S.M.A.R.T BIENESTAR con DIANI ANDREÍNA ELÍAS OCHOA (en adelante, el LICENCIANTE), con domicilio en Ronda de Oviedo, 12, 4D, de la localidad de Rivas-Vaciamadrid (28523 - Madrid) y provisto del N.I.F 51.034.346-Z.</p>
            <p class="mb-4">La licencia de uso que suscribe el usuario con el LICENCIANTE incluye los términos y cláusulas descritas a continuación.</p>

            <h2 class="text-lg font-bold text-gray-900 mb-3 mt-6">CLÁUSULAS</h2>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">PRIMERA. DEFINICIONES</h3>
            <ul class="list-disc pl-5 mb-3 space-y-1">
              <li><strong>PROGRAMA DE ORDENADOR / APLICACIÓN INFORMÁTICA / SOFTWARE:</strong> Aplicación informática accesible en modalidad SaaS.</li>
              <li><strong>USUARIO / LICENCIATARIO:</strong> Persona física o jurídica que ha celebrado este contrato.</li>
              <li><strong>LICENCIA:</strong> Derecho de uso no exclusivo, no transferible e intransferible.</li>
              <li><strong>SERVICIOS:</strong> Todos los servicios puestos a disposición del Usuario a través de la aplicación.</li>
            </ul>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">SEGUNDA. OBJETO DEL CONTRATO</h3>
            <p class="mb-3">El LICENCIANTE concede al USUARIO una LICENCIA no exclusiva y limitada de uso de la APLICACIÓN, conforme a las condiciones aquí establecidas, para su uso profesional y dentro de los límites de los servicios contratados.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">TERCERA. CONDICIONES DE USO</h3>
            <p class="mb-3">El Usuario podrá utilizar la APLICACIÓN de acuerdo con las Condiciones de Uso, siendo responsable de su acceso y de la información que proporcione. El Usuario debe ser mayor de 18 años y disponer de plena capacidad jurídica para contratar.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">CUARTA. PROHIBICIONES</h3>
            <ul class="list-disc pl-5 mb-3 space-y-1">
              <li>Modificar, adaptar, traducir, descompilar o realizar ingeniería inversa de la APLICACIÓN.</li>
              <li>Distribuir, vender, alquilar o prestar la APLICACIÓN.</li>
              <li>Utilizar la APLICACIÓN para prestar servicios a terceros sin autorización expresa.</li>
              <li>Violar, vulnerar o alterar las medidas de seguridad.</li>
              <li>Intentar obtener acceso no autorizado a la APLICACIÓN o sus sistemas.</li>
              <li>Utilizar la APLICACIÓN para actividades ilegales, fraudulentas o nocivas.</li>
            </ul>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">QUINTA. RESPONSABILIDADES DEL USUARIO</h3>
            <ul class="list-disc pl-5 mb-3 space-y-1">
              <li>Mantener confidencial su contraseña y ser responsable de toda actividad bajo su cuenta.</li>
              <li>Notificar inmediatamente al LICENCIANTE de cualquier uso no autorizado.</li>
              <li>Cumplir con todas las leyes, regulaciones y políticas aplicables.</li>
              <li>No utilizar la APLICACIÓN para transmitir virus, malware o código malicioso.</li>
              <li>Respetar los derechos de propiedad intelectual de terceros.</li>
            </ul>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">SEXTA. DERECHOS DE PROPIEDAD INTELECTUAL</h3>
            <p class="mb-3">La APLICACIÓN, sus componentes, contenidos y todo material asociado están protegidos por leyes de propiedad intelectual. El LICENCIANTE retiene todos los derechos no expresamente otorgados. Sujeta a licencia CC BY-NC-ND.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">SÉPTIMA. AUSENCIA DE GARANTÍAS</h3>
            <p class="mb-3">El LICENCIANTE proporciona la APLICACIÓN "TAL CUAL" sin garantías de ningún tipo.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">OCTAVA. LIMITACIÓN DE RESPONSABILIDAD</h3>
            <p class="mb-3">El LICENCIANTE no será responsable de pérdida de datos, daños directos o indirectos, interrupciones de servicio, o daños por uso indebido.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">NOVENA. VIGENCIA Y TERMINACIÓN</h3>
            <p class="mb-3">Vigente desde el acceso del Usuario hasta cancelación de suscripción, rescisión por incumplimiento, o cese del servicio.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">DÉCIMA. CONFIDENCIALIDAD Y DATOS</h3>
            <p class="mb-3">Los datos del Usuario serán protegidos conforme a la legislación aplicable en materia de protección de datos.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">UNDÉCIMA. MODIFICACIÓN DE TÉRMINOS</h3>
            <p class="mb-3">El LICENCIANTE se reserva el derecho de modificar estos términos en cualquier momento.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">DUODÉCIMA. LEY APLICABLE Y JURISDICCIÓN</h3>
            <p class="mb-3">Regido por legislación española. Jurisdicción de los Juzgados y Tribunales competentes en España.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">DECIMOTERCERA. INTEGRACIÓN Y DIVISIBILIDAD</h3>
            <p class="mb-3">Acuerdo completo entre las partes. Cláusulas separables en caso de nulidad parcial.</p>

            <h3 class="font-bold text-gray-800 mt-4 mb-2">DECIMOCUARTA. NOTIFICACIONES</h3>
            <p class="mb-3">Dirigirse a: privacidad@smartbienestar.es — Ronda de Oviedo, 12, 4D, Rivas-Vaciamadrid (28523 - Madrid).</p>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-between">
            <p class="text-xs text-gray-500">Documento elaborado por Área Digital Abogados</p>
            <div class="flex gap-3">
              <router-link
                to="/contrato-licencia"
                target="_blank"
                class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Ver completo <ExternalLink class="w-3 h-3" />
              </router-link>
              <button
                @click="showContratoModal = false; aceptaContrato = true"
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
              >
                He leído y acepto
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
