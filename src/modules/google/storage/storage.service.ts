import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from 'src/database/PrismaService';
import { StorageDTO } from '../dto/storage.dto';

cloudinary.config({
    cloud_name: 'dvybeab1e',
    api_key: '653472961781559',
    api_secret: 'H-tC-MMeWtyMMr0t3I9igOMds0I',
});

@Injectable()
export class StorageService {
    constructor(private prisma: PrismaService) {}

    async upload(data: StorageDTO) {
        await data;
    }

    async findAll() {
        const products = await this.prisma.product.findMany({
            include: {
                categoria: true, // Nome do relacionamento com a tabela de categoria
                variacao: true, // Nome do relacionamento com a tabela de variação
            },
        });

        const productDTOs = products.map((product) => ({
            id: product.id,
            descricao: product.descricao,
            categoria: product.categoria,
            variacao: product.variacao,
            unidade: product.unidade,
        }));

        return productDTOs;
    }

    async findOne(id: number) {
        return `This action returns a #${id} category`;
    }

    async remove(id: number) {
        return await this.prisma.category.delete({
            where: {
                id: id,
            },
        });
    }
}
