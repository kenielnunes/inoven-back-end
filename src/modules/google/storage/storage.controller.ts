import {
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService, bucket } from './storage.service';

@Controller('images')
@UseInterceptors(FileInterceptor('file'))
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post()
    async execute(file: Express.Multer.File): Promise<string> {
        const fs = await require('fs');
        const filePath = file.path;
        const fileName = file.originalname;
        const url = 'professionals/profile-image/' + fileName;

        const options = {
            destination: url,
            preconditionOpts: { ifGenerationMatch: 0 },
        };

        try {
            const test = bucket.upload('./' + filePath, options, () => {
                fs.unlink('./' + filePath, function (err) {
                    if (err) {
                        console.log('err -> ', err);
                        console.error(err.toString());
                    } else {
                        console.warn('./' + filePath + ' deleted');
                    }
                });
            });

            console.log('test -> ', test);
            return 'Imagem salva no bucket !';
        } catch (error) {
            console.log('error -> ', error);
            throw new InternalServerErrorException('Erro interno no servidor!');
        }
    }
    // async create(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Res() res: Response,
    //     // @Req() req: Request,
    // ) {
    //     const { originalname, buffer } = file;
    //     const blob = bucket.file(originalname.replace(/ /g, '_'));
    //     const blobStream = blob.createWriteStream({
    //         resumable: false,
    //     });

    //     // bucket.upload(
    //     //     blobStream,
    //     //     {
    //     //         destination: `https://storage.googleapis.com/${bucket.name}/products-images/${blob.name}`,
    //     //     },
    //     //     function (err, file) {
    //     //         if (err) {
    //     //             console.error(
    //     //                 `Error uploading image image_to_upload.jpeg: ${err}`,
    //     //             );
    //     //         } else {
    //     //             console.log(
    //     //                 `Image image_to_upload.jpeg uploaded to ${'inoven'}.`,
    //     //             );
    //     //         }
    //     //     },
    //     // );

    //     // blobStream
    //     //     .on('finish', () => {
    //     //         const publicUrl = format(
    //     //             `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
    //     //         );
    //     //         return res.send(publicUrl);
    //     //     })
    //     //     .on('error', () => {
    //     //         return `Unable to upload image, something went wrong`;
    //     //     })
    //     //     .end(buffer);
    // }

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
