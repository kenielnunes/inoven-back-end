/*
  Warnings:

  - You are about to drop the column `categoria_id` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `variacao_id` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `variacao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `produto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('DOCE', 'SALGADO');

-- DropForeignKey
ALTER TABLE "produto" DROP CONSTRAINT "produto_categoria_id_fkey";

-- DropForeignKey
ALTER TABLE "produto" DROP CONSTRAINT "produto_variacao_id_fkey";

-- AlterTable
ALTER TABLE "produto" DROP COLUMN "categoria_id",
DROP COLUMN "variacao_id",
ADD COLUMN     "categoria" "Category" NOT NULL;

-- DropTable
DROP TABLE "categoria";

-- DropTable
DROP TABLE "variacao";
