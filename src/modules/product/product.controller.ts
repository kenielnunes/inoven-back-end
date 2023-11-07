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
import { StorageService } from '../google/storage/storage.service';
import { PaginationDTO } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
@UseInterceptors(
    FileInterceptor('imagem_produto', {
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
        private storageService: StorageService,
    ) {}

    @Post()
    async create(
        @UploadedFile() imagem_produto: Express.Multer.File,
        @Res() res: Response,
        @Body() createCategoryDto: ProductDTO,
    ) {
        console.log(createCategoryDto);
        try {
            const imagem = await this.storageService.upload(
                imagem_produto,
                'productImages',
            );
            console.log(imagem);
            const created = await this.productService.create({
                ...createCategoryDto,
                categoria_id: Number(createCategoryDto.categoria_id),
                variacao_id: Number(createCategoryDto.variacao_id),
                imagem_produto: imagem,
            });

            console.log('created product ->', created);

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: {
                    ...createCategoryDto,
                    imagem_produto: imagem,
                },
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
