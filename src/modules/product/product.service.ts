import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(data: ProductDTO): Promise<ProductDTO> {
        const productExists = await this.prisma.product.findFirst({
            where: {
                descricao: data.descricao,
            },
        });

        const categoryExists = await this.prisma.category.findFirst({
            where: {
                id: data.categoriaId,
            },
        });

        const variationExists = await this.prisma.variation.findFirst({
            where: {
                id: data.variacaoId,
            },
        });

        if (!variationExists) {
            throw new Error('Variação não encontrada');
        }

        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        if (productExists) {
            throw new Error('O produto já existe');
        }

        const product = await this.prisma.product.create({
            data: data,
        });

        return product;
    }

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
        return await this.prisma.product.findFirst({
            where: {
                id: id,
            },
        });
    }

    async update(id: number, data: ProductDTO) {
        const categoryExists = await this.prisma.category.findFirst({
            where: {
                id: id,
            },
        });

        if (!categoryExists) {
            throw new Error('Categoria não encontrada');
        }

        const update = await this.prisma.category.update({
            where: {
                id: id,
            },
            data: data,
        });

        return update;
    }

    async remove(id: number) {
        return await this.prisma.category.delete({
            where: {
                id: id,
            },
        });
    }
}
