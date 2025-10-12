/*
  Warnings:

  - The primary key for the `user_payment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "user_payment" DROP CONSTRAINT "user_payment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_payment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_payment_id_seq";
