import { reactive } from 'vue';

// TODO: conectar con tabla "configuracion_empresa" y "parametros_encuestas" en futuras iteraciones.

export const configuracionMock = reactive({
  empresa: {
    nombre: 'SMART Bienestar S.A.',
    logo: '/assets/logo-demo.png',
    pais: 'España',
    idioma: 'Español'
  },
  encuestas: {
    escala: '1–5',
    anonimato_predeterminado: 'Anónimo completo',
    umbral_resultados: 5,
    recordatorio_automatico: true,
    dias_recordatorio: 3,
    frecuencia_pulso: 'Mensual'
  },
  interfaz: {
    tema: 'Claro',
    idioma_ui: 'Español',
    notificaciones_email: true,
    notificaciones_push: false
  },
  privacidad: {
    retencion_datos_meses: 24,
    permitir_exportacion: true,
    cumplimiento_gdpr: true
  }
});

// Opciones disponibles para los selectores
export const opcionesConfiguracion = {
  paises: [
    'España',
    'México',
    'Argentina',
    'Colombia',
    'Chile',
    'Perú',
    'Estados Unidos',
    'Reino Unido',
    'Francia',
    'Alemania'
  ],
  idiomas: [
    'Español',
    'Inglés',
    'Francés',
    'Alemán',
    'Portugués'
  ],
  escalas: [
    '1–5',
    '1–7',
    '0–10'
  ],
  nivelesAnonimato: [
    {
      id: 'anonimato_completo',
      label: 'Anónimo completo',
      descripcion: 'Sin ningún identificador personal'
    },
    {
      id: 'anonimato_parcial',
      label: 'Anónimo parcial',
      descripcion: 'Agrupado por departamento'
    },
    {
      id: 'identificado',
      label: 'Identificado',
      descripcion: 'Con seguimiento individual'
    }
  ],
  temas: [
    'Claro',
    'Oscuro',
    'Automático'
  ],
  frecuenciasPulso: [
    'Semanal',
    'Quincenal',
    'Mensual',
    'Trimestral'
  ]
};

// Función para guardar configuración
export const guardarConfiguracion = (nuevaConfig) => {
  Object.assign(configuracionMock, nuevaConfig);
  localStorage.setItem('smart-bienestar-config', JSON.stringify(configuracionMock));
  return true;
};

// Función para cargar configuración guardada
export const cargarConfiguracion = () => {
  const saved = localStorage.getItem('smart-bienestar-config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(configuracionMock, parsed);
    } catch (e) {
      console.error('Error al cargar configuración:', e);
    }
  }
  return configuracionMock;
};

// Función para resetear a valores por defecto
export const resetearConfiguracion = () => {
  configuracionMock.empresa = {
    nombre: 'SMART Bienestar S.A.',
    logo: '/assets/logo-demo.png',
    pais: 'España',
    idioma: 'Español'
  };
  configuracionMock.encuestas = {
    escala: '1–5',
    anonimato_predeterminado: 'Anónimo completo',
    umbral_resultados: 5,
    recordatorio_automatico: true,
    dias_recordatorio: 3,
    frecuencia_pulso: 'Mensual'
  };
  configuracionMock.interfaz = {
    tema: 'Claro',
    idioma_ui: 'Español',
    notificaciones_email: true,
    notificaciones_push: false
  };
  configuracionMock.privacidad = {
    retencion_datos_meses: 24,
    permitir_exportacion: true,
    cumplimiento_gdpr: true
  };
  localStorage.removeItem('smart-bienestar-config');
  return configuracionMock;
};
