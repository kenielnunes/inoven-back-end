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
import { ClientService } from './client.service';
import { ClientDTO } from './dto/client.dto';
import { FindClientsDTO } from './dto/find-clients.dto';

@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: ClientDTO, @Res() res: Response) {
        try {
            const created = await this.clientService.create(data);

            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Cliente cadastrado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Body() data: FindClientsDTO) {
        return await this.clientService.findAll(data);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string) {
        return this.clientService.update(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.clientService.remove(+id);
    }
}
