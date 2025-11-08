import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface SurveyResponse {
  encuesta_id: string;
  pregunta_id: string;
  respuesta: string;
  departamento?: string;
}

interface RequestBody {
  encuesta_id: string;
  respuestas: Record<string, string>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { encuesta_id, respuestas }: RequestBody = await req.json();

    if (!encuesta_id || !respuestas) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    const hashInput = `${clientIp}-${encuesta_id}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash_ip = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data: existingResponse, error: checkError } = await supabase
      .from('respuestas_encuesta')
      .select('id')
      .eq('encuesta_id', encuesta_id)
      .eq('hash_ip', hash_ip)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing response:', checkError);
      return new Response(
        JSON.stringify({ error: 'Error checking duplicate submission' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (existingResponse) {
      return new Response(
        JSON.stringify({ 
          error: 'Ya has respondido esta encuesta.',
          isDuplicate: true 
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: encuesta, error: encuestaError } = await supabase
      .from('encuestas')
      .select('privacidad_nivel')
      .eq('id', encuesta_id)
      .maybeSingle();

    if (encuestaError || !encuesta) {
      return new Response(
        JSON.stringify({ error: 'Encuesta no encontrada' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const privacidadNivel = encuesta.privacidad_nivel;
    const empleadoId = (privacidadNivel === 'anonimato_completo') ? null : user.id;

    const { data: preguntas, error: preguntasError } = await supabase
      .from('preguntas_encuesta')
      .select('id')
      .eq('encuesta_id', encuesta_id);

    if (preguntasError) {
      return new Response(
        JSON.stringify({ error: 'Error al obtener preguntas' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const respuestasArray: SurveyResponse[] = [];
    for (const [preguntaId, respuesta] of Object.entries(respuestas)) {
      respuestasArray.push({
        encuesta_id,
        pregunta_id: preguntaId,
        respuesta: String(respuesta),
        empleado_id: empleadoId,
        hash_ip: hash_ip,
        departamento: null
      });
    }

    const { error: insertError } = await supabase
      .from('respuestas_encuesta')
      .insert(respuestasArray);

    if (insertError) {
      console.error('Error inserting responses:', insertError);
      return new Response(
        JSON.stringify({ error: 'Error al guardar respuestas' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Respuestas enviadas correctamente' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in submit-survey-response:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});