ALTER TABLE "user_payment"
ADD COLUMN "abandonedCartEmailSentAt" TIMESTAMP(3),
ADD COLUMN "abandonedCartEmailProcessingAt" TIMESTAMP(3);
