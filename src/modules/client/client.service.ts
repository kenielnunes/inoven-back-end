import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

import { PaginationDTO } from '../pagination/dto/pagination.dto';
import {
    PaginateFunction,
    PaginatedResult,
    paginator,
} from '../pagination/pagination.service';
import { ClientDTO } from './dto/client.dto';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    private async validate(data: ClientDTO) {
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
            },
        });

        if (existsClient) {
            throw new Error('Já existe um cliente cadastrado com esse email');
        }
    }

    async create(data: ClientDTO) {
        await this.validate(data);

        const client = await this.prisma.client.create({
            data: {
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
            },
        });

        await this.prisma.address.create({
            data: {
                bairro: data.endereco.bairro,
                cep: data.endereco.cep,
                complemento: data.endereco.complemento,
                numero: data.endereco.numero,
                rua: data.endereco.rua,
                clienteId: client.id,
                cidade: data.endereco.cidade,
            },
        });

        return data;
    }

    async findAll({
        page,
        limit,
    }: PaginationDTO): Promise<PaginatedResult<ClientDTO>> {
        const paginate: PaginateFunction = paginator({ perPage: limit });

        return paginate(
            this.prisma.client,
            {
                include: {
                    endereco: true,
                },
            },
            {
                page: page,
                perPage: limit,
            },
        );
    }

    async findOne(id: number) {
        const client = await this.prisma.client.findFirst({
            where: {
                id,
            },
        });

        if (!client) {
            throw new Error('Cliente não encontrado');
        }

        return client;
    }

    async update(id: number, data: ClientDTO) {
        return await this.prisma.client.update({
            where: {
                id: id,
            },
            data: {
                ...data,
                endereco: {
                    update: data.endereco,
                },
            },
        });
    }

    async remove(id: number) {
        const existsClient = await this.findOne(id);

        if (!existsClient) {
            throw new Error('Cliente não encontrado');
        }

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
                id: Number(id),
            },
        });
    }
}
