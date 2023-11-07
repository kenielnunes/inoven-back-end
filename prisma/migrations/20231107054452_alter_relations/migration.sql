/*
  Warnings:

  - You are about to drop the column `clienteId` on the `endereco` table. All the data in the column will be lost.
  - You are about to drop the column `imagem` on the `item_pedido` table. All the data in the column will be lost.
  - You are about to drop the column `pedidoId` on the `item_pedido` table. All the data in the column will be lost.
  - You are about to drop the column `produtoId` on the `item_pedido` table. All the data in the column will be lost.
  - You are about to drop the column `valorUnitario` on the `item_pedido` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `dataEntrega` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `dataPedido` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `formaPagamento` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `modalidadeEntrega` on the `pedido` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `variacaoId` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `tipoUsuario` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cliente_id]` on the table `endereco` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cliente_id` to the `endereco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedido_id` to the `item_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produto_id` to the `item_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_unitario` to the `item_pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cliente_id` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data_entrega` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forma_pagamento` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modalidade_entrega` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria_id` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variacao_id` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel_acesso` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "endereco" DROP CONSTRAINT "endereco_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "item_pedido" DROP CONSTRAINT "item_pedido_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "item_pedido" DROP CONSTRAINT "item_pedido_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "pedido" DROP CONSTRAINT "pedido_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "produto" DROP CONSTRAINT "produto_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "produto" DROP CONSTRAINT "produto_variacaoId_fkey";

-- DropIndex
DROP INDEX "endereco_clienteId_key";

-- DropIndex
DROP INDEX "produto_categoriaId_key";

-- DropIndex
DROP INDEX "produto_variacaoId_key";

-- AlterTable
ALTER TABLE "endereco" DROP COLUMN "clienteId",
ADD COLUMN     "cliente_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "item_pedido" DROP COLUMN "imagem",
DROP COLUMN "pedidoId",
DROP COLUMN "produtoId",
DROP COLUMN "valorUnitario",
ADD COLUMN     "pedido_id" INTEGER NOT NULL,
ADD COLUMN     "produto_id" INTEGER NOT NULL,
ADD COLUMN     "valor_unitario" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "pedido" DROP COLUMN "clienteId",
DROP COLUMN "dataEntrega",
DROP COLUMN "dataPedido",
DROP COLUMN "formaPagamento",
DROP COLUMN "modalidadeEntrega",
ADD COLUMN     "cliente_id" INTEGER NOT NULL,
ADD COLUMN     "data_entrega" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "data_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "forma_pagamento" "PaymentMethods" NOT NULL,
ADD COLUMN     "modalidade_entrega" "DeliveryModality" NOT NULL;

-- AlterTable
ALTER TABLE "produto" DROP COLUMN "categoriaId",
DROP COLUMN "variacaoId",
ADD COLUMN     "categoria_id" INTEGER NOT NULL,
ADD COLUMN     "variacao_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "tipoUsuario",
ADD COLUMN     "nivel_acesso" "UserType" NOT NULL;

-- CreateTable
CREATE TABLE "imagem_produto" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "produto_id" INTEGER NOT NULL,

    CONSTRAINT "imagem_produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "endereco_cliente_id_key" ON "endereco"("cliente_id");

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagem_produto" ADD CONSTRAINT "imagem_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_variacao_id_fkey" FOREIGN KEY ("variacao_id") REFERENCES "variacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
