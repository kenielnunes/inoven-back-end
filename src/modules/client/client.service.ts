import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

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
                cliente_id: client.id,
            },
        });

        return data;
    }

    async findAll(): Promise<ClientDTO[]> {
        const clients = await this.prisma.client.findMany({
            include: {
                endereco: true,
            },
        });

        return clients;
    }

    async findOne(id: number) {
        const client = await this.prisma.client.findFirst({
            where: {
                id: id,
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

        return await this.prisma.client.delete({
            where: {
                id: id,
            },
        });
    }
}
