import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
@Injectable()
export class StorageService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                categoria: true, // Nome do relacionamento com a tabela de categoria
                variacao: true, // Nome do relacionamento com a tabela de variação
            },
        });

        const productDTOs = products.map((product) => ({
            id: product.id,
            descricao: product.descricao,
            categoria: product.categoria,
            variacao: product.variacao,
            unidade: product.unidade,
        }));

        return productDTOs;
    }

    async findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    async remove(id: number) {
        return await this.prisma.category.delete({
            where: {
                id: id,
            },
        });
    }
}
