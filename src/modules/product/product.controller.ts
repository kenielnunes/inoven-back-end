import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { GetProductsDTO } from './dto/get-products.dto';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(
    FilesInterceptor('imagensProduto', 5, {
        storage: diskStorage({
            destination: './src/modules/google/storage/assets/uploads',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            },
        }),
    }),
)
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post()
    async create(
        @UploadedFiles() imagensProduto: Array<Express.Multer.File>,
        @Res() res: Response,
        @Body() createCategoryDto: ProductDTO,
    ) {
        try {
            const created = await this.productService.create({
                ...createCategoryDto,
                imagensProduto: imagensProduto,
            });

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Produto cadastrado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get()
    async findAll(
        @Res() res: Response,
        @Query() paginationDto: GetProductsDTO,
    ) {
        const products = await this.productService.findAll(paginationDto);

        // const paginatedResult = this.paginationService.paginate(
        //     products,
        //     page,
        //     limit,
        // );

        return res.status(HttpStatus.CREATED).send(products);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    // @Put(':id')
    // async update(
    //     @Param('id') id: string,
    //     @Body() data: ProductDTO,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         await this.productService.update(+id, data);

    //         return res.status(HttpStatus.OK).send({
    //             statusCode: HttpStatus.OK,
    //             message: 'Produto alterado com sucesso!',
    //         });
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).send({
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             message: error.message,
    //         });
    //     }
    // }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.productService.remove(Number(id));

            return res.status(HttpStatus.OK).send({
                message: 'Categoria deletada com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: error.message,
            });
        }
    }
}
