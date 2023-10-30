/*
  Warnings:

  - A unique constraint covering the columns `[clienteId]` on the table `endereco` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "endereco_clienteId_key" ON "endereco"("clienteId");
