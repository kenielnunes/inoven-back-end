-- DropForeignKey
ALTER TABLE "item_pedido" DROP CONSTRAINT "item_pedido_pedido_id_fkey";

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
