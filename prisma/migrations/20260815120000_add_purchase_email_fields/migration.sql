ALTER TABLE "user_payment"
ADD COLUMN "purchaseEmailId" TEXT,
ADD COLUMN "purchaseEmailSentAt" TIMESTAMP(3),
ADD COLUMN "purchaseEmailProcessingAt" TIMESTAMP(3);
