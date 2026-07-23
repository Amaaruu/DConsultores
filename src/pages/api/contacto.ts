import type { APIRoute } from 'astro';
import { validateProjectBriefForm, type ProjectBriefPayload } from '../../utils/validation';

const genericError = { success: false, message: 'No fue posible enviar el mensaje. Inténtalo nuevamente.' };
const successMessage = { success: true, message: 'Recibimos los antecedentes de tu proyecto. Revisaremos la información y nos pondremos en contacto contigo.' };

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  
  if (!contentType.includes('application/x-www-form-urlencoded') && !contentType.includes('multipart/form-data')) {
    return json(genericError, 415);
  }
  
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 32_768) return json(genericError, 413);

  const formData = await request.formData();
  const { valid, payload } = validateProjectBriefForm(formData);

  if (!valid) return json(genericError, 400);

  const turnstileOk = await verifyTurnstile(payload.turnstileToken);
  if (!turnstileOk) return json(genericError, 400);

  const emailOk = await sendContactEmail(payload);
  if (!emailOk) return json(genericError, 502);

  return json(successMessage, 200);
};

async function verifyTurnstile(token = '') {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return import.meta.env.DEV;

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });
  
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

async function sendContactEmail(payload: ProjectBriefPayload) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return import.meta.env.DEV;

  const requestId = crypto.randomUUID();
  const dateStr = new Date().toLocaleString('es-CL');
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #101828; max-width: 600px; margin: 0 auto; border: 1px solid #e4e7ec; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #001c41; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #ffffff; font-size: 22px;">Nuevo Requerimiento de Proyecto</h2>
        <p style="margin: 8px 0 0 0; color: #ff3c00; font-size: 14px; font-weight: bold; text-transform: uppercase;">
          ${payload.serviceType}${payload.serviceTypeOther ? ` (${payload.serviceTypeOther})` : ''}
        </p>
      </div>
      
      <div style="padding: 32px; background-color: #f7f8fa;">
        <h3 style="color: #001c41; font-size: 18px; border-bottom: 2px solid #ff3c00; padding-bottom: 8px; margin-top: 0;">Datos del Cliente</h3>
        <p style="margin: 8px 0;"><strong>Nombre:</strong> ${payload.name}</p>
        <p style="margin: 8px 0;"><strong>Organización:</strong> ${payload.organization}</p>
        <p style="margin: 8px 0;"><strong>Cargo:</strong> ${payload.role || 'No indicado'}</p>
        <p style="margin: 8px 0;"><strong>Correo:</strong> <a href="mailto:${payload.email}" style="color: #175cd3; text-decoration: none;">${payload.email}</a></p>
        <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${payload.phone || 'No indicado'}</p>

        <h3 style="color: #001c41; font-size: 18px; border-bottom: 2px solid #ff3c00; padding-bottom: 8px; margin-top: 32px;">Detalles del Proyecto</h3>
        <p style="margin: 8px 0;"><strong>Objetivo principal:</strong></p>
        <p style="margin: 8px 0; padding: 16px; background-color: #ffffff; border: 1px solid #e4e7ec; border-radius: 6px; line-height: 1.6;">${payload.objective}</p>
        <p style="margin: 16px 0 8px 0;"><strong>Situación actual:</strong> ${payload.currentSituation}</p>
        <p style="margin: 8px 0;"><strong>Plataforma actual:</strong> ${payload.currentPlatform || 'No indicada'}</p>

        <h3 style="color: #001c41; font-size: 18px; border-bottom: 2px solid #ff3c00; padding-bottom: 8px; margin-top: 32px;">Alcance y Migración</h3>
        <p style="margin: 8px 0;"><strong>Tipos de contenido:</strong> ${payload.contentTypes.join(', ')}</p>
        <p style="margin: 8px 0;"><strong>Tipos de usuarios:</strong> ${payload.userTypes.join(', ')}</p>
        <p style="margin: 16px 0 8px 0;"><strong>Requiere migración:</strong> ${payload.migrationRequired}</p>
        <p style="margin: 8px 0;"><strong>Origen de los datos:</strong> ${payload.migrationSource || 'No indicado'}</p>
        <p style="margin: 8px 0;"><strong>Registros aproximados:</strong> ${payload.approximateRecords || 'No indicado'}</p>
        <p style="margin: 8px 0;"><strong>Archivos aproximados:</strong> ${payload.approximateFiles || 'No indicado'}</p>
        <p style="margin: 8px 0;"><strong>Formatos conocidos:</strong> ${payload.knownFormats || 'No indicado'}</p>

        <h3 style="color: #001c41; font-size: 18px; border-bottom: 2px solid #ff3c00; padding-bottom: 8px; margin-top: 32px;">Planificación Comercial</h3>
        <p style="margin: 8px 0;"><strong>Etapa en la que se encuentra:</strong> ${payload.projectStage}</p>
        <p style="margin: 8px 0;"><strong>Plazo objetivo:</strong> ${payload.targetTimeframe || 'No indicado'} ${payload.targetDate ? `(${payload.targetDate})` : ''}</p>
        <p style="margin: 8px 0;"><strong>Presupuesto estimado:</strong> ${payload.estimatedBudget || 'No indicado'}</p>

        <h3 style="color: #001c41; font-size: 18px; border-bottom: 2px solid #ff3c00; padding-bottom: 8px; margin-top: 32px;">Comentarios Adicionales</h3>
        <p style="margin: 8px 0; padding: 16px; background-color: #ffffff; border: 1px solid #e4e7ec; border-radius: 6px; line-height: 1.6;">${payload.additionalComments || 'Sin comentarios adicionales.'}</p>
      </div>
      
      <div style="background-color: #0b315d; padding: 16px; text-align: center; color: #ffffff; font-size: 12px;">
        <p style="margin: 0; color: rgba(255,255,255,0.7);">ID de Solicitud: ${requestId}</p>
        <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.7);">Fecha de envío: ${dateStr}</p>
      </div>
    </div>
  `;

  const textFallback = `Nuevo proyecto web: ${payload.serviceType}\nOrganización: ${payload.organization}\nContacto: ${payload.name} (${payload.email})\nTeléfono: ${payload.phone || 'No indicado'}\nObjetivo: ${payload.objective}\n\nRevisar el formato HTML para ver los detalles completos de la solicitud.`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Nuevo proyecto web: ${payload.organization} - ${payload.serviceType}`,
      html: htmlContent,
      text: textFallback,
      reply_to: payload.email,
    }),
  });

  return response.ok;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}