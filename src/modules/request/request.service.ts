import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import moment from 'moment-timezone';
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
import { FindRequestDTO } from './dto/find-request.dto';
import { RequestDTO } from './dto/request.dto';
import { UpdateRequestDTO } from './dto/update-request.dto';

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
                throw new BadRequestException('Produto não encontrado');
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                clienteId: data.clienteId,
                usuarioId: data.usuarioId,
            },
            include: {
                itensPedido: true,
                cliente: true,
            },
        });

        return request;
    }

    async findAll(
        usuarioId: number,
        filter?: FilterRequestDTO,
    ): Promise<PaginatedResult<FindRequestDTO>> {
        const paginate: PaginateFunction = paginator({
            perPage: filter?.perPage,
        });

        if (filter?.status) {
            await this.enumValidate.isValidStatus(filter?.status);
        }

        if (filter?.formaPagamento) {
            await this.enumValidate.isValidPaymentMethod(
                filter?.formaPagamento,
            );
        }

        const adjustedStartDate = moment(filter?.dataInicio)
            .subtract(3, 'hours')
            .toISOString();

        const adjustedEndDate = moment(filter?.dataFim)
            .subtract(3, 'hours')
            .toISOString();

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
                        contains: filter?.cliente,
                        mode: 'insensitive',
                    },
                },
                dataEntrega: {},
                usuarioId: usuarioId,
            },
        };

        if (filter?.clienteId) {
            args.where.clienteId = {
                equals: Number(filter?.clienteId),
            };
        }

        if (filter?.status) {
            args.where.status = {
                equals: filter?.status,
            };
        }

        if (filter.dataInicio || filter.dataFim) {
            args.where.dataEntrega = {
                gte: filter.dataInicio ? adjustedStartDate : undefined,
                lte: filter.dataFim ? adjustedEndDate : undefined,
            };
        }

        if (filter?.formaPagamento) {
            args.where.formaPagamento = {
                equals: filter?.formaPagamento,
            };
        }

        const paginatedResult = await paginate(this.prisma.request, args, {
            page: filter?.page,
            perPage: filter?.perPage,
        });

        const formattedDTO = paginatedResult.content.map(
            (request: FindRequestDTO) => {
                const totalValue = request.itensPedido.reduce(
                    (acc, item) => acc + item.valorUnitario,
                    0,
                );
                return {
                    ...request,
                    valorTotal: Number(totalValue.toFixed(2)),
                };
            },
        );

        return {
            ...paginatedResult,
            content: formattedDTO,
        };
    }

    async findOne(id: number) {
        const exists = await this.prisma.request.findFirst({
            where: {
                id: id,
            },
            include: {
                itensPedido: {
                    select: {
                        id: true,
                        valorUnitario: true,
                        observacao: true,
                        quantidade: true,
                    },
                },
            },
        });

        if (!exists) {
            throw new BadRequestException('Nenhum pedido encontrado');
        }

        return exists;
    }

    async update(id: number, data: UpdateRequestDTO) {
        const existsRequest = await this.findOne(Number(id));

        for (const item of data.itensPedido) {
            const existsProduct = await this.productService.findOne(
                item.produtoId,
            );

            if (!existsProduct) {
                throw new Error('Produto não encontrado');
            }
        }

        const updated = await this.prisma.request.update({
            where: {
                id: Number(existsRequest.id),
            },
            include: {
                itensPedido: true,
                cliente: true,
            },
            data: {
                ...data,
                itensPedido: {
                    deleteMany: {},
                    create: data.itensPedido.map((item) => item),
                },
                updatedAt: new Date().toISOString(),
            },
        });

        return updated;
    }

    async remove(id: number) {
        await this.findOne(Number(id));

        return await this.prisma.request.delete({
            where: {
                id: Number(id),
            },
        });
    }
}
