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
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { VariantDTO } from './dto/vartiant.dto';
import { VariantService } from './variant.service';

@Controller('variations')
export class VariantController {
    constructor(private readonly variantService: VariantService) {}

    @UseGuards(JwtAuthGuard)
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
    async findAll(@Res() res: Response) {
        const variations = await this.variantService.findAll();
        return res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            content: variations,
        });
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
