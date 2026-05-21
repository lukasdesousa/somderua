ALTER TABLE "user_payment"
ADD COLUMN "checkoutUrl" TEXT,
ADD COLUMN "abandonedCartEmailId" TEXT,
ADD COLUMN "abandonedCartEmailScheduledAt" TIMESTAMP(3),
ADD COLUMN "abandonedCartEmailCanceledAt" TIMESTAMP(3);
