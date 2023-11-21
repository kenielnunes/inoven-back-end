import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { log } from 'console';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from '../google/storage/storage.service';
import {
    PaginateFunction,
    PaginatedResult,
    paginator,
} from '../pagination/pagination.service';
import { GetProductsDTO } from './dto/get-products.dto';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private storageService: StorageService,
    ) {}

    async create(data: ProductDTO): Promise<ProductDTO> {
        console.log('data ->', data);

        const productExists = await this.prisma.product.findFirst({
            where: {
                descricao: data.descricao,
            },
        });

        if (productExists) {
            throw new Error('O produto já existe');
        }

        // const teste = await axios.post('http://localhost:3000/images', {
        //     file: data.imagem_produto,
        // });

        const imagens = await Promise.all(
            data.imagensProduto.map(async (imagem) => {
                const imagemPath = await this.storageService.upload(
                    imagem,
                    'productImages',
                );
                return { path: imagemPath };
            }),
        );

        log('imagens ->', imagens);

        const product = await this.prisma.product.create({
            data: {
                ...data,
                usuarioId: data.usuarioId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                imagensProduto: {
                    create: imagens,
                },
            },
        });

        return {
            ...product,
            imagensProduto: imagens,
        };
    }

    async findAll(
        filter: GetProductsDTO,
    ): Promise<PaginatedResult<ProductDTO>> {
        const paginate: PaginateFunction = paginator({
            perPage: filter.perPage,
        });

        const args: Prisma.ProductFindManyArgs = {
            include: {
                imagensProduto: true,
            },
            where: {
                descricao: {
                    contains: filter.descricao,
                    mode: 'insensitive',
                },
            },
        };

        return paginate(this.prisma.product, args, {
            page: filter.page,
            perPage: filter.perPage,
        });
    }

    async findOne(id: number) {
        const existsProduct = await this.prisma.product.findFirst({
            where: {
                id: id,
            },
        });

        if (!existsProduct) {
            throw new Error('Produto não encontrado');
        }

        return existsProduct;
    }

    async remove(id: number) {
        await this.findOne(+id);

        return await this.prisma.product.delete({
            where: {
                id: id,
            },
        });
    }
}
