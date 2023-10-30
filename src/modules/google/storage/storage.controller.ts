import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { StorageService, bucket } from './storage.service';

@Controller('images')
@UseInterceptors(FileInterceptor('file'))
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post()
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();
        // console.log(blobStream);
        // console.log(file);

        console.log(bucket);

        bucket.upload(
            file.originalname,
            {
                destination: `products-images/${randomUUID()}.jpeg`,
            },

            function (err, fl) {
                if (err) {
                    console.error(
                        `Error uploading image image_to_upload.jpeg: ${err}`,
                    );
                } else {
                    console.log(
                        `Image image_to_upload.jpeg uploaded to ${'inoven'}.`,
                    );
                }
            },
        );

        blobStream.on('error', (err) => {
            console.log(err);
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/products-images/${blob.name}`;
            return res.status(200).send(publicUrl);
        });

        blobStream.end(req.file.buffer);

        // try {
        //     const created = await this.storageService.upload(file);

        //     return res.status(HttpStatus.CREATED).send({
        //         statusCode: HttpStatus.CREATED,
        //         content: created,
        //         message: 'Imagem salva com sucesso!',
        //     });
        // } catch (error) {
        //     return res.status(HttpStatus.BAD_REQUEST).send({
        //         statusCode: HttpStatus.BAD_REQUEST,
        //         message: error.message,
        //     });
        // }
    }

    @Get()
    findAll() {
        return this.storageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storageService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.storageService.remove(+id);
    }
}
