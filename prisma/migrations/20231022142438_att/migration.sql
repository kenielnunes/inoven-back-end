/*
  Warnings:

  - You are about to drop the column `requestItemId` on the `categoria` table. All the data in the column will be lost.
  - You are about to drop the column `requestItemId` on the `variacao` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `categoria_requestItemId_fkey` ON `categoria`;

-- DropIndex
DROP INDEX `variacao_requestItemId_fkey` ON `variacao`;

-- AlterTable
ALTER TABLE `categoria` DROP COLUMN `requestItemId`;

-- AlterTable
ALTER TABLE `variacao` DROP COLUMN `requestItemId`;
