'use server';

// lib/sendEmail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um email de agradecimento pela compra, com link de download
 * @param to - Email do destinatário
 * @param reference - Referência única do download
 */
export async function sendPurchaseEmail(to: string, reference: string) {
  const downloadUrl = `https://somderua.com.br/download?reference=${reference}`;

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Obrigado pela sua compra!</title>
    <style>
      body {
        background-color: #0b0d17;
        font-family: 'Inter', Arial, sans-serif;
        color: #cdd3ff;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: linear-gradient(180deg, #0e1120 0%, #0b0d17 100%);
        border-radius: 16px;
        padding: 40px 32px;
        text-align: center;
        box-shadow: 0 0 20px rgba(80, 90, 255, 0.15);
      }
      h1 {
        color: #cfd6ff;
        font-size: 24px;
        margin-bottom: 12px;
      }
      p {
        color: #a3a8d4;
        font-size: 15px;
        line-height: 1.6;
        margin: 0 0 24px;
      }
      .button {
        display: inline-block;
        padding: 14px 28px;
        font-weight: 600;
        text-decoration: none;
        border-radius: 10px;
        background: linear-gradient(90deg, #4f46e5, #6366f1, #818cf8);
        color: #ffffff;
        transition: all 0.25s ease;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
      }
      .button:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5);
      }
      .footer {
        font-size: 13px;
        color: #767ba3;
        margin-top: 32px;
      }
      .divider {
        width: 60%;
        height: 1px;
        background: linear-gradient(90deg, transparent, #3c3f6b, transparent);
        margin: 28px auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🎵 Obrigado pela sua compra!</h1>
      <p>
        Seu pack de músicas já está pronto para o download.<br/>
        Clique no botão abaixo para acessar seu conteúdo exclusivo e curtir o som com qualidade profissional.
      </p>

      <a href="${downloadUrl}" class="button">Baixar Agora</a>

      <div class="divider"></div>

      <p class="footer">
        © ${new Date().getFullYear()} Som de rua<br/>
          Os melhores packs de músicas para pen-drives.
      </p>
    </div>
  </body>
  </html>
  `;

  try {
    const data = await resend.emails.send({
      from: "Som de rua <pack@somderua.com.br>",
      to,
      subject: "🎶 Seu pack de músicas está pronto para download!",
      html,
    });

    return data;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}
