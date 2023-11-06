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
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { PaginationDTO } from '../pagination/dto/pagination.dto';
import { PaginationService } from '../pagination/pagination.service';
import { ClientService } from './client.service';
import { ClientDTO } from './dto/client.dto';

@Controller('clients')
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private paginationService: PaginationService,
    ) {}

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
    async findAll(@Query() paginationDto: PaginationDTO) {
        const { page, limit } = paginationDto;
        const clients = await this.clientService.findAll();
        const paginatedResult = this.paginationService.paginate(
            clients,
            page,
            limit,
        );
        return paginatedResult;
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        const client = await this.clientService.findOne(+id);

        return res.status(HttpStatus.OK).send({
            statusCode: HttpStatus.OK,
            content: client,
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.clientService.remove(+id);

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Cliente removido com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
