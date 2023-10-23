/*
  Warnings:

  - A unique constraint covering the columns `[produtoId]` on the table `item_pedido` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoriaId]` on the table `produto` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[variacaoId]` on the table `produto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `item_pedido_produtoId_key` ON `item_pedido`(`produtoId`);

-- CreateIndex
CREATE UNIQUE INDEX `produto_categoriaId_key` ON `produto`(`categoriaId`);

-- CreateIndex
CREATE UNIQUE INDEX `produto_variacaoId_key` ON `produto`(`variacaoId`);
