/*
  Warnings:

  - The values [CARTAO_DE_CREDITO,BOLETO] on the enum `PaymentMethods` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethods_new" AS ENUM ('CREDITO', 'DEBITO', 'PIX', 'DINHEIRO');
ALTER TABLE "pedido" ALTER COLUMN "forma_pagamento" TYPE "PaymentMethods_new" USING ("forma_pagamento"::text::"PaymentMethods_new");
ALTER TYPE "PaymentMethods" RENAME TO "PaymentMethods_old";
ALTER TYPE "PaymentMethods_new" RENAME TO "PaymentMethods";
DROP TYPE "PaymentMethods_old";
COMMIT;
