-- DropForeignKey
ALTER TABLE "item_pedido" DROP CONSTRAINT "item_pedido_produto_id_fkey";

-- AddForeignKey
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
