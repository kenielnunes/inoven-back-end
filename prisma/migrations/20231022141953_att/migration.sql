-- AlterTable
ALTER TABLE `categoria` ADD COLUMN `requestItemId` INTEGER NULL;

-- AlterTable
ALTER TABLE `item_pedido` ADD COLUMN `clientId` INTEGER NULL;

-- AlterTable
ALTER TABLE `variacao` ADD COLUMN `requestItemId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `categoria` ADD CONSTRAINT `categoria_requestItemId_fkey` FOREIGN KEY (`requestItemId`) REFERENCES `item_pedido`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variacao` ADD CONSTRAINT `variacao_requestItemId_fkey` FOREIGN KEY (`requestItemId`) REFERENCES `item_pedido`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_pedido` ADD CONSTRAINT `item_pedido_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `cliente`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
