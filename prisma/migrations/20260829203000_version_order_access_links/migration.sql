-- Existing purchase e-mails linked directly by their unguessable order UUID.
-- Preserve those links while requiring signed access tokens for every order
-- created after this migration.
ALTER TABLE "user_payment"
ADD COLUMN "orderAccessVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "user_payment"
ALTER COLUMN "orderAccessVersion" SET DEFAULT 1;
