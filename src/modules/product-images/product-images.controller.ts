import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { StorageService } from '../google/storage/storage.service';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImagesService } from './product-images.service';

@Controller('product-images')
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
export class ProductImagesController {
    constructor(
        private readonly productImagesService: ProductImagesService,
        private storageService: StorageService,
    ) {}

    // @Post()
    // async create(
    //     @UploadedFile() file: Express.Multer.File,
    //     @Res() res: Response,
    // ) {
    //     return this.productImagesService.create(createProductImageDto);
    // }

    @Get()
    findAll() {
        return this.productImagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productImagesService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProductImageDto: UpdateProductImageDto,
    ) {
        return this.productImagesService.update(+id, updateProductImageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productImagesService.remove(+id);
    }
}
