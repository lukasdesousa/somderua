import type { ValidatedAbandonedCartPayload } from "./types";

export type AbandonedCartEmailContent = {
  subject: string;
  html: string;
  text: string;
};

const PACK_NAME = "o seu pack de 16gb";

export function buildAbandonedCartRecoveryEmail(
  payload: ValidatedAbandonedCartPayload,
): AbandonedCartEmailContent {
  const customerFirstName = escapeHtml(payload.customer.firstName);
  const productImageUrl = escapeHtml(payload.product.imageUrl);
  const priceLabel = escapeHtml(payload.product.priceLabel);
  const checkoutUrl = escapeHtml(payload.product.checkoutUrl);
  const offerExpiresIn = escapeHtml(payload.offer.expiresIn);
  const discountLabel = escapeHtml(payload.offer.discountLabel);
  const satisfiedCustomersLabel = escapeHtml(payload.socialProof.satisfiedCustomersLabel);
  const currentYear = new Date().getFullYear();
  const qualities = getQualityItems().map((item) => escapeHtml(item));

  const subject = `${payload.customer.firstName}, o seu pack de 16gb ficou reservado`;
  const previewText = `Volte para finalizar seu pack de 16gb com mais de 5.000 faixas, download imediato e garantia de 7 dias.`;

  return {
    subject,
    text: buildPlainTextEmail(payload),
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
  <style>
    body {
      background-color: #0b0d17;
      font-family: 'Inter', Arial, sans-serif;
      color: #cdd3ff;
      margin: 0;
      padding: 0;
    }
    .preheader {
      display: none;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: linear-gradient(180deg, #0e1120 0%, #0b0d17 100%);
      border: 1px solid rgba(129, 140, 248, 0.16);
      border-radius: 18px;
      padding: 38px 32px;
      text-align: center;
      box-shadow: 0 0 24px rgba(80, 90, 255, 0.14);
    }
    .brand {
      color: #818cf8;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    h1 {
      color: #edf0ff;
      font-size: 28px;
      line-height: 1.16;
      margin: 0 0 14px;
      font-weight: 800;
    }
    p {
      color: #a3a8d4;
      font-size: 15px;
      line-height: 1.65;
      margin: 0 0 22px;
    }
    .lead {
      font-size: 16px;
      color: #cdd3ff;
    }
    .highlight {
      margin: 26px 0;
      padding: 18px;
      border-radius: 16px;
      background: rgba(17, 24, 39, 0.74);
      border: 1px solid rgba(99, 102, 241, 0.24);
      text-align: left;
    }
    .product-row {
      width: 100%;
      border-collapse: collapse;
    }
    .product-image {
      width: 116px;
      border-radius: 14px;
      border: 1px solid rgba(148, 163, 184, 0.24);
      display: block;
      background: #080b14;
    }
    .product-copy {
      padding-left: 18px;
      vertical-align: top;
    }
    .eyebrow {
      color: #a7f3d0;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin: 0 0 8px;
    }
    .product-title {
      color: #ffffff;
      font-size: 19px;
      font-weight: 800;
      line-height: 1.25;
      margin: 0 0 8px;
    }
    .price {
      color: #ffffff;
      font-size: 30px;
      font-weight: 850;
      line-height: 1;
      margin: 0;
    }
    .discount {
      display: inline-block;
      margin-top: 10px;
      padding: 7px 10px;
      border-radius: 999px;
      color: #d1fae5;
      background: rgba(16, 185, 129, 0.14);
      border: 1px solid rgba(52, 211, 153, 0.24);
      font-size: 12px;
      font-weight: 700;
    }
    .button {
      display: inline-block;
      padding: 15px 30px;
      font-weight: 800;
      text-decoration: none;
      border-radius: 12px;
      background: linear-gradient(90deg, #4f46e5, #6366f1, #818cf8);
      color: #ffffff;
      box-shadow: 0 4px 22px rgba(99, 102, 241, 0.34);
    }
    .timer {
      display: inline-block;
      margin: 6px 0 22px;
      padding: 10px 14px;
      border-radius: 12px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(52, 211, 153, 0.26);
      color: #bbf7d0;
      font-size: 14px;
      font-weight: 800;
    }
    .quality {
      margin: 28px 0 4px;
      padding: 0;
      list-style: none;
      text-align: left;
    }
    .quality li {
      margin: 0 0 11px;
      padding: 14px 15px;
      border-radius: 12px;
      background: rgba(99, 102, 241, 0.08);
      border: 1px solid rgba(129, 140, 248, 0.16);
      color: #dbe3ff;
      font-size: 14px;
      line-height: 1.5;
    }
    .proof {
      margin: 26px 0 0;
      padding: 18px;
      border-radius: 16px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(52, 211, 153, 0.18);
    }
    .proof strong {
      color: #e8fff3;
    }
    .divider {
      width: 60%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #3c3f6b, transparent);
      margin: 28px auto;
    }
    .footer {
      color: #767ba3;
      font-size: 12px;
      line-height: 1.6;
      margin: 0;
    }
    @media only screen and (max-width: 640px) {
      .container {
        margin: 0 auto;
        border-radius: 0;
        padding: 30px 20px;
      }
      h1 {
        font-size: 25px;
      }
      .product-image {
        width: 96px;
      }
      .product-copy {
        padding-left: 14px;
      }
      .price {
        font-size: 26px;
      }
      .button {
        display: block;
      }
    }
  </style>
</head>
<body>
  <div class="preheader">${escapeHtml(previewText)}</div>
  <div class="container">
    <div class="brand">Som de Rua</div>

    <h1>${customerFirstName}, deixei ${PACK_NAME} separado para você.</h1>

    <p class="lead">
      Vi que você chegou até o checkout e talvez tenha deixado para terminar depois.
      Sem pressão: o seu link ainda está aqui, com o pack completo pronto para baixar.
    </p>

    <div class="highlight">
      <table class="product-row" role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td width="116">
            <img class="product-image" src="${productImageUrl}" width="116" alt="Pack Som de Rua 16GB" />
          </td>
          <td class="product-copy">
            <p class="eyebrow">Pack reservado</p>
            <p class="product-title">Pack Som de Rua 16GB</p>
            <p style="margin:0 0 8px;color:#a3a8d4;font-size:14px;line-height:1.5;">
              Mais de 5.000 faixas atualizadas para tocar no carro, celular e pen drive.
            </p>
            <p class="price">${priceLabel}</p>
            <span class="discount">${discountLabel}</span>
          </td>
        </tr>
      </table>
    </div>

    <p>
      O que você estava prestes a liberar não é só um arquivo: é um repertório organizado,
      sem músicas repetidas, com grave ajustado para paredão e pronto para tocar em minutos.
    </p>

    <div class="timer">
      Condição do carrinho ativa por mais ${offerExpiresIn}
    </div>

    <a href="${checkoutUrl}" class="button">Voltar e finalizar meu pack</a>

    <ul class="quality">
      ${renderQualityItems(qualities)}
    </ul>

    <div class="proof">
      <p style="margin:0;color:#cdd3ff;">
        <strong>+${satisfiedCustomersLabel} clientes</strong> já baixaram o Som de Rua.
        Tem gente usando no carro, no paredão e na caixa de som porque o pack já vem pronto para tocar.
      </p>
    </div>

    <div class="divider"></div>

    <p class="footer">
      © ${currentYear} Som de Rua<br/>
      Você recebeu este e-mail porque começou uma compra em nosso site.
    </p>
  </div>
</body>
</html>`,
  };
}

function getQualityItems(): string[] {
  return [
    "Download imediato após a confirmação do pagamento.",
    "Funciona no celular, no carro e no pen drive.",
    "Mais de 5.000 faixas atualizadas para som automotivo e paredão.",
    "Repertório organizado para tocar por horas sem repetir as mesmas músicas.",
    "Garantia de 7 dias: se não gostar, devolvemos 100% do seu dinheiro.",
  ];
}

function renderQualityItems(items: string[]): string {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function buildPlainTextEmail(payload: ValidatedAbandonedCartPayload): string {
  return `Olá, ${payload.customer.firstName}.

Deixei o seu pack de 16gb separado para você.

Você chegou até o checkout, mas talvez tenha deixado para terminar depois. O link ainda está aqui:
${payload.product.checkoutUrl}

O que vem no pack:
- Mais de 5.000 faixas atualizadas
- Download imediato após a confirmação do pagamento
- Funciona no celular, carro e pen drive
- Sem músicas repetidas, com repertório organizado
- Grave ajustado para paredão e som automotivo
- Garantia de 7 dias

Preço do carrinho: ${payload.product.priceLabel}
Condição ativa por mais: ${payload.offer.expiresIn}

+${payload.socialProof.satisfiedCustomersLabel} clientes já baixaram o Som de Rua.

Voltar e finalizar o seu pack:
${payload.product.checkoutUrl}

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
