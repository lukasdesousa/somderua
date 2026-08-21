import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";
import { buildAutomatedAbandonedCartPayload, getAbandonedCartScheduleDate } from "@/lib/abandoned-cart/automation";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail, sendAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { hashForLog } from "@/lib/abandoned-cart/security";
import mpClient from "@/lib/mercado-pago";
import { createPrismaClient } from "@/lib/prisma";
import { digitalProduct, isPackOfferId, packOffers, type PackOfferId } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = createPrismaClient();

export async function POST(req: Request) {
  const mercadoPagoAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!mercadoPagoAccessToken || !jwtSecret) {
    console.error("[MP Checkout] Missing payment environment variables");
    return NextResponse.json({ error: "Configuracao de pagamento indisponivel" }, { status: 500 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: "Body JSON invalido" }, { status: 400 });
  }

  const { userEmail, name } = body;
  const customerEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
  const customerName = typeof name === "string" ? name.trim() : "";
  const offerId = body.offerId;

  if (!isPackOfferId(offerId)) {
    return NextResponse.json({ error: "Oferta invalida" }, { status: 400 });
  }

  const selectedOffer = packOffers[offerId];
  const id = uuidv4();

  const extRef = uuidv4();
  const secret = new TextEncoder().encode(jwtSecret);
  const jwt = await new SignJWT({ ext: extRef })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .sign(secret);

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  const successUrl = `${origin}/download?reference=${id}`;
  const failureUrl = `${origin}/pagamento-recusado?status=failure&token=${jwt}&external_reference=${id}&offer=${selectedOffer.id}`;
  const pendingUrl = `${origin}/pagamento-pendente?status=pending&external_reference=${id}&offer=${selectedOffer.id}`;

  try {
    const preference = new Preference(mpClient);
    const pref = await preference.create({
      body: {
        external_reference: id,
        metadata: {
          id,
          offer_id: selectedOffer.id,
          offer_name: selectedOffer.analyticsName,
          offer_price: selectedOffer.price,
          product_id: selectedOffer.productId,
        },

        ...(customerEmail && {
          payer: {
            email: customerEmail,
            name: customerName || "Cliente Som de Rua",
            surname: "",
          },
        }),

        items: [
          {
            id: digitalProduct.id,
            description: selectedOffer.checkoutDescription,
            title: `${selectedOffer.checkoutTitle} - ${digitalProduct.checkoutName}`,
            quantity: 1,
            unit_price: selectedOffer.price,
            currency_id: digitalProduct.currency,
            category_id: digitalProduct.categoryId,
          },
        ],

        payment_methods: {
          excluded_payment_methods: [{ id: "bolbradesco" }, { id: "pec" }],
          excluded_payment_types: [{ id: "debit_card" }, { id: "credit_card" }],
          installments: 1,
        },

        auto_return: "approved",
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl,
        },
        notification_url: `${origin}/api/mercado-pago/webhook`,
      },
    });

    const checkoutUrl = getCheckoutUrl(pref);

    if (!pref?.id || !checkoutUrl) {
      throw new Error("Erro: preferencia do Mercado Pago nao retornou checkout valido");
    }

    await createPendingPaymentRecord({
      id,
      name: customerName || "Cliente Som de Rua",
      email: customerEmail,
      mercadoPagoPreferenceId: pref.id,
      checkoutUrl,
      offerId: selectedOffer.id,
      offerName: selectedOffer.name,
      offerPriceCents: selectedOffer.priceCents,
      digitalProductId: selectedOffer.productId,
    });

    if (customerEmail) {
      await scheduleAbandonedCartRecovery({
        paymentId: id,
        customerName,
        customerEmail,
        checkoutUrl,
        origin,
        offerId: selectedOffer.id,
      });
    }

    const response = NextResponse.json({
      preferenceId: pref.id,
      initPoint: checkoutUrl,
      offer: {
        id: selectedOffer.id,
        name: selectedOffer.name,
        price: selectedOffer.price,
        productId: selectedOffer.productId,
      },
    });

    response.cookies.set("success_token", jwt, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });
    response.cookies.set("pending_token", jwt, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });
    response.cookies.set("failure_token", jwt, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return response;
  } catch (err) {
    console.error("Erro ao criar preferencia Mercado Pago:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 },
    );
  }
}

async function createPendingPaymentRecord(input: {
  id: string;
  name: string;
  email: string;
  mercadoPagoPreferenceId: string;
  checkoutUrl: string;
  offerId: PackOfferId;
  offerName: string;
  offerPriceCents: number;
  digitalProductId: string;
}): Promise<void> {
  try {
    await prisma.user_payment.create({
      data: {
        id: input.id,
        user_name: input.name,
        email: input.email,
        payment_method: "",
        approved: false,
        mpPaymentId: input.mercadoPagoPreferenceId,
        offerId: input.offerId,
        offerName: input.offerName,
        offerPriceCents: input.offerPriceCents,
        digitalProductId: input.digitalProductId,
        checkoutUrl: input.checkoutUrl,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[MP Checkout] Full payment record create failed; trying legacy fields", error);

    try {
      await prisma.user_payment.create({
        data: {
          id: input.id,
          user_name: input.name,
          email: input.email,
          payment_method: "",
          approved: false,
          mpPaymentId: input.mercadoPagoPreferenceId,
          checkoutUrl: input.checkoutUrl,
          createdAt: new Date(),
        },
      });
    } catch (legacyError) {
      console.error("[MP Checkout] Legacy payment record create failed", legacyError);
      throw legacyError;
    }
  }
}

async function scheduleAbandonedCartRecovery(input: {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  checkoutUrl: string;
  origin: string;
  offerId: PackOfferId;
}): Promise<void> {
  const scheduledAt = getAbandonedCartScheduleDate();
  let scheduledEmailId: string | null = null;

  try {
    const abandonedCartPayload = buildAutomatedAbandonedCartPayload({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      checkoutUrl: input.checkoutUrl,
      origin: input.origin,
      offerId: input.offerId,
    });

    const delivery = await sendAbandonedCartRecoveryEmail(abandonedCartPayload, {
      scheduledAt,
    });
    scheduledEmailId = delivery.messageId;

    if (scheduledEmailId) {
      await prisma.user_payment.update({
        where: { id: input.paymentId },
        data: {
          abandonedCartEmailId: scheduledEmailId,
          abandonedCartEmailScheduledAt: scheduledAt,
        },
      });
    }

    abandonedCartLogger.info("email.scheduled", {
      paymentId: input.paymentId,
      customerHash: hashForLog(input.customerEmail),
      messageId: scheduledEmailId,
      scheduledAt: scheduledAt.toISOString(),
    });
  } catch (error) {
    if (scheduledEmailId) {
      try {
        await cancelAbandonedCartRecoveryEmail(scheduledEmailId);
      } catch (cancelError) {
        abandonedCartLogger.error("email.schedule_cleanup_failed", cancelError, {
          paymentId: input.paymentId,
          messageId: scheduledEmailId,
        });
      }
    }

    abandonedCartLogger.error("email.schedule_failed", error, {
      paymentId: input.paymentId,
      customerHash: hashForLog(input.customerEmail),
    });
  }
}

function getCheckoutUrl(preference: Awaited<ReturnType<Preference["create"]>>): string | null {
  const preferenceWithSandboxUrl = preference as typeof preference & {
    sandbox_init_point?: string | null;
  };

  return preferenceWithSandboxUrl.init_point ?? preferenceWithSandboxUrl.sandbox_init_point ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
