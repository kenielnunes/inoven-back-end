import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(data: ProductDTO): Promise<ProductDTO> {
        console.log('data ->', data);

        const productExists = await this.prisma.product.findFirst({
            where: {
                descricao: data.descricao,
            },
        });

        const categoryExists = await this.prisma.category.findFirst({
            where: {
                id: Number(data.categoria_id),
            },
        });

        const variationExists = await this.prisma.variation.findFirst({
            where: {
                id: Number(data.variacao_id),
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

        // const teste = await axios.post('http://localhost:3000/images', {
        //     file: data.imagem_produto,
        // });

        const product = await this.prisma.product.create({
            data: {
                ...data,
                categoria_id: Number(data.categoria_id),
                variacao_id: Number(data.variacao_id),
                imagem_produto: {
                    create: {
                        path: data.imagem_produto,
                    },
                },
            },
        });

        return product;
    }

    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                categoria: true, // Nome do relacionamento com a tabela de categoria
                variacao: true, // Nome do relacionamento com a tabela de variação
                imagem_produto: true,
            },
        });

        const productDTOs = products.map((product) => ({
            id: product.id,
            descricao: product.descricao,
            categoria: product.categoria,
            variacao: product.variacao,
            unidade: product.unidade,
            imagem_produto: product.imagem_produto,
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
