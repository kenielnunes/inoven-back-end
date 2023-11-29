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
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserRequestDTO } from '../auth/dto/user-request.dto';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { ClientService } from './client.service';
import { CreateClientDTO } from './dto/create-client.dto';
import { FilterClientsDTO } from './dto/filter-clients.dto';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    async create(
        @Body() data: CreateClientDTO,
        @Res() res: Response,
        @Req() req: UserRequestDTO,
    ) {
        try {
            const created = await this.clientService.create({
                ...data,
                usuarioId: req.user.id,
            });

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

    @Get()
    async findAll(
        @Query() pagination: FilterClientsDTO,
        @Res() res: Response,
        @Req() req: UserRequestDTO,
    ) {
        try {
            const clients = await this.clientService.findAll({
                ...pagination,
                usuarioId: req.user.id,
            });

            return res.status(HttpStatus.CREATED).send(clients);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        try {
            const client = await this.clientService.findOne(Number(id));

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                content: client,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: CreateClientDTO,
        @Res() res: Response,
    ) {
        try {
            await this.clientService.update(Number(id), data);

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                content: data,
                message: 'Cliente atualizado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message ?? 'Erro ao editar',
            });
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() res: Response) {
        try {
            await this.clientService.remove(Number(id));

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Cliente removido com sucesso!',
            });
        } catch (error) {
            return res.status(error.status).send({
                statusCode: error.status,
                message: error.message,
            });
        }
    }
}
