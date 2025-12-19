import { supabase } from '@/lib/supabase';

export const encuestasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('encuestas')
      .select('*')
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('encuestas')
      .select(`
        *,
        preguntas_encuesta (
          *
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await supabase
      .from('encuestas')
      .select(`
        *,
        preguntas_encuesta (
          *
        )
      `)
      .eq('estado', 'activa')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async create(encuesta) {
    const { preguntas, ...encuestaData } = encuesta;

    // Crear encuesta
    const { data: nuevaEncuesta, error: encuestaError } = await supabase
      .from('encuestas')
      .insert([encuestaData])
      .select()
      .single();

    if (encuestaError) throw encuestaError;

    // Crear preguntas
    if (preguntas && preguntas.length > 0) {
      const preguntasData = preguntas.map((pregunta, index) => ({
        encuesta_id: nuevaEncuesta.id,
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || null,
        orden: index + 1,
        es_anonima: pregunta.es_anonima !== false,
      }));

      const { error: preguntasError } = await supabase
        .from('preguntas_encuesta')
        .insert(preguntasData);

      if (preguntasError) throw preguntasError;
    }

    return nuevaEncuesta;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('encuestas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('encuestas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRespuestas(encuestaId) {
    const { data, error } = await supabase
      .from('respuestas_encuesta')
      .select(`
        *,
        preguntas_encuesta (
          *
        )
      `)
      .eq('encuesta_id', encuestaId);

    if (error) throw error;
    return data;
  },

  // Obtener encuestas pendientes para el empleado actual
  async getPendientesEmpleado() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    // Obtener IDs de encuestas ya respondidas por este usuario
    const { data: respondidas, error: respError } = await supabase
      .from('respuestas_encuesta')
      .select('encuesta_id')
      .eq('empleado_id', user.id);

    if (respError) throw respError;

    const idsRespondidas = respondidas?.map(r => r.encuesta_id) || [];

    // Obtener encuestas activas que no ha respondido
    let query = supabase
      .from('encuestas')
      .select(`
        *,
        preguntas:preguntas_encuesta(count)
      `)
      .eq('estado', 'activa')
      .gte('fecha_fin', new Date().toISOString());

    if (idsRespondidas.length > 0) {
      query = query.not('id', 'in', `(${idsRespondidas.join(',')})`);
    }

    const { data, error } = await query.order('fecha_fin', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Obtener historial de encuestas completadas por el empleado
  async getHistorialEmpleado() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autenticado');

    const { data, error } = await supabase
      .from('respuestas_encuesta')
      .select(`
        id,
        created_at,
        encuesta:encuestas (
          id,
          titulo,
          descripcion,
          tipo
        )
      `)
      .eq('empleado_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Agrupar por encuesta (puede haber múltiples respuestas por encuesta)
    const historialMap = new Map();
    (data || []).forEach(resp => {
      if (resp.encuesta && !historialMap.has(resp.encuesta.id)) {
        historialMap.set(resp.encuesta.id, {
          ...resp.encuesta,
          fecha_completado: resp.created_at
        });
      }
    });

    return Array.from(historialMap.values());
  },

  async submitRespuesta(encuestaId, respuestas) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No estás autenticado');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/submit-survey-response`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        encuesta_id: encuestaId,
        respuestas: respuestas
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409 && data.isDuplicate) {
        const duplicateError = new Error(data.error || 'Ya has respondido esta encuesta.');
        duplicateError.isDuplicate = true;
        throw duplicateError;
      }
      throw new Error(data.error || 'Error al enviar respuestas');
    }

    return data;
  },
};
