import { useToast as useVueToast } from 'vue-toastification';

export function useToast() {
  const toast = useVueToast();

  return {
    success: (message, options = {}) => {
      toast.success(message, {
        icon: '✅',
        ...options
      });
    },

    error: (message, options = {}) => {
      toast.error(message, {
        icon: '❌',
        ...options
      });
    },

    warning: (message, options = {}) => {
      toast.warning(message, {
        icon: '⚠️',
        ...options
      });
    },

    info: (message, options = {}) => {
      toast.info(message, {
        icon: '💡',
        ...options
      });
    },

    // Helpers específicos para el negocio
    encuestaCreated: (titulo) => {
      toast.success(`Encuesta "${titulo}" creada exitosamente`, {
        icon: '📋',
        timeout: 5000
      });
    },

    empleadoInvited: (nombre) => {
      toast.success(`${nombre} ha sido invitado correctamente`, {
        icon: '👤',
        timeout: 4000
      });
    },

    solicitudApproved: () => {
      toast.success('Solicitud aprobada exitosamente', {
        icon: '✅',
        timeout: 4000
      });
    },

    lowParticipation: (encuestaTitulo, porcentaje) => {
      toast.warning(`La encuesta "${encuestaTitulo}" tiene baja participación (${porcentaje}%)`, {
        icon: '⚠️',
        timeout: 6000
      });
    },

    dataLoadError: (entity = 'datos') => {
      toast.error(`Error al cargar ${entity}. Por favor, intenta de nuevo.`, {
        icon: '❌',
        timeout: 5000
      });
    },

    saveError: () => {
      toast.error('Error al guardar. Por favor, verifica los datos e intenta de nuevo.', {
        icon: '❌',
        timeout: 5000
      });
    }
  };
}
