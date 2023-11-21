/*
  Warnings:

  - Added the required column `createdAt` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `endereco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `endereco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `pedido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario_id` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "endereco" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "pedido" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "produto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usuario_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto" ADD CONSTRAINT "produto_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
