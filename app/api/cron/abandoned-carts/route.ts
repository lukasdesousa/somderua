import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ABANDONED_CART_DELAY_MINUTES, buildAutomatedAbandonedCartPayload } from "@/lib/abandoned-cart/automation";
import { UnauthorizedRequestError } from "@/lib/abandoned-cart/errors";
import { abandonedCartLogger } from "@/lib/abandoned-cart/logger";
import { cancelAbandonedCartRecoveryEmail, sendAbandonedCartRecoveryEmail } from "@/lib/abandoned-cart/mailer";
import { hashForLog, safeCompare } from "@/lib/abandoned-cart/security";
import { siteConfig } from "@/lib/seo/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();
const DEFAULT_BATCH_SIZE = 100;
const LOCK_TIMEOUT_MINUTES = 30;

type CronResult = {
  checked: number;
  sent: number;
  skipped: number;
  failed: number;
};

type PendingAbandonedCartPayment = {
  id: string;
  user_name: string | null;
  email: string | null;
  checkoutUrl: string | null;
  abandonedCartEmailId: string | null;
  abandonedCartEmailScheduledAt: Date | null;
  abandonedCartEmailCanceledAt: Date | null;
};

export async function GET(request: Request) {
  const startedAt = Date.now();

  try {
    assertCronRequestIsAuthorized(request);

    const result = await processAbandonedCartRecoveryBatch(request);

    abandonedCartLogger.info("cron.completed", {
      durationMs: Date.now() - startedAt,
      checked: result.checked,
      sent: result.sent,
      skipped: result.skipped,
      failed: result.failed,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof UnauthorizedRequestError) {
      abandonedCartLogger.warn("cron.unauthorized");

      return NextResponse.json(
        { success: false, error: "Unauthorized cron request" },
        { status: 401 },
      );
    }

    abandonedCartLogger.error("cron.failed", error, {
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json(
      { success: false, error: "Failed to process abandoned carts" },
      { status: 500 },
    );
  }
}

async function processAbandonedCartRecoveryBatch(request: Request): Promise<CronResult> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - ABANDONED_CART_DELAY_MINUTES * 60 * 1000);
  const lockExpiresAt = new Date(now.getTime() - LOCK_TIMEOUT_MINUTES * 60 * 1000);
  const payments = await findPendingAbandonedCartPayments(cutoff, lockExpiresAt);
  const result: CronResult = {
    checked: payments.length,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  for (const payment of payments) {
    const locked = await lockPaymentForAbandonedCartEmail(payment.id, now, lockExpiresAt);

    if (!locked) {
      result.skipped += 1;
      continue;
    }

    try {
      const currentPayment = await findLockedPaymentIfStillEligible(payment.id);

      if (!currentPayment) {
        result.skipped += 1;
        await releasePaymentLock(payment.id);
        continue;
      }

      await sendRecoveryEmailForPayment(currentPayment, getPublicOrigin(request));
      result.sent += 1;
    } catch (error) {
      result.failed += 1;
      await releasePaymentLock(payment.id);
      abandonedCartLogger.error("cron.email_failed", error, {
        paymentId: payment.id,
        customerHash: payment.email ? hashForLog(payment.email) : undefined,
      });
    }
  }

  return result;
}

async function findPendingAbandonedCartPayments(
  cutoff: Date,
  lockExpiresAt: Date,
): Promise<PendingAbandonedCartPayment[]> {
  return prisma.user_payment.findMany({
    where: {
      approved: false,
      email: { not: null },
      checkoutUrl: { not: null },
      abandonedCartEmailSentAt: null,
      createdAt: { lte: cutoff },
      OR: [
        { abandonedCartEmailProcessingAt: null },
        { abandonedCartEmailProcessingAt: { lte: lockExpiresAt } },
      ],
    },
    orderBy: { createdAt: "asc" },
    take: getBatchSize(),
    select: {
      id: true,
      user_name: true,
      email: true,
      checkoutUrl: true,
      abandonedCartEmailId: true,
      abandonedCartEmailScheduledAt: true,
      abandonedCartEmailCanceledAt: true,
    },
  });
}

async function findLockedPaymentIfStillEligible(
  paymentId: string,
): Promise<PendingAbandonedCartPayment | null> {
  return prisma.user_payment.findFirst({
    where: {
      id: paymentId,
      approved: false,
      email: { not: null },
      checkoutUrl: { not: null },
      abandonedCartEmailSentAt: null,
      abandonedCartEmailProcessingAt: { not: null },
    },
    select: {
      id: true,
      user_name: true,
      email: true,
      checkoutUrl: true,
      abandonedCartEmailId: true,
      abandonedCartEmailScheduledAt: true,
      abandonedCartEmailCanceledAt: true,
    },
  });
}

async function lockPaymentForAbandonedCartEmail(
  paymentId: string,
  lockedAt: Date,
  lockExpiresAt: Date,
): Promise<boolean> {
  const result = await prisma.user_payment.updateMany({
    where: {
      id: paymentId,
      approved: false,
      abandonedCartEmailSentAt: null,
      OR: [
        { abandonedCartEmailProcessingAt: null },
        { abandonedCartEmailProcessingAt: { lte: lockExpiresAt } },
      ],
    },
    data: {
      abandonedCartEmailProcessingAt: lockedAt,
    },
  });

  return result.count === 1;
}

async function sendRecoveryEmailForPayment(
  payment: PendingAbandonedCartPayment,
  origin: string,
): Promise<void> {
  if (!payment.email || !payment.checkoutUrl) {
    return;
  }

  await cancelLegacyScheduledEmailIfNeeded(payment);

  const payload = buildAutomatedAbandonedCartPayload({
    customerName: payment.user_name,
    customerEmail: payment.email,
    checkoutUrl: payment.checkoutUrl,
    origin,
  });
  const delivery = await sendAbandonedCartRecoveryEmail(payload);

  await prisma.user_payment.update({
    where: { id: payment.id },
    data: {
      abandonedCartEmailId: delivery.messageId,
      abandonedCartEmailSentAt: new Date(),
      abandonedCartEmailProcessingAt: null,
    },
  });

  abandonedCartLogger.info("cron.email_sent", {
    paymentId: payment.id,
    customerHash: hashForLog(payment.email),
    messageId: delivery.messageId,
  });
}

async function cancelLegacyScheduledEmailIfNeeded(payment: PendingAbandonedCartPayment): Promise<void> {
  if (
    !payment.abandonedCartEmailId ||
    !payment.abandonedCartEmailScheduledAt ||
    payment.abandonedCartEmailCanceledAt
  ) {
    return;
  }

  try {
    await cancelAbandonedCartRecoveryEmail(payment.abandonedCartEmailId);
    await prisma.user_payment.update({
      where: { id: payment.id },
      data: {
        abandonedCartEmailCanceledAt: new Date(),
      },
    });
  } catch (error) {
    abandonedCartLogger.error("cron.legacy_schedule_cancel_failed", error, {
      paymentId: payment.id,
      messageId: payment.abandonedCartEmailId,
    });
  }
}

async function releasePaymentLock(paymentId: string): Promise<void> {
  await prisma.user_payment.update({
    where: { id: paymentId },
    data: {
      abandonedCartEmailProcessingAt: null,
    },
  });
}

function assertCronRequestIsAuthorized(request: Request): void {
  const cronSecret = process.env.CRON_SECRET?.trim();

  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      const userAgent = request.headers.get("user-agent") ?? "";

      if (!userAgent.includes("vercel-cron/1.0")) {
        throw new UnauthorizedRequestError();
      }

      abandonedCartLogger.warn("cron.secret_missing_production_using_vercel_user_agent");
    }

    return;
  }

  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!token || !safeCompare(cronSecret, token)) {
    throw new UnauthorizedRequestError();
  }
}

function getPublicOrigin(request: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

  if (configuredUrl) {
    return configuredUrl;
  }

  return new URL(request.url).origin;
}

function getBatchSize(): number {
  const parsed = Number(process.env.ABANDONED_CART_CRON_BATCH_SIZE);

  if (!Number.isInteger(parsed)) {
    return DEFAULT_BATCH_SIZE;
  }

  return Math.min(Math.max(parsed, 1), 100);
}
