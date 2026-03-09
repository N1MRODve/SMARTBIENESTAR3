import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface NotificationPayload {
  type: 'nueva_encuesta' | 'recordatorio_encuesta' | 'nuevo_comunicado' | 'encuesta_cerrada' | 'invitacion_empleado';
  empresa_id: string;
  data: {
    encuesta_id?: string;
    comunicado_id?: string;
    titulo?: string;
    descripcion?: string;
    fecha_cierre?: string;
    url?: string;
    // Para invitaciones
    email?: string;
    nombre?: string;
    token?: string;
    departamento?: string;
  };
  destinatarios?: string[]; // IDs de empleados específicos, o vacío para todos
  destinatarios_emails?: string[]; // Emails específicos (para invitaciones)
}

const EMAIL_TEMPLATES = {
  nueva_encuesta: {
    subject: (data: any) => `Nueva encuesta disponible: ${data.titulo}`,
    html: (data: any, empleado: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SMART Bienestar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Tu bienestar, nuestra prioridad</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hola <strong>${empleado.nombre || 'Colaborador'}</strong>,
              </p>

              <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
                Hay una nueva encuesta disponible para ti. Tu opinión es muy importante para mejorar el bienestar de toda la organización.
              </p>

              <!-- Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #1e293b; font-size: 20px; margin: 0 0 12px 0; font-weight: 600;">
                      ${data.titulo}
                    </h2>
                    ${data.descripcion ? `<p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">${data.descripcion}</p>` : ''}
                    ${data.fecha_cierre ? `
                      <p style="color: #dc2626; font-size: 13px; margin: 0; display: flex; align-items: center;">
                        <span style="margin-right: 6px;">&#128197;</span>
                        Fecha límite: <strong style="margin-left: 4px;">${new Date(data.fecha_cierre).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                      </p>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 30px 0; text-align: center;">
                    <a href="${data.url || 'https://smartbienestar.es'}"
                       style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Responder Encuesta
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
                Tus respuestas son completamente anonimas y confidenciales.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Este correo fue enviado por SMART Bienestar.<br>
                Si no deseas recibir estas notificaciones, contacta a tu administrador.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  },

  recordatorio_encuesta: {
    subject: (data: any) => `Recordatorio: La encuesta "${data.titulo}" cierra pronto`,
    html: (data: any, empleado: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SMART Bienestar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Recordatorio importante</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hola <strong>${empleado.nombre || 'Colaborador'}</strong>,
              </p>

              <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
                Te recordamos que hay una encuesta pendiente por responder. Tu participacion es fundamental.
              </p>

              <!-- Alert Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 12px; border: 1px solid #fcd34d;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #92400e; font-size: 20px; margin: 0 0 12px 0; font-weight: 600;">
                      ${data.titulo}
                    </h2>
                    <p style="color: #b45309; font-size: 14px; margin: 0; font-weight: 600;">
                      &#9888; Cierra el ${new Date(data.fecha_cierre).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 30px 0; text-align: center;">
                    <a href="${data.url || 'https://smartbienestar.es'}"
                       style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Completar Encuesta Ahora
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Este correo fue enviado por SMART Bienestar.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  },

  nuevo_comunicado: {
    subject: (data: any) => `Nuevo comunicado: ${data.titulo}`,
    html: (data: any, empleado: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SMART Bienestar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Nuevo comunicado</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hola <strong>${empleado.nombre || 'Colaborador'}</strong>,
              </p>

              <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
                Se ha publicado un nuevo comunicado para ti:
              </p>

              <!-- Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-radius: 12px; border: 1px solid #bae6fd;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #0c4a6e; font-size: 20px; margin: 0 0 12px 0; font-weight: 600;">
                      ${data.titulo}
                    </h2>
                    ${data.descripcion ? `<p style="color: #0369a1; font-size: 14px; margin: 0;">${data.descripcion.substring(0, 200)}${data.descripcion.length > 200 ? '...' : ''}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 30px 0; text-align: center;">
                    <a href="${data.url || 'https://smartbienestar.es'}"
                       style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Leer Comunicado Completo
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Este correo fue enviado por SMART Bienestar.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  },

  encuesta_cerrada: {
    subject: (data: any) => `Resultados disponibles: ${data.titulo}`,
    html: (data: any, empleado: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SMART Bienestar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Encuesta finalizada</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hola <strong>${empleado.nombre || 'Colaborador'}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
                La encuesta "<strong>${data.titulo}</strong>" ha finalizado. Gracias por tu participacion.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Los resultados estan siendo analizados para implementar mejoras en tu organizacion.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Este correo fue enviado por SMART Bienestar.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  },

  invitacion_empleado: {
    subject: (data: any, empresa: any) => `Has sido invitado a unirte a ${empresa?.nombre || 'tu empresa'} en SMART Bienestar`,
    html: (data: any, empleado: any, empresa: any) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">SMART Bienestar</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Invitacion a unirte</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hola${data.nombre ? ` <strong>${data.nombre}</strong>` : ''},
              </p>

              <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
                <strong>${empresa?.nombre || 'Tu empresa'}</strong> te ha invitado a unirte a SMART Bienestar, la plataforma de bienestar organizacional.
              </p>

              <!-- Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 12px 0; font-weight: 600;">
                      Tu invitacion
                    </h2>
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                      <strong>Empresa:</strong> ${empresa?.nombre || 'No especificada'}
                    </p>
                    ${data.departamento ? `
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                        <strong>Departamento:</strong> ${data.departamento}
                      </p>
                    ` : ''}
                    <p style="color: #64748b; font-size: 14px; margin: 0;">
                      <strong>Email:</strong> ${data.email}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 30px 0; text-align: center;">
                    <a href="${data.url || 'https://smartbienestar.es/unirse'}"
                       style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Completar mi Registro
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
                Esta invitacion expira en 7 dias.
              </p>
            </td>
          </tr>

          <!-- Benefits -->
          <tr>
            <td style="padding: 0 30px 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 12px; padding: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="color: #7c3aed; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">
                      ¿Que podras hacer en SMART Bienestar?
                    </h3>
                    <ul style="color: #374151; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Participar en encuestas de bienestar</li>
                      <li>Acceder a recursos y contenido exclusivo</li>
                      <li>Ganar puntos y canjear recompensas</li>
                      <li>Mantenerte informado con comunicados</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                Este correo fue enviado por SMART Bienestar.<br>
                Si no esperabas esta invitacion, puedes ignorar este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }
};

async function sendEmail(to: string, subject: string, html: string, resendApiKey: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SMART Bienestar <noreply@smartbienestar.es>',
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error sending email: ${error}`);
  }

  return await response.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validar autenticación
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: NotificationPayload = await req.json();
    const { type, empresa_id, data, destinatarios, destinatarios_emails } = payload;

    if (!type || !empresa_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, empresa_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SEGURIDAD: Verificar que el usuario es admin de la empresa solicitada
    const { data: empleadoData, error: empleadoError } = await supabase
      .from('empleados')
      .select('id, empresa_id, es_admin')
      .eq('auth_user_id', user.id)
      .single();

    if (empleadoError || !empleadoData) {
      return new Response(
        JSON.stringify({ error: 'Usuario no encontrado en el sistema' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que pertenece a la empresa y es admin
    if (empleadoData.empresa_id !== empresa_id) {
      return new Response(
        JSON.stringify({ error: 'No tienes permiso para enviar notificaciones a esta empresa' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!empleadoData.es_admin) {
      return new Response(
        JSON.stringify({ error: 'Solo los administradores pueden enviar notificaciones' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener datos de la empresa para los templates
    const { data: empresaData } = await supabase
      .from('empresas')
      .select('id, nombre, dominio')
      .eq('id', empresa_id)
      .single();

    // Caso especial: invitacion_empleado (enviar a emails específicos)
    if (type === 'invitacion_empleado' && destinatarios_emails && destinatarios_emails.length > 0) {
      const template = EMAIL_TEMPLATES.invitacion_empleado;
      const results = [];

      for (const email of destinatarios_emails) {
        try {
          const subject = template.subject(data, empresaData);
          const html = template.html(data, { nombre: data.nombre, email }, empresaData);
          await sendEmail(email, subject, html, resendApiKey);
          results.push({ email, success: true });
        } catch (error) {
          results.push({ email, success: false, error: error.message });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Invitations sent',
          sent: successful,
          failed: failed,
          details: results
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtener colaboradores de la empresa (ya validada)
    let query = supabase
      .from('empleados')
      .select('id, nombre, email')
      .eq('empresa_id', empresa_id)
      .eq('estado', 'Activo');

    if (destinatarios && destinatarios.length > 0) {
      query = query.in('id', destinatarios);
    }

    const { data: empleados, error: empleadosError } = await query;

    if (empleadosError) {
      return new Response(
        JSON.stringify({ error: 'Error fetching employees', details: empleadosError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!empleados || empleados.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No employees to notify', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const template = EMAIL_TEMPLATES[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: `Unknown notification type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enviar emails en paralelo (con límite para evitar rate limiting)
    const results = [];
    const batchSize = 10;

    for (let i = 0; i < empleados.length; i += batchSize) {
      const batch = empleados.slice(i, i + batchSize);
      const batchPromises = batch.map(async (empleado) => {
        if (!empleado.email) return { empleado_id: empleado.id, success: false, error: 'No email' };

        try {
          const subject = template.subject(data);
          const html = template.html(data, empleado);
          await sendEmail(empleado.email, subject, html, resendApiKey);
          return { empleado_id: empleado.id, success: true };
        } catch (error) {
          return { empleado_id: empleado.id, success: false, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < empleados.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notifications sent`,
        sent: successful,
        failed: failed,
        details: results
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-notification-email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
