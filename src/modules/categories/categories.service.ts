import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}
    async create(data: CategoryDTO) {
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

    findAll() {
        return `This action returns all categories`;
    }

    findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    update(id: number) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
