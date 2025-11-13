import { supabase } from '@/lib/supabase';
import { wrapServiceWithDemo } from './demo.wrapper';

const baseService = {
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

export const encuestasService = wrapServiceWithDemo(baseService, 'encuestas');
