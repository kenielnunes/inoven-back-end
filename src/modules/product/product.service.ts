import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { log } from 'console';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { StorageService } from '../google/storage/storage.service';
import {
    PaginateFunction,
    PaginatedResult,
    paginator,
} from '../pagination/pagination.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { GetProductsDTO } from './dto/get-products.dto';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private storageService: StorageService,
        private enumValidate: EnumValidate,
    ) {}

    async validate(data: CreateProductDTO) {
        if (!data.categoria) {
            throw new BadRequestException('Categoria é obrigatória');
        }

        await this.enumValidate.isValidCategory(data.categoria);

        if (!data.descricao) {
            throw new BadRequestException('O nome do produto é obrigatório');
        }

        if (data.imagensProduto && !Array.isArray(data.imagensProduto)) {
            throw new BadRequestException(
                'Imagens do produto devem ser uma lista',
            );
        }
    }

    async create(data: CreateProductDTO): Promise<ProductDTO> {
        await this.validate(data);

        const productExists = await this.prisma.product.findFirst({
            where: {
                descricao: data.descricao,
            },
        });

        if (productExists) {
            throw new BadRequestException('O produto já existe');
        }

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
        userId: number,
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
                usuarioId: userId,
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
            include: {
                imagensProduto: true,
            },
        });

        if (!existsProduct) {
            throw new BadRequestException('Produto não encontrado');
        }

        return existsProduct;
    }

    async update(id: number, data: ProductDTO) {
        const existsProduct = await this.findOne(Number(id));

        // remove as imagens antigas
        for (const image of existsProduct.imagensProduto) {
            log(image);
            await this.storageService.remove(image.path);
        }

        const updated = await this.prisma.product.update({
            where: {
                id: existsProduct.id,
            },
            include: {
                imagensProduto: true,
            },
            data: {
                ...data,
                imagensProduto: {
                    create: data.imagensProduto,
                },
            },
        });

        return updated;
    }

    async remove(id: number) {
        await this.findOne(Number(id));

        return await this.prisma.product.delete({
            where: {
                id: id,
            },
        });
    }
}
