-- CreateTable
CREATE TABLE "user_payment" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT,
    "email" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "payment_method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_payment_pkey" PRIMARY KEY ("id")
);
