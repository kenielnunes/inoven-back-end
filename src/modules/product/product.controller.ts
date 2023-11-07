import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { PaginationDTO } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(
    FileInterceptor('imagensProduto', {
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
export class ProductController {
    constructor(
        private productService: ProductService,
        private paginationService: PaginationService,
    ) {}

    @Post()
    async create(
        @UploadedFile() imagensProduto: Express.Multer.File,
        @Res() res: Response,
        @Body() createCategoryDto: ProductDTO,
    ) {
        try {
            const created = await this.productService.create({
                ...createCategoryDto,
                categoriaId: Number(createCategoryDto.categoriaId),
                variacaoId: Number(createCategoryDto.variacaoId),
                imagensProduto: imagensProduto,
            });

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Produto criado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get()
    async findAll(@Res() res: Response, @Query() paginationDto: PaginationDTO) {
        const { page, limit } = paginationDto;

        const products = await this.productService.findAll();

        const paginatedResult = this.paginationService.paginate(
            products,
            page,
            limit,
        );

        return res.status(HttpStatus.CREATED).send(paginatedResult);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: ProductDTO,
        @Res() res: Response,
    ) {
        try {
            await this.productService.update(+id, data);

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Produto alterado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.productService.remove(+id);

            return res.status(HttpStatus.OK).send({
                message: 'Categoria deletada com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Erro ao deletar a categoria',
            });
        }
    }
}
