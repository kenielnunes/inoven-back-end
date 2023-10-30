import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { ClientDTO } from './dto/client.dto';

@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    async create(data: ClientDTO) {
        const existsClient = await this.prisma.client.findFirst({
            where: {
                email: data.email,
            },
        });

        if (existsClient) {
            throw new Error('Já existe um cliente cadastrado com esse email');
        }
        const created = await this.prisma.client.create({
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
                clienteId: created.id,
            },
        });

        return data;
    }

    async findAll() {
        return this.prisma.client.findMany({
            include: {
                endereco: true,
            },
        });
    }

    findOne(id: number) {
        return `This action returns a #${id} client`;
    }

    update(id: number) {
        return `This action updates a #${id} client`;
    }

    remove(id: number) {
        return `This action removes a #${id} client`;
    }
}
