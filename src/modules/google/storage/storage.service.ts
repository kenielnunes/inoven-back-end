import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { PrismaService } from 'src/database/PrismaService';
import { format } from 'url';

const storage = new Storage({
    keyFilename: `./src/modules/google/storage/config/upbeat-sunspot-402818-46e6eda78e2d.json`,
    projectId: 'upbeat-sunspot-402818',
});

const bucketName = 'inoven';
export const bucket = storage.bucket(bucketName);

@Injectable()
export class StorageService {
    constructor(private prisma: PrismaService) {}

    async upload(file: Express.Multer.File, destinationUrl: string) {
        if (!file) {
            throw new Error('Selecione uma imagem');
        }

        const blob = bucket.file(file.originalname);
        // log('blob', blob);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });
        // log('streamBlob', blobStream);

        blobStream.on('error', () => {
            throw new Error('erro no blob');
        });

        const fileName = file.originalname;
        const publicURL = format(
            `https://storage.googleapis.com/${bucket.name}/${destinationUrl}/${blob.name}`,
        );

        blobStream.on('finish', async () => {
            // create a url to access file

            bucket.upload(
                `./src/modules/google/storage/assets/uploads/${file.originalname}`,
                {
                    destination: `${destinationUrl}/${fileName}`,
                },
                async (err) => {
                    if (err) {
                        throw new Error(
                            `Error uploading image ${file.originalname}: ${err}`,
                        );
                    } else {
                        // Após o upload bem-sucedido, exclui o arquivo local
                        fs.unlinkSync(
                            `./src/modules/google/storage/assets/uploads/${file.originalname}`,
                        );
                    }
                },
            );
        });

        blobStream.end(file.buffer);

        return publicURL;
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
