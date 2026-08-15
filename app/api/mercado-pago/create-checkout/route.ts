import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { buildAutomatedAbandonedCartPayload, getAbandonedCartScheduleDate } from "@/lib/abandoned-cart/automation";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail, sendAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { hashForLog } from "@/lib/abandoned-cart/security";
import mpClient from "@/lib/mercado-pago";
import { offerPricing } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  throw new Error("Falta variavel de ambiente MERCADO_PAGO_ACCESS_TOKEN");
}

if (!process.env.JWT_SECRET) {
  throw new Error("Falta variavel de ambiente JWT_SECRET");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  const body = await req.json();
  const { userEmail, name } = body;
  const customerEmail = typeof userEmail === "string" ? userEmail.trim().toLowerCase() : "";
  const customerName = typeof name === "string" ? name.trim() : "";
  const id = uuidv4();

  const extRef = uuidv4();
  const jwt = await new SignJWT({ ext: extRef })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("5m")
    .sign(secret);

  const origin = req.headers.get("origin") ?? "";

  if (!origin) {
    return NextResponse.json({ error: "Origin nao especificado" }, { status: 400 });
  }

  const successUrl = `${origin}/download?reference=${id}`;
  const failureUrl = `${origin}/pagamento-recusado?status=failure&token=${jwt}&payment_id=${id}`;
  const pendingUrl = `${origin}/pagamento-pendente?status=pending&external_reference=${id}`;

  try {
    const preference = new Preference(mpClient);
    const pref = await preference.create({
      body: {
        external_reference: id,
        metadata: { id },

        ...(customerEmail && {
          payer: {
            email: customerEmail,
            name: customerName || "Cliente Som de Rua",
            surname: "",
          },
        }),

        items: [
          {
            id: String(id),
            description: offerPricing.productDescription,
            title: offerPricing.productName,
            quantity: 1,
            unit_price: offerPricing.currentPrice,
            currency_id: offerPricing.currency,
            category_id: offerPricing.categoryId,
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

    const paymentRecordCreated = await createPendingPaymentRecord({
      id,
      name: customerName || "Cliente Som de Rua",
      email: customerEmail,
      mercadoPagoPreferenceId: pref.id,
      checkoutUrl,
    });

    if (paymentRecordCreated && customerEmail) {
      await scheduleAbandonedCartRecovery({
        paymentId: id,
        customerName,
        customerEmail,
        checkoutUrl,
        origin,
      });
    }

    const response = NextResponse.json({
      preferenceId: pref.id,
      initPoint: checkoutUrl,
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
}): Promise<boolean> {
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

    return true;
  } catch (error) {
    console.log((error as Error).message);
    return false;
  }
}

async function scheduleAbandonedCartRecovery(input: {
  paymentId: string;
  customerName: string;
  customerEmail: string;
  checkoutUrl: string;
  origin: string;
}): Promise<void> {
  const scheduledAt = getAbandonedCartScheduleDate();
  let scheduledEmailId: string | null = null;

  try {
    const abandonedCartPayload = buildAutomatedAbandonedCartPayload({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      checkoutUrl: input.checkoutUrl,
      origin: input.origin,
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
