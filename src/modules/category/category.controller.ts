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
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoryService) {}

    @Post()
    async create(@Body() createCategoryDto: CategoryDTO, @Res() res: Response) {
        try {
            const created =
                await this.categoriesService.create(createCategoryDto);

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Categoria criada com sucesso!',
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
        const categories = await this.categoriesService.findAll();

        return res.status(HttpStatus.CREATED).send({
            content: categories,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: CategoryDTO,
        @Res() res: Response,
    ) {
        try {
            await this.categoriesService.update(+id, data);

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Categoria alterada com sucesso!',
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
            await this.categoriesService.remove(+id);

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
