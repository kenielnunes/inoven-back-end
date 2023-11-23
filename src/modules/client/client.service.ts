import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

import { Prisma } from '@prisma/client';
import {
    PaginateFunction,
    PaginatedResult,
    paginator,
} from '../pagination/pagination.service';
import { CreateClientDTO } from './dto/create-client.dto';
import { FilterClientsDTO } from './dto/filter-clients.dto';
import { FindClientsDTO } from './dto/find-clients.dto';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    private async validate(data: CreateClientDTO) {
        if (!data.email) {
            throw new Error('Informe um email');
        }

        if (!data.nome) {
            throw new Error('Informe um nome');
        }

        if (!data.telefone) {
            throw new Error('Informe um telefone');
        }

        if (!data.endereco) {
            throw new Error('Informe um endereço');
        }

        const existsClient = await this.prisma.client.findFirst({
            where: {
                email: data.email,
                usuarioId: data.usuarioId,
            },
        });

        if (existsClient) {
            throw new Error('Já existe um cliente cadastrado com esse email');
        }
    }

    async create(data: CreateClientDTO) {
        await this.validate(data);

        try {
            const client = await this.prisma.client.create({
                data: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    endereco: {
                        create: {
                            ...data.endereco,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    },
                    usuario: {
                        connect: {
                            id: data.usuarioId,
                        },
                    },
                },
            });

            return client;
        } catch (error) {
            console.log('err ->', error.message);
            throw new InternalServerErrorException('Erro interno no servidor!');
        }
    }

    async findAll(
        data: FilterClientsDTO,
    ): Promise<PaginatedResult<FindClientsDTO>> {
        const paginate: PaginateFunction = paginator({ perPage: data.perPage });

        const args: Prisma.ClientFindManyArgs = {
            select: {
                id: true,
                nome: true,
                telefone: true,
                email: true,
                endereco: true,
            },
            where: {
                nome: {
                    contains: data.nomeCliente,
                    mode: 'insensitive',
                },
                usuarioId: data.usuarioId,
            },
        };

        return paginate(this.prisma.client, args, {
            page: data.page,
            perPage: data.perPage,
        });
    }

    async findOne(id: number) {
        if (!id) {
            throw new BadRequestException('O Id do cliente é obrigatório!');
        }

        const client = await this.prisma.client.findFirst({
            where: {
                id,
            },
        });

        if (!client) {
            throw new BadRequestException('Cliente não encontrado');
        }

        return client;
    }

    async update(id: number, data: CreateClientDTO) {
        const existsClient = await this.findOne(Number(id));

        const updated = await this.prisma.client.update({
            where: {
                id: existsClient.id,
            },
            data: {
                ...data,
                endereco: {
                    update: data.endereco,
                },
                updatedAt: new Date().toISOString(),
            },
        });

        return updated;
    }

    async remove(id: number) {
        const existsClient = await this.findOne(Number(id));

        const associatedAddressId = existsClient.id;

        if (associatedAddressId) {
            // Check if the associated address exists
            const existsAddress = await this.prisma.address.findUnique({
                where: {
                    clienteId: associatedAddressId,
                },
            });

            if (existsAddress) {
                // If the associated address exists, delete it
                await this.prisma.address.delete({
                    where: {
                        clienteId: associatedAddressId,
                    },
                });
            } else {
                console.warn(
                    'Associated address not found for client:',
                    existsClient,
                );
            }
        }

        // Now, you can safely remove the client
        return await this.prisma.client.delete({
            where: {
                id: existsClient.id,
            },
        });
    }
}
