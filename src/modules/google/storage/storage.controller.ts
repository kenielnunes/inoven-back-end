import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { DeleteFileDTO } from './dto/delete-file.dto';
import { StorageService } from './storage.service';

@Controller('images')
@UseInterceptors(
    FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/modules/google/storage/assets/uploads',
            filename: (req, file, cb) => {
                console.log(file);
                //Calling the callback passing the random name generated with the original extension name
                cb(null, `${file.originalname}`);
            },
        }),
    }),
)
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post()
    async create(
        // @Body() file: Express.Multer.File,
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
    ) {
        try {
            const imagem = await this.storageService.upload(
                file,
                'productImages',
            );

            res.status(200).send({
                message: 'Uploaded the file successfully: ' + file.originalname,
                url: imagem,
            });
        } catch (error) {
            return res.status(500).send({
                message: `Uploaded the file successfully, but public access is denied!`,
                url: error.message,
            });
        }
    }

    @Delete()
    async remove(@Body() data: DeleteFileDTO, @Res() res: Response) {
        try {
            await this.storageService.remove(data.filePath);

            res.status(200).send({
                message: 'Imagem removida com sucesso!',
            });
        } catch (error) {
            return res.status(error.status).send({
                message: error.message,
            });
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.storageService.findOne(+id);
    }
}
