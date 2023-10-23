import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

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
    async findAll(@Res() res: Response) {
        const categories = await this.productService.findAll();

        return res.status(HttpStatus.CREATED).send({
            content: categories,
        });
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
