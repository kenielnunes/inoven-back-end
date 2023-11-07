import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { VariantDTO } from './dto/vartiant.dto';

@Injectable()
export class VariantService {
    constructor(private prisma: PrismaService) {}

    async create(data: VariantDTO): Promise<VariantDTO> {
        const categoryExists = await this.prisma.variation.findFirst({
            where: {
                descricao: data.descricao,
            },
        });

        if (categoryExists) {
            throw new Error('A variação já existe');
        }

        const category = await this.prisma.variation.create({
            data: data,
        });

        return category;
    }

    async findAll() {
        return await this.prisma.variation.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} variant`;
    }

    update(id: number) {
        return `This action updates a #${id} variant`;
    }

    remove(id: number) {
        return `This action removes a #${id} variant`;
    }
}
