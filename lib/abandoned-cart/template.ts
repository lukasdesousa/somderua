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
  const offerExpiresIn = escapeHtml(payload.offer.expiresIn);
  const discountLabel = escapeHtml(payload.offer.discountLabel);
  const satisfiedCustomersLabel = escapeHtml(payload.socialProof.satisfiedCustomersLabel);
  const benefits = payload.benefits.map((benefit) => escapeHtml(benefit));
  const currentYear = new Date().getFullYear();

  const subject = `${payload.customer.firstName}, seu ${payload.product.name} ainda está reservado`;
  const previewText = `A oferta do seu carrinho expira em ${payload.offer.expiresIn}. Finalize agora antes que essa condição saia do ar.`;

  return {
    subject,
    text: buildPlainTextEmail(payload),
    html: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
    <title>${escapeHtml(subject)}</title>
    <style>
      @media only screen and (max-width: 640px) {
        .container { width: 100% !important; }
        .content { padding: 28px 18px !important; }
        .hero-title { font-size: 30px !important; line-height: 1.12 !important; }
        .stack { display: block !important; width: 100% !important; }
        .product-image { width: 100% !important; max-width: 280px !important; margin: 0 auto 22px !important; }
        .mobile-center { text-align: center !important; }
        .cta { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .benefit-card { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#070a12;color:#f8fafc;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(previewText)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070a12;margin:0;padding:0;">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" class="container" width="640" cellspacing="0" cellpadding="0" style="width:640px;max-width:640px;background:#0d1321;border:1px solid #1f2a44;border-radius:24px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,0.42);">
            <tr>
              <td style="padding:0;background:linear-gradient(135deg,#111827 0%,#16213d 48%,#0f172a 100%);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="content" style="padding:30px 34px 18px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="mobile-center" style="font-size:22px;font-weight:800;letter-spacing:0;color:#ffffff;">
                            Som de Rua
                          </td>
                          <td class="mobile-center" align="right" style="font-size:12px;font-weight:700;color:#a7f3d0;text-transform:uppercase;letter-spacing:1.4px;">
                            Compra segura
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="content" style="padding:22px 34px 34px;">
                      <div style="display:inline-block;padding:8px 12px;border:1px solid rgba(52,211,153,0.36);border-radius:999px;background:rgba(16,185,129,0.12);color:#bbf7d0;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;">
                        ${discountLabel}
                      </div>
                      <h1 class="hero-title" style="margin:18px 0 12px;font-size:38px;line-height:1.08;font-weight:900;color:#ffffff;letter-spacing:0;">
                        Seu carrinho ainda está esperando por você.
                      </h1>
                      <p style="margin:0;font-size:17px;line-height:1.65;color:#cbd5e1;">
                        ${customerFirstName}, você estava a um passo de liberar o ${productName}. A condição especial foi reservada para o seu carrinho, mas ela expira em breve.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content" style="padding:0 34px 30px;background:#0d1321;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:-12px;background:#111827;border:1px solid #263449;border-radius:20px;">
                  <tr>
                    <td style="padding:22px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td class="stack" width="190" valign="top" style="width:190px;">
                            <img class="product-image" src="${productImageUrl}" width="170" alt="${productName}" style="display:block;width:170px;max-width:170px;border-radius:18px;border:1px solid #334155;background:#020617;object-fit:cover;" />
                          </td>
                          <td class="stack mobile-center" valign="top" style="padding-left:18px;">
                            <p style="margin:0 0 8px;color:#93c5fd;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.3px;">
                              Produto reservado
                            </p>
                            <h2 style="margin:0 0 10px;color:#ffffff;font-size:24px;line-height:1.2;font-weight:850;">
                              ${productName}
                            </h2>
                            <p style="margin:0 0 14px;color:#94a3b8;font-size:14px;line-height:1.6;">
                              Repertório pronto para colocar seu som para tocar hoje, sem perder tempo procurando faixa por faixa.
                            </p>
                            <div style="display:inline-block;padding:12px 14px;border-radius:14px;background:rgba(15,23,42,0.92);border:1px solid #334155;">
                              <span style="display:block;color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Preço do carrinho</span>
                              <strong style="display:block;margin-top:2px;color:#ffffff;font-size:30px;line-height:1;font-weight:900;">${priceLabel}</strong>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content" style="padding:0 34px 32px;background:#0d1321;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#07111f;border:1px solid rgba(52,211,153,0.34);border-radius:20px;">
                  <tr>
                    <td align="center" style="padding:24px 20px;">
                      <p style="margin:0;color:#a7f3d0;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;">
                        Tempo restante da oferta
                      </p>
                      <div style="margin:12px auto 14px;display:inline-block;padding:12px 18px;border-radius:16px;background:#10b981;color:#04111d;font-size:26px;line-height:1;font-weight:900;">
                        ${offerExpiresIn}
                      </div>
                      <p style="margin:0 auto 20px;max-width:440px;color:#cbd5e1;font-size:15px;line-height:1.65;">
                        Não deixe essa oferta escapar. Quando o prazo acabar, o preço e a disponibilidade desta condição podem mudar sem aviso.
                      </p>
                      <a class="cta" href="${checkoutUrl}" target="_blank" style="display:inline-block;padding:16px 28px;border-radius:14px;background:#4f46e5;color:#ffffff;text-decoration:none;font-size:16px;font-weight:900;box-shadow:0 14px 34px rgba(79,70,229,0.38);">
                        Finalizar Compra
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="content" style="padding:0 34px 30px;background:#0d1321;">
                <h3 style="margin:0 0 14px;color:#ffffff;font-size:21px;line-height:1.3;font-weight:850;">
                  Por que vale concluir agora
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${renderBenefitRows(benefits)}
                </table>
              </td>
            </tr>

            <tr>
              <td class="content" style="padding:0 34px 34px;background:#0d1321;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border-radius:20px;">
                  <tr>
                    <td style="padding:26px 24px;">
                      <p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:1.4px;">
                        Prova social real
                      </p>
                      <h3 style="margin:0;color:#0f172a;font-size:25px;line-height:1.2;font-weight:900;">
                        +${satisfiedCustomersLabel} clientes satisfeitos já compraram.
                      </h3>
                      <p style="margin:12px 0 0;color:#475569;font-size:15px;line-height:1.65;">
                        Gente que queria praticidade, repertório atualizado e som pronto para tocar sem complicação. O seu carrinho está no mesmo caminho.
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
                        <tr>
                          <td class="benefit-card" width="33.33%" style="padding-right:8px;">
                            <div style="padding:12px;border-radius:14px;background:#e0f2fe;color:#075985;font-size:13px;font-weight:800;text-align:center;">
                              Download imediato
                            </div>
                          </td>
                          <td class="benefit-card" width="33.33%" style="padding:0 4px;">
                            <div style="padding:12px;border-radius:14px;background:#dcfce7;color:#166534;font-size:13px;font-weight:800;text-align:center;">
                              Garantia de 7 dias
                            </div>
                          </td>
                          <td class="benefit-card" width="33.33%" style="padding-left:8px;">
                            <div style="padding:12px;border-radius:14px;background:#eef2ff;color:#3730a3;font-size:13px;font-weight:800;text-align:center;">
                              Pagamento protegido
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:28px 30px;background:#090e19;border-top:1px solid #1f2a44;">
                <p style="margin:0 0 10px;color:#cbd5e1;font-size:14px;line-height:1.6;">
                  Seu acesso fica a um clique. Finalize agora e coloque o Som de Rua para tocar ainda hoje.
                </p>
                <a href="${checkoutUrl}" target="_blank" style="color:#93c5fd;font-size:14px;font-weight:800;text-decoration:none;">
                  Voltar para o checkout
                </a>
                <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6;">
                  © ${currentYear} Som de Rua. Você recebeu este e-mail porque iniciou uma compra em nosso site.
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

function renderBenefitRows(benefits: string[]): string {
  const rows: string[] = [];

  for (let index = 0; index < benefits.length; index += 2) {
    rows.push(`
      <tr>
        ${renderBenefitCell(benefits[index])}
        ${renderBenefitCell(benefits[index + 1])}
      </tr>
    `);
  }

  return rows.join("");
}

function renderBenefitCell(benefit?: string): string {
  if (!benefit) {
    return `<td class="benefit-card" width="50%" style="padding:0 0 12px 0;"></td>`;
  }

  return `
    <td class="benefit-card" width="50%" valign="top" style="padding:0 10px 12px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111827;border:1px solid #263449;border-radius:16px;">
        <tr>
          <td style="padding:16px;color:#dbeafe;font-size:14px;line-height:1.55;font-weight:700;">
            ${benefit}
          </td>
        </tr>
      </table>
    </td>
  `;
}

function buildPlainTextEmail(payload: ValidatedAbandonedCartPayload): string {
  const benefits = payload.benefits.map((benefit) => `- ${benefit}`).join("\n");

  return `Olá, ${payload.customer.firstName}.

Seu carrinho do Som de Rua ainda está reservado.

Produto: ${payload.product.name}
Preço do carrinho: ${payload.product.priceLabel}
Oferta expira em: ${payload.offer.expiresIn}

Não deixe essa oferta escapar. Finalize sua compra aqui:
${payload.product.checkoutUrl}

Por que concluir agora:
${benefits}

+${payload.socialProof.satisfiedCustomersLabel} clientes satisfeitos já compraram.

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
