/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `categories` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
ALTER COLUMN "id" SET DATA TYPE SERIAL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
