import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { format } from 'url';
import { StorageService, bucket } from './storage.service';

@Controller('images')
@UseInterceptors(FileInterceptor('file'))
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post()
    async execute(
        // @Body() file: Express.Multer.File,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .send({ message: 'Please upload a file!' });
            }

            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on('error', (err) => {
                res.status(500).send({ message: err.message });
            });

            const fileName = req.file.originalname;
            const url = 'productImages/' + fileName;

            blobStream.on('finish', async () => {
                // create a url to access file
                const publicURL = format(
                    `https://storage.googleapis.com/${bucket.name}/productImages/${blob.name}`,
                );

                try {
                    await bucket.upload(fileName, {
                        destination: url,
                    });
                } catch {
                    return res.status(500).send({
                        message: `Uploaded the file successfully: ${fileName}, but public access is denied!`,
                        url: publicURL,
                    });
                }

                res.status(200).send({
                    message:
                        'Uploaded the file successfully: ' +
                        req.file.originalname,
                    url: publicURL,
                });
            });
            blobStream.end(req.file.buffer);
        } catch (err) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                return res.status(500).send({
                    message: 'File size cannot be larger than 25MB!',
                });
            }

            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
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
