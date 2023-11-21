import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { formatDateToDateTime } from 'src/utils/format-date';
import { ClientService } from '../client/client.service';
import { StorageService } from '../google/storage/storage.service';
import {
    PaginateFunction,
    PaginatedResult,
    paginator,
} from '../pagination/pagination.service';
import { ProductService } from '../product/product.service';
import { FilterRequestDTO } from './dto/filter-request.dto';
import { RequestDTO } from './dto/request.dto';

@Injectable()
export class RequestService {
    constructor(
        private prisma: PrismaService,
        private clientService: ClientService,
        private enumValidate: EnumValidate,
        private productService: ProductService,
        private storageService: StorageService,
    ) {}

    async create(data: RequestDTO): Promise<RequestDTO> {
        await this.clientService.findOne(data.clienteId); //verifica se o cliente existe

        await this.enumValidate.isValidPaymentMethod(data.formaPagamento); //verifica se o método de pagamento é válido

        await this.enumValidate.isValidStatus(data.status); // verifica se o status é valido

        await this.enumValidate.isValidDeliveryModality(data.modalidadeEntrega); // verifica se a modalidade de entrega é valida

        for (const item of data.itensPedido) {
            const existsProduct = await this.productService.findOne(
                item.produtoId,
            );

            if (!existsProduct) {
                throw new Error('Produto não encontrado');
            }
        }

        // Cria o pedido
        const request = await this.prisma.request.create({
            data: {
                ...data,
                dataPedido: formatDateToDateTime(data.dataPedido),
                dataEntrega: formatDateToDateTime(data.dataEntrega),
                itensPedido: {
                    create: data.itensPedido,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
                itensPedido: true,
            },
        });

        return request;
    }

    async findAll(
        filter: FilterRequestDTO,
    ): Promise<PaginatedResult<RequestDTO>> {
        const paginate: PaginateFunction = paginator({
            perPage: filter.perPage,
        });

        const args: Prisma.RequestFindManyArgs = {
            include: {
                cliente: true,
                itensPedido: {
                    include: {
                        produto: {
                            include: {
                                imagensProduto: true,
                            },
                        },
                    },
                },
            },
            where: {
                cliente: {
                    nome: {
                        contains: filter.cliente,
                        mode: 'insensitive',
                    },
                },
            },
        };

        const paginatedResult = await paginate(this.prisma.request, args, {
            page: filter.page,
            perPage: filter.perPage,
        });

        const formattedDTO = paginatedResult.content.map(
            (request: RequestDTO) => {
                const totalValue = request.itensPedido.reduce(
                    (acc, item) => acc + item.valorUnitario,
                    0,
                );
                return {
                    ...request,
                    valorTotal: totalValue,
                };
            },
        );

        return {
            ...paginatedResult,
            content: formattedDTO,
        };
    }

    async findOne(id: number) {
        return this.prisma.request.findFirst({
            where: {
                id: id,
            },
        });
    }

    update(id: number) {
        return `This action updates a #${id} request`;
    }

    remove(id: number) {
        return `This action removes a #${id} request`;
    }
}
