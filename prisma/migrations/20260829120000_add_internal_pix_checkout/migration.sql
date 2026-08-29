-- Preserve the previous Checkout Pro preference identifier separately from a
-- real Mercado Pago payment identifier before enforcing payment uniqueness.
ALTER TABLE "user_payment"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'CREATED',
ADD COLUMN "statusDetail" TEXT,
ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'MERCADO_PAGO',
ADD COLUMN "checkoutMode" TEXT NOT NULL DEFAULT 'HOSTED',
ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'BRL',
ADD COLUMN "amountCents" INTEGER,
ADD COLUMN "mpPreferenceId" TEXT,
ADD COLUMN "activeCheckoutKey" TEXT,
ADD COLUMN "pixExpiresAt" TIMESTAMP(3),
ADD COLUMN "lastProviderSyncAt" TIMESTAMP(3),
ADD COLUMN "paidAt" TIMESTAMP(3),
ADD COLUMN "fulfilledAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "user_payment"
SET
  "mpPreferenceId" = "mpPaymentId",
  "mpPaymentId" = NULL,
  "amountCents" = "offerPriceCents",
  "status" = CASE WHEN "approved" THEN 'APPROVED' ELSE 'PENDING' END;

CREATE UNIQUE INDEX "user_payment_mpPaymentId_key"
ON "user_payment"("mpPaymentId");

CREATE UNIQUE INDEX "user_payment_mpPreferenceId_key"
ON "user_payment"("mpPreferenceId");

CREATE UNIQUE INDEX "user_payment_activeCheckoutKey_key"
ON "user_payment"("activeCheckoutKey");
