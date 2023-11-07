/*
  Warnings:

  - Added the required column `cidade` to the `endereco` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "endereco" ADD COLUMN     "cidade" TEXT NOT NULL,
ALTER COLUMN "complemento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pedido" ADD COLUMN     "observacao" TEXT;
