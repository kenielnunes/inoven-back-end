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
} from '@nestjs/common';
import { Response } from 'express';
import { PaginationDTO } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private paginationService: PaginationService,
    ) {}

    @Post()
    async create(@Body() createCategoryDto: ProductDTO, @Res() res: Response) {
        try {
            const created = await this.productService.create(createCategoryDto);

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
