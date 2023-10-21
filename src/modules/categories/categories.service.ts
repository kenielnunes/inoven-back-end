import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async create(data: CategoryDTO): Promise<CategoryDTO> {
        const categoryExists = await this.prisma.category.findFirst({
            where: {
                description: data.description,
            },
        });

        if (categoryExists) {
            throw new Error('A categoria já existe');
        }

        const category = await this.prisma.category.create({
            data: data,
        });

        return category;
    }

    async findAll(): Promise<CategoryDTO[]> {
        const categories = await this.prisma.category.findMany();
        return categories;
    }

    findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    async update(id: number, data: CategoryDTO) {
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
