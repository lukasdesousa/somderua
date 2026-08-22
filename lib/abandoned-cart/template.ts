import type { ValidatedAbandonedCartPayload } from "./types";

export type AbandonedCartEmailContent = {
  subject: string;
  html: string;
  text: string;
};

export function buildAbandonedCartRecoveryEmail(
  payload: ValidatedAbandonedCartPayload,
): AbandonedCartEmailContent {
  const customerFirstName = escapeHtml(payload.customer.firstName);
  const productName = escapeHtml(payload.product.name);
  const productImageUrl = escapeHtml(payload.product.imageUrl);
  const priceLabel = escapeHtml(payload.product.priceLabel);
  const checkoutUrl = escapeHtml(payload.product.checkoutUrl);
  const offerNote = escapeHtml(payload.offer.expiresIn);
  const discountLabel = escapeHtml(payload.offer.discountLabel);
  const satisfiedCustomersLabel = escapeHtml(payload.socialProof.satisfiedCustomersLabel);
  const currentYear = new Date().getFullYear();
  const subject = `${payload.customer.firstName}, seu checkout Som de Rua continua disponível`;
  const previewText = `Seu ${payload.product.name} continua no checkout. Retome de onde parou.`;

  return {
    subject,
    text: buildPlainTextEmail(payload),
    html: `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(subject)}</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .email-pad { padding-left: 22px !important; padding-right: 22px !important; }
      .email-title { font-size: 29px !important; line-height: 35px !important; }
      .product-image { width: 88px !important; height: auto !important; }
      .product-copy { padding-left: 14px !important; }
      .email-button { display: block !important; text-align: center !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#070a12;color:#dbe4f0;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(previewText)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#070a12;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" class="email-shell" style="width:620px;max-width:620px;background:#0d1320;border:1px solid #202c3d;border-radius:20px;overflow:hidden;">
          <tr><td style="height:5px;background:#818cf8;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td class="email-pad" style="padding:28px 38px 12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="color:#f8fafc;font-size:16px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;">Som de Rua</td>
                  <td align="right" style="color:#8d9bb0;font-size:12px;">Seu checkout foi salvo</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:18px 38px 28px;">
              <p style="margin:0 0 8px;color:#a5b4fc;font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">Continue quando quiser</p>
              <h1 class="email-title" style="margin:0;color:#ffffff;font-size:36px;line-height:42px;font-weight:800;letter-spacing:-0.02em;">${customerFirstName}, seu pack ainda está aqui.</h1>
              <p style="margin:16px 0 0;color:#aebbd0;font-size:16px;line-height:25px;">
                Você chegou até o checkout, mas não concluiu a compra. Salvamos o mesmo link para você continuar sem precisar escolher tudo novamente.
              </p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#111a2a;border:1px solid #26354a;border-radius:16px;">
                <tr>
                  <td width="120" valign="top" style="padding:18px 0 18px 18px;">
                    <img src="${productImageUrl}" width="112" class="product-image" alt="${productName}" style="display:block;width:112px;max-width:100%;height:auto;border:0;border-radius:12px;background:#080b14;" />
                  </td>
                  <td valign="middle" class="product-copy" style="padding:18px;">
                    <p style="margin:0 0 6px;color:#a5b4fc;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">Oferta escolhida</p>
                    <h2 style="margin:0;color:#ffffff;font-size:20px;line-height:26px;">${productName}</h2>
                    <p style="margin:10px 0 0;color:#ffffff;font-size:28px;line-height:32px;font-weight:800;">${priceLabel}</p>
                    <p style="margin:10px 0 0;color:#a7f3d0;font-size:12px;line-height:18px;font-weight:700;">${discountLabel}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td bgcolor="#818cf8" style="border-radius:12px;">
                    <a href="${checkoutUrl}" class="email-button" style="display:inline-block;padding:15px 25px;color:#090b1a;text-decoration:none;font-size:15px;font-weight:800;">Retomar meu checkout&nbsp; →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;color:#718096;font-size:12px;line-height:19px;">${offerNote}</p>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#0a0f19;border:1px solid #202c3d;border-radius:16px;">
                <tr>
                  <td style="padding:22px;">
                    <p style="margin:0 0 15px;color:#ffffff;font-size:15px;font-weight:800;">O que você recebe</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      ${renderBenefitItems(payload.benefits)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:0 38px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#10231f;border:1px solid #245247;border-radius:14px;">
                <tr>
                  <td style="padding:18px;color:#c8f7e6;font-size:14px;line-height:22px;text-align:center;">
                    <strong style="color:#ffffff;">+${satisfiedCustomersLabel} clientes</strong> já escolheram o Som de Rua para organizar o repertório.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="email-pad" style="padding:22px 38px;border-top:1px solid #202c3d;background:#0a0f19;">
              <p style="margin:0;color:#718096;font-size:12px;line-height:19px;text-align:center;">
                © ${currentYear} Som de Rua<br />Você recebeu este e-mail porque iniciou uma compra em nosso site.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

function renderBenefitItems(items: readonly string[]): string {
  return items
    .map((item) => `<tr>
      <td width="28" valign="top" style="padding:0 8px 12px 0;color:#6ee7b7;font-size:16px;font-weight:800;">✓</td>
      <td valign="top" style="padding:0 0 12px;color:#aebbd0;font-size:14px;line-height:21px;">${escapeHtml(item)}</td>
    </tr>`)
    .join("");
}

function buildPlainTextEmail(payload: ValidatedAbandonedCartPayload): string {
  const benefits = payload.benefits.map((benefit) => `- ${benefit}`).join("\n");

  return `Olá, ${payload.customer.firstName}.

Seu checkout do ${payload.product.name} continua disponível.

Oferta escolhida: ${payload.offer.discountLabel}
Preço: ${payload.product.priceLabel}

O que você recebe:
${benefits}

${payload.offer.expiresIn}

RETOMAR MEU CHECKOUT
${payload.product.checkoutUrl}

+${payload.socialProof.satisfiedCustomersLabel} clientes já escolheram o Som de Rua.

Som de Rua`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
