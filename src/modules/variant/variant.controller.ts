import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VariantDTO } from './dto/vartiant.dto';
import { VariantService } from './variant.service';

@Controller('variants')
export class VariantController {
    constructor(private readonly variantService: VariantService) {}

    @Post()
    async create(@Body() data: VariantDTO, @Res() res: Response) {
        try {
            const created = await this.variantService.create(data);

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Variação criada com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get()
    findAll() {
        return this.variantService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.variantService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string) {
        return this.variantService.update(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.variantService.remove(+id);
    }
}
