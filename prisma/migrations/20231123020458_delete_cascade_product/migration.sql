-- DropForeignKey
ALTER TABLE "imagem_produto" DROP CONSTRAINT "imagem_produto_produto_id_fkey";

-- AddForeignKey
ALTER TABLE "imagem_produto" ADD CONSTRAINT "imagem_produto_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
