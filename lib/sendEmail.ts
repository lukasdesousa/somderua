import "server-only";

import crypto from "crypto";
import { EmailDeliveryError } from "@/lib/abandoned-cart/errors";
import { getResendClient } from "@/lib/abandoned-cart/mailer";
import { siteConfig } from "@/lib/seo/config";

const DEFAULT_FROM_EMAIL = "Som de Rua <pack@somderua.com.br>";

type PurchaseEmailDeliveryResult = {
  provider: "resend";
  messageId: string | null;
};

/**
 * Envia o e-mail de agradecimento da compra com o link da area de download.
 */
export async function sendPurchaseEmail(to: string, reference: string): Promise<PurchaseEmailDeliveryResult> {
  const recipient = to.trim().toLowerCase();

  if (!recipient) {
    throw new EmailDeliveryError("Missing purchase email recipient", "resend");
  }

  const downloadUrl = getDownloadUrl(reference);
  const idempotencyKey = createPurchaseEmailIdempotencyKey(recipient, reference);
  const text = `Obrigado pela sua compra!

Seu pack de musicas ja esta pronto para download.
Acesse: ${downloadUrl}

Som de Rua`;

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
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
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
      <h1>Obrigado pela sua compra!</h1>
      <p>
        Seu pack de musicas ja esta pronto para o download.<br/>
        Clique no botao abaixo para acessar seu pack e baixar o conteudo liberado pela compra.
      </p>

      <a href="${downloadUrl}" class="button">Baixar Agora</a>

      <div class="divider"></div>

      <p class="footer">
        &copy; ${new Date().getFullYear()} Som de Rua<br/>
        Os melhores packs de musicas para pen-drives.
      </p>
    </div>
  </body>
  </html>
  `;

  try {
    const response = await getResendClient().emails.send(
      {
        from: getFromEmail(),
        to: recipient,
        subject: "Seu pack de musicas esta pronto para download!",
        html,
        text,
        tags: [
          { name: "flow", value: "purchase" },
          { name: "product", value: "som-de-rua" },
        ],
      },
      { idempotencyKey },
    );

    if (response.error) {
      throw new EmailDeliveryError(response.error.message, "resend");
    }

    return {
      provider: "resend",
      messageId: response.data?.id ?? null,
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

function getDownloadUrl(reference: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || siteConfig.url;
  const url = new URL("/download", baseUrl);
  url.searchParams.set("reference", reference);
  return url.toString();
}

function getFromEmail(): string {
  return process.env.PURCHASE_EMAIL_FROM?.trim()
    || process.env.ABANDONED_CART_FROM_EMAIL?.trim()
    || DEFAULT_FROM_EMAIL;
}

function createPurchaseEmailIdempotencyKey(email: string, reference: string): string {
  return crypto.createHash("sha256").update(`purchase|${email}|${reference}`).digest("hex");
}
