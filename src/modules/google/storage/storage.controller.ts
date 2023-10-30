import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { StorageDTO } from '../dto/storage.dto';
import { StorageService } from './storage.service';

@Controller('images')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post()
    async create(@Body() data: StorageDTO, @Res() res: Response) {
        console.log(data);

        try {
            const created = await this.storageService.upload(data);

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Imagem salva com sucesso!',
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
