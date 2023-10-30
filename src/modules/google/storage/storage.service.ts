import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/database/PrismaService';

cloudinary.config({
    cloud_name: 'dvybeab1e',
    api_key: '653472961781559',
    api_secret: 'H-tC-MMeWtyMMr0t3I9igOMds0I',
});

const storage = new Storage({
    keyFilename: `./src/modules/google/storage/config/upbeat-sunspot-402818-46e6eda78e2d.json`,
});

const bucketName = 'inoven';
export const bucket = storage.bucket(bucketName);

@Injectable()
export class StorageService {
    constructor(private prisma: PrismaService) {}

    async upload(file: any) {
        bucket.upload(
            file,
            {
                destination: `products-images/${randomUUID()}.jpeg`,
            },

            function (err, file) {
                if (err) {
                    console.error(
                        `Error uploading image image_to_upload.jpeg: ${err}`,
                    );
                } else {
                    console.log(
                        `Image image_to_upload.jpeg uploaded to ${bucketName}.`,
                    );
                }
            },
        );
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
