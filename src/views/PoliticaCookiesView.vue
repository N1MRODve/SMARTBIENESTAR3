<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, Cookie, Shield, Info, Settings, Globe, UserCheck, Scale, Mail, ExternalLink } from 'lucide-vue-next';

const router = useRouter();

const cookies = [
  {
    nombre: 'sb-[ref]-auth-token',
    tipo: 'Técnica / Autenticación',
    titular: 'Propia',
    finalidad: 'Almacena el token de sesión del usuario para mantener la autenticación activa. Es estrictamente necesaria para el funcionamiento de la plataforma.',
    duracion: 'Sesión del navegador / Hasta cierre de sesión',
    almacenamiento: 'localStorage'
  },
  {
    nombre: 'sb-[ref]-auth-token-code-verifier',
    tipo: 'Técnica / Seguridad',
    titular: 'Propia',
    finalidad: 'Verificador de código PKCE utilizado durante el proceso de autenticación para garantizar la seguridad del inicio de sesión.',
    duracion: 'Temporal (proceso de login)',
    almacenamiento: 'localStorage'
  }
];

const navegadores = [
  { nombre: 'Google Chrome', instrucciones: 'Configuración → Privacidad y seguridad → Cookies y otros datos de sitios → Gestionar cookies' },
  { nombre: 'Mozilla Firefox', instrucciones: 'Configuración → Privacidad & Seguridad → Cookies y datos del sitio → Administrar datos' },
  { nombre: 'Safari', instrucciones: 'Preferencias → Privacidad → Administrar datos de sitios web' },
  { nombre: 'Microsoft Edge', instrucciones: 'Configuración → Privacidad, búsqueda y servicios → Cookies y permisos del sitio' },
  { nombre: 'Opera', instrucciones: 'Configuración → Avanzado → Privacidad y seguridad → Configuración de contenido → Cookies' }
];

const secciones = ref([
  { id: 'introduccion', titulo: '1. Introducción', icono: Info },
  { id: 'responsable', titulo: '2. Responsable', icono: UserCheck },
  { id: 'que-son', titulo: '3. ¿Qué son las cookies?', icono: Cookie },
  { id: 'tipos', titulo: '4. Tipos de cookies', icono: Settings },
  { id: 'cookies-utilizadas', titulo: '5. Cookies utilizadas', icono: Shield },
  { id: 'exencion', titulo: '6. Exención de consentimiento', icono: Scale },
  { id: 'terceros', titulo: '7. Cookies de terceros', icono: Globe },
  { id: 'gestion', titulo: '8. Gestión de cookies', icono: Settings },
  { id: 'transferencias', titulo: '9. Transferencias internacionales', icono: Globe },
  { id: 'perfilado', titulo: '10. Perfilado', icono: UserCheck },
  { id: 'derechos', titulo: '11. Derechos del usuario', icono: Shield },
  { id: 'base-legal', titulo: '12. Base legal', icono: Scale },
  { id: 'contacto', titulo: '13. Contacto', icono: Mail }
]);

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <button @click="goBack" class="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft :size="20" />
          <span class="text-sm font-medium">Volver</span>
        </button>
        <div class="flex items-center gap-2">
          <Cookie :size="20" class="text-blue-600" />
          <span class="text-sm font-semibold text-slate-700">Política de Cookies</span>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div class="lg:flex lg:gap-8">
        <!-- Sidebar - Índice (desktop only) -->
        <aside class="hidden lg:block lg:w-64 flex-shrink-0">
          <nav class="sticky top-24 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Índice</h3>
            <ul class="space-y-1">
              <li v-for="sec in secciones" :key="sec.id">
                <button
                  @click="scrollToSection(sec.id)"
                  class="w-full text-left text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-2 py-1.5 transition-colors flex items-center gap-2"
                >
                  <component :is="sec.icono" :size="12" class="flex-shrink-0 opacity-50" />
                  <span>{{ sec.titulo }}</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-w-0">
          <!-- Title Card -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie :size="24" class="text-blue-600" />
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">Política de Cookies</h1>
                <p class="text-sm text-blue-600 font-medium mt-1">smartbienestar.es</p>
                <p class="text-xs text-slate-400 mt-2">Última actualización: Marzo 2026</p>
              </div>
            </div>
          </div>

          <!-- Content Sections -->
          <div class="space-y-6">

            <!-- 1. Introducción -->
            <section id="introduccion" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Info :size="20" class="text-blue-500" />
                1. Introducción
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                En cumplimiento de lo dispuesto en el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios
                de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), y del Reglamento (UE) 2016/679
                del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas
                físicas en lo que respecta al tratamiento de datos personales (RGPD), la presente Política de Cookies
                tiene como finalidad informar de manera clara y precisa sobre las cookies y tecnologías de almacenamiento
                local que se utilizan en el sitio web smartbienestar.es (en adelante, la "Plataforma").
              </p>
            </section>

            <!-- 2. Responsable -->
            <section id="responsable" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <UserCheck :size="20" class="text-blue-500" />
                2. Responsable del Tratamiento
              </h2>
              <div class="bg-slate-50 rounded-lg p-4 space-y-2">
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="text-xs font-semibold text-slate-500 sm:w-40">Responsable:</span>
                  <span class="text-sm text-slate-700">Diani Andreina Elías Ochoa</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="text-xs font-semibold text-slate-500 sm:w-40">Nombre comercial:</span>
                  <span class="text-sm text-slate-700">SMART Bienestar</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="text-xs font-semibold text-slate-500 sm:w-40">Sitio web:</span>
                  <span class="text-sm text-blue-600">https://smartbienestar.es</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="text-xs font-semibold text-slate-500 sm:w-40">Correo electrónico:</span>
                  <span class="text-sm text-slate-700">info@smartbienestar.com</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span class="text-xs font-semibold text-slate-500 sm:w-40">Domicilio:</span>
                  <span class="text-sm text-slate-700">Barcelona, España</span>
                </div>
              </div>
            </section>

            <!-- 3. Qué son las cookies -->
            <section id="que-son" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Cookie :size="20" class="text-blue-500" />
                3. ¿Qué son las cookies y tecnologías similares?
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario
                (ordenador, tablet o smartphone) cuando los visita. Permiten que el sitio web recuerde información sobre
                la visita, como el idioma preferido y otras opciones, con el fin de facilitar la próxima visita y hacer
                que el sitio resulte más útil.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                Además de las cookies tradicionales, existen otras tecnologías de almacenamiento local en el navegador,
                como <strong>localStorage</strong> y <strong>sessionStorage</strong>, que cumplen funciones similares y
                están igualmente reguladas por la normativa de protección de datos. En la presente política, cuando nos
                referimos a "cookies", incluimos también estas tecnologías de almacenamiento local.
              </p>
            </section>

            <!-- 4. Tipos de cookies -->
            <section id="tipos" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Settings :size="20" class="text-blue-500" />
                4. Tipos de cookies
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-4">Las cookies pueden clasificarse atendiendo a diversos criterios:</p>

              <h3 class="text-sm font-bold text-slate-700 mb-2">4.1. Según su titularidad</h3>
              <ul class="text-sm text-slate-600 space-y-2 mb-4 ml-4">
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies propias:</strong> Enviadas al dispositivo del usuario desde un equipo o dominio gestionado por el propio editor del sitio web.</span></li>
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies de terceros:</strong> Enviadas al dispositivo del usuario desde un equipo o dominio gestionado por otra entidad que trata los datos obtenidos.</span></li>
              </ul>

              <h3 class="text-sm font-bold text-slate-700 mb-2">4.2. Según su finalidad</h3>
              <ul class="text-sm text-slate-600 space-y-2 mb-4 ml-4">
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies técnicas:</strong> Permiten la navegación y el uso de las diferentes opciones o servicios. Son estrictamente necesarias y están exentas del requisito de consentimiento.</span></li>
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies de personalización:</strong> Permiten recordar información para que el usuario acceda con determinadas características diferenciadas.</span></li>
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies de análisis:</strong> Permiten realizar el seguimiento y análisis del comportamiento de los usuarios.</span></li>
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies publicitarias:</strong> Permiten la gestión de espacios publicitarios basándose en criterios como el contenido o la frecuencia de los anuncios.</span></li>
              </ul>

              <h3 class="text-sm font-bold text-slate-700 mb-2">4.3. Según su duración</h3>
              <ul class="text-sm text-slate-600 space-y-2 ml-4">
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies de sesión:</strong> Se eliminan cuando el usuario cierra el navegador.</span></li>
                <li class="flex gap-2"><span class="text-blue-400">•</span><span><strong>Cookies persistentes:</strong> Permanecen almacenadas durante un período determinado o hasta que el usuario las elimina manualmente.</span></li>
              </ul>
            </section>

            <!-- 5. Cookies utilizadas -->
            <section id="cookies-utilizadas" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Shield :size="20" class="text-blue-500" />
                5. Cookies y tecnologías de almacenamiento utilizadas
              </h2>
              <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-emerald-700 font-medium flex items-center gap-2">
                  <Shield :size="14" />
                  Esta Plataforma utiliza exclusivamente cookies técnicas y estrictamente necesarias. No se utilizan cookies analíticas, publicitarias ni de terceros.
                </p>
              </div>

              <!-- Cookie Cards -->
              <div class="space-y-3">
                <div
                  v-for="cookie in cookies"
                  :key="cookie.nombre"
                  class="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                >
                  <div class="flex items-start justify-between gap-3 mb-2">
                    <code class="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">{{ cookie.nombre }}</code>
                    <span class="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">{{ cookie.tipo }}</span>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed mb-2">{{ cookie.finalidad }}</p>
                  <div class="flex flex-wrap gap-3 text-[11px] text-slate-400">
                    <span><strong>Titular:</strong> {{ cookie.titular }}</span>
                    <span><strong>Duración:</strong> {{ cookie.duracion }}</span>
                    <span><strong>Almacenamiento:</strong> {{ cookie.almacenamiento }}</span>
                  </div>
                </div>
              </div>

              <p class="text-xs text-slate-400 mt-3 italic">
                Nota: La referencia "[ref]" corresponde al identificador único del proyecto en el proveedor de autenticación (Supabase).
              </p>
            </section>

            <!-- 6. Exención de consentimiento -->
            <section id="exencion" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Scale :size="20" class="text-blue-500" />
                6. Exención de consentimiento para cookies técnicas
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                De conformidad con el artículo 22.2 de la LSSI-CE y los criterios establecidos por la Agencia Española
                de Protección de Datos (AEPD) en su Guía sobre el uso de las cookies, las cookies estrictamente
                necesarias o técnicas están exentas del requisito de obtener el consentimiento previo del usuario.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                Las cookies utilizadas en smartbienestar.es son exclusivamente de tipo técnico, ya que resultan
                imprescindibles para la prestación del servicio de autenticación solicitado expresamente por el
                usuario al iniciar sesión. Por tanto, estas cookies se encuentran amparadas por la excepción prevista
                en la normativa y no requieren consentimiento previo para su instalación.
              </p>
            </section>

            <!-- 7. Cookies de terceros -->
            <section id="terceros" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Globe :size="20" class="text-blue-500" />
                7. Cookies de terceros
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                La Plataforma <strong>no utiliza cookies de terceros</strong>. No se integran servicios de analítica web
                (como Google Analytics), redes sociales, publicidad programática ni ningún otro servicio externo que
                instale cookies en el dispositivo de los usuarios.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                En caso de que en el futuro se incorporen servicios de terceros que requieran la instalación de cookies
                adicionales, se actualizará la presente Política y se solicitará el consentimiento previo del usuario
                antes de su activación, de conformidad con la normativa vigente.
              </p>
            </section>

            <!-- 8. Gestión de cookies -->
            <section id="gestion" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Settings :size="20" class="text-blue-500" />
                8. ¿Cómo gestionar y eliminar las cookies?
              </h2>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p class="text-xs text-amber-700">
                  ⚠️ La desactivación de las cookies técnicas puede impedir el correcto funcionamiento de la Plataforma,
                  especialmente en relación con el inicio de sesión.
                </p>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr class="bg-slate-50">
                      <th class="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">Navegador</th>
                      <th class="text-left text-xs font-semibold text-slate-500 px-3 py-2 border-b border-slate-200">Instrucciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="nav in navegadores" :key="nav.nombre" class="border-b border-slate-100 hover:bg-slate-50">
                      <td class="px-3 py-2 text-xs font-medium text-slate-700">{{ nav.nombre }}</td>
                      <td class="px-3 py-2 text-xs text-slate-600">{{ nav.instrucciones }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="text-xs text-slate-500 mt-3 leading-relaxed">
                Para eliminar los datos de almacenamiento local (localStorage), puede acceder a las herramientas de
                desarrollo de su navegador (tecla F12) y navegar a la sección "Application" o "Almacenamiento" para
                gestionar los datos almacenados por smartbienestar.es.
              </p>
            </section>

            <!-- 9. Transferencias internacionales -->
            <section id="transferencias" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Globe :size="20" class="text-blue-500" />
                9. Transferencias internacionales de datos
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                El servicio de autenticación de la Plataforma se presta a través de Supabase, Inc., cuyos servidores
                se encuentran ubicados en la <strong>Unión Europea</strong>. Los datos de autenticación almacenados
                en las cookies técnicas no son transferidos a terceros países fuera del Espacio Económico Europeo.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                En caso de que se produzcan cambios en la ubicación de los servidores, se informará al usuario y se
                garantizarán las salvaguardas adecuadas conforme al Capítulo V del RGPD.
              </p>
            </section>

            <!-- 10. Perfilado -->
            <section id="perfilado" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <UserCheck :size="20" class="text-blue-500" />
                10. Elaboración de perfiles y decisiones automatizadas
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                Las cookies utilizadas en smartbienestar.es <strong>no se emplean</strong> para la elaboración de perfiles
                de usuario con fines comerciales ni para la toma de decisiones automatizadas. Su única finalidad es
                mantener la sesión del usuario autenticado en la Plataforma.
              </p>
            </section>

            <!-- 11. Derechos del usuario -->
            <section id="derechos" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Shield :size="20" class="text-blue-500" />
                11. Derechos del usuario
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                De conformidad con el RGPD, el usuario puede ejercer en cualquier momento los siguientes derechos
                en relación con el tratamiento de sus datos personales:
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Acceso</strong> <span class="text-slate-500">— Conocer qué datos están siendo tratados</span></p>
                </div>
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Rectificación</strong> <span class="text-slate-500">— Solicitar la corrección de datos inexactos</span></p>
                </div>
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Supresión</strong> <span class="text-slate-500">— Solicitar la eliminación de los datos</span></p>
                </div>
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Oposición</strong> <span class="text-slate-500">— Oponerse al tratamiento en determinadas circunstancias</span></p>
                </div>
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Limitación</strong> <span class="text-slate-500">— Solicitar la limitación del tratamiento</span></p>
                </div>
                <div class="bg-slate-50 rounded-lg px-3 py-2">
                  <p class="text-xs"><strong class="text-slate-700">Portabilidad</strong> <span class="text-slate-500">— Recibir los datos en formato estructurado</span></p>
                </div>
              </div>
              <p class="text-sm text-slate-600 leading-relaxed mb-2">
                Para ejercer estos derechos, puede dirigirse a <strong>info@smartbienestar.com</strong> indicando en
                el asunto "PROTECCIÓN DE DATOS" y adjuntando copia de su documento de identidad.
              </p>
              <p class="text-sm text-slate-600 leading-relaxed">
                Asimismo, tiene derecho a presentar una reclamación ante la
                <strong>Agencia Española de Protección de Datos (AEPD)</strong> en
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.aepd.es</a>
                si considera que el tratamiento no se ajusta a la normativa vigente.
              </p>
            </section>

            <!-- 12. Base legal -->
            <section id="base-legal" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Scale :size="20" class="text-blue-500" />
                12. Base legal del tratamiento
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                El tratamiento de los datos almacenados a través de las cookies técnicas se fundamenta en el
                <strong>interés legítimo</strong> del responsable (artículo 6.1.f del RGPD), al resultar necesario
                para la prestación del servicio solicitado por el usuario.
              </p>

              <h3 class="text-sm font-bold text-slate-700 mb-2">Normativa aplicable:</h3>
              <ul class="text-xs text-slate-600 space-y-1 ml-4">
                <li class="flex gap-2"><span class="text-blue-400">•</span>Ley 34/2002 (LSSI-CE), artículo 22.2</li>
                <li class="flex gap-2"><span class="text-blue-400">•</span>Reglamento (UE) 2016/679 (RGPD)</li>
                <li class="flex gap-2"><span class="text-blue-400">•</span>Ley Orgánica 3/2018 (LOPDGDD)</li>
                <li class="flex gap-2"><span class="text-blue-400">•</span>Guía sobre el uso de las cookies de la AEPD</li>
              </ul>
            </section>

            <!-- 13. Contacto -->
            <section id="contacto" class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Mail :size="20" class="text-blue-500" />
                13. Contacto
              </h2>
              <p class="text-sm text-slate-600 leading-relaxed mb-3">
                Para cualquier consulta relacionada con esta Política de Cookies, puede contactar con nosotros a través de:
              </p>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <Mail :size="14" class="text-blue-500" />
                  <span class="text-sm text-slate-700">info@smartbienestar.com</span>
                </div>
                <div class="flex items-center gap-2">
                  <Globe :size="14" class="text-blue-500" />
                  <span class="text-sm text-slate-700">https://smartbienestar.es</span>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <div class="text-center py-6">
              <p class="text-xs text-slate-400">© 2026 SMART Bienestar — Todos los derechos reservados</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
