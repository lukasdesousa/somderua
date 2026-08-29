import "server-only";

import crypto from "crypto";
import { EmailDeliveryError } from "@/lib/abandoned-cart/errors";
import { getResendClient } from "@/lib/abandoned-cart/mailer";
import { createOrderAccessToken } from "@/lib/payments/access";
import { siteConfig } from "@/lib/seo/config";

const DEFAULT_FROM_EMAIL = "Som de Rua <pack@somderua.com.br>";

type PurchaseEmailDeliveryResult = {
  provider: "resend";
  messageId: string | null;
};

/**
 * Envia o e-mail de agradecimento da compra com os links de download e tutorial.
 */
export async function sendPurchaseEmail(to: string, reference: string): Promise<PurchaseEmailDeliveryResult> {
  const recipient = to.trim().toLowerCase();

  if (!recipient) {
    throw new EmailDeliveryError("Missing purchase email recipient", "resend");
  }

  const orderAccessToken = await createOrderAccessToken(reference);
  const downloadUrl = getDownloadUrl(reference, orderAccessToken);
  const tutorialUrl = getTutorialUrl();
  const idempotencyKey = createPurchaseEmailIdempotencyKey(recipient, reference);
  const currentYear = new Date().getFullYear();
  const downloadUrlHtml = escapeHtml(downloadUrl);
  const tutorialUrlHtml = escapeHtml(tutorialUrl);

  const text = `Compra confirmada!

Seu Pack Som de Rua já está liberado para download.

BAIXAR MEU PACK
${downloadUrl}

Precisa de ajuda para baixar, extrair ou transferir as músicas?
Assista ao tutorial: ${tutorialUrl}

Guarde este e-mail para acessar seu download novamente.

Som de Rua`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Seu Pack Som de Rua está pronto</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .email-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .email-title { font-size: 29px !important; line-height: 35px !important; }
      .email-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#070a12;color:#dbe4f0;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Pagamento aprovado: seu pack e o tutorial já estão disponíveis.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#070a12;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" class="email-shell" style="width:620px;max-width:620px;background:#0d1320;border:1px solid #202c3d;border-radius:20px;overflow:hidden;">
          <tr><td style="height:5px;background:#34d399;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td class="email-pad" style="padding:28px 38px 18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="color:#f8fafc;font-size:16px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">Som de Rua</td>
                  <td align="right">
                    <span style="display:inline-block;padding:7px 11px;border-radius:999px;background:#123c32;color:#a7f3d0;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;">Compra aprovada</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:14px 38px 34px;">
              <h1 class="email-title" style="margin:0;color:#ffffff;font-size:36px;line-height:42px;font-weight:800;letter-spacing:-0.02em;">Seu pack está pronto para tocar.</h1>
              <p style="margin:16px 0 0;color:#aebbd0;font-size:16px;line-height:25px;">
                O pagamento foi confirmado e o conteúdo da sua oferta já está liberado. Use o botão abaixo para acessar a área de download.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0;">
                <tr>
                  <td bgcolor="#34d399" style="border-radius:12px;">
                    <a href="${downloadUrlHtml}" class="email-button" style="display:inline-block;padding:15px 25px;color:#06251d;text-decoration:none;font-size:15px;font-weight:800;">Baixar meu Pack Som de Rua&nbsp; →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:15px 0 0;color:#718096;font-size:12px;line-height:19px;">
                Guarde este e-mail: ele contém seu acesso pessoal ao download.
              </p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#111a2a;border:1px solid #26354a;border-radius:16px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="margin:0 0 6px;color:#818cf8;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">Comece sem dúvidas</p>
                    <h2 style="margin:0;color:#ffffff;font-size:21px;line-height:27px;">Assista ao tutorial completo</h2>
                    <p style="margin:9px 0 18px;color:#9eacc1;font-size:14px;line-height:22px;">
                      Veja como baixar, extrair e transferir as músicas para celular, computador ou pen drive.
                    </p>
                    <a href="${tutorialUrlHtml}" style="display:inline-block;padding:12px 18px;border:1px solid #818cf8;border-radius:10px;color:#c7d2fe;text-decoration:none;font-size:14px;font-weight:800;">Abrir tutorial&nbsp; →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 32px;">
              <p style="margin:0 0 13px;color:#f8fafc;font-size:14px;font-weight:800;">Seu caminho rápido:</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${renderEmailStep("1", "Abra o link e inicie o download.")}
                ${renderEmailStep("2", "Espere o arquivo terminar de baixar.")}
                ${renderEmailStep("3", "Extraia as pastas antes de transferir.")}
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:22px 38px;border-top:1px solid #202c3d;background:#0a0f19;">
              <p style="margin:0;color:#718096;font-size:12px;line-height:19px;text-align:center;">
                © ${currentYear} Som de Rua<br />Packs de músicas organizados para pen drive e carro.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const response = await getResendClient().emails.send(
      {
        from: getFromEmail(),
        to: recipient,
        subject: "Seu Pack Som de Rua está pronto para download",
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

function renderEmailStep(number: string, description: string): string {
  return `<tr>
    <td width="36" valign="top" style="padding:0 10px 10px 0;">
      <span style="display:inline-block;width:26px;height:26px;border-radius:8px;background:#1f3a37;color:#6ee7b7;font-size:13px;font-weight:800;line-height:26px;text-align:center;">${number}</span>
    </td>
    <td valign="top" style="padding:3px 0 10px;color:#9eacc1;font-size:14px;line-height:20px;">${description}</td>
  </tr>`;
}

function getDownloadUrl(reference: string, accessToken: string): string {
  const url = new URL("/api/order-access", getBaseUrl());
  url.searchParams.set("reference", reference);
  url.searchParams.set("access_token", accessToken);
  return url.toString();
}

function getTutorialUrl(): string {
  return new URL("/tutorial", getBaseUrl()).toString();
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim()
    || process.env.SITE_URL?.trim()
    || siteConfig.url;
}

function getFromEmail(): string {
  return process.env.PURCHASE_EMAIL_FROM?.trim()
    || process.env.ABANDONED_CART_FROM_EMAIL?.trim()
    || DEFAULT_FROM_EMAIL;
}

function createPurchaseEmailIdempotencyKey(email: string, reference: string): string {
  return crypto.createHash("sha256").update(`purchase|${email}|${reference}`).digest("hex");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
