import { Resend } from 'resend';
import { env } from "@/lib/env.mjs";
import { Invitation } from "@prisma/client";

export default class APIResendService {
  static async sendInvitationEmail(invitation: Invitation) {
    const resend = new Resend(env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: `info@${env.DOMAIN}`,
      to: invitation.email,
      subject: "Hola, te invitamos a unirte a nuestro equipo",
      html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2563eb;">Invitación al Equipo</h1>
              <p>¡Hola!</p>
              <p>Has recibido una invitación para unirte a nuestro equipo en PYMEPRO.</p>
              <p>Para comenzar, simplemente haz clic en el botón de abajo:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/choose-company" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Aceptar Invitación
                </a>
              </div>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #6b7280;">http://localhost:3000/choose-company</p>
              <p style="margin-top: 30px; font-size: 0.9em; color: #6b7280;">
                Si no esperabas esta invitación, puedes ignorar este correo.
              </p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 0.8em; color: #6b7280; text-align: center;">
                © ${new Date().getFullYear()} PYMEPRO. Todos los derechos reservados.
              </p>
            </body>
          </html>
        `
    });
    return data;
  }
}


