import { Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { log } from 'console';
import * as fs from 'fs';
import { PrismaService } from 'src/database/PrismaService';
import { stringToSlug } from 'src/utils/string-to-slug';
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

        log('file.fieldname ->', file.fieldname);

        const fileName = stringToSlug(file.originalname);

        const blob = bucket.file(fileName);
        // log('blob', blob);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });
        // log('streamBlob', blobStream);

        blobStream.on('error', () => {
            throw new Error('erro no blob');
        });

        const publicURL = format(
            `https://storage.googleapis.com/${bucket.name}/${destinationUrl}/${blob.name}`,
        );

        blobStream.on('finish', async () => {
            // create a url to access file

            bucket.upload(
                `./src/modules/google/storage/assets/uploads/${fileName}`,
                {
                    destination: `${destinationUrl}/${fileName}`,
                },
                async (err) => {
                    if (err) {
                        throw new Error(
                            `Error uploading image ${fileName}: ${err}`,
                        );
                    } else {
                        // Após o upload bem-sucedido, exclui o arquivo local
                        fs.unlinkSync(
                            `./src/modules/google/storage/assets/uploads/${fileName}`,
                        );
                    }
                },
            );
        });

        blobStream.end(file.buffer);

        return publicURL;
    }

    async remove(filePath: string, destinationUrl: string) {
        if (!filePath) {
            throw new BadRequestException('Arquivo não informado');
        }

        const parts = filePath.split('/');

        const fileName = parts[parts.length - 1];

        const file = bucket.file(`${destinationUrl}/${fileName}`);

        if (!file) {
            throw new BadRequestException('Arquivo não encontrado');
        }

        await file.delete();
    }

    async findOne(id: number) {
        return `This action returns a #${id} category`;
    }
}
