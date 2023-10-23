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
} from '@nestjs/common';
import { Response } from 'express';
import { RequestDTO } from './dto/request.dto';
import { RequestService } from './request.service';

@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Post()
    async create(@Body() createRequestDto: RequestDTO, @Res() res: Response) {
        try {
            const created = await this.requestService.create(createRequestDto);
            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Pedido criado com sucesso!',
            });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
        return;
    }

    @Get()
    async findAll(
        @Query('status') status: string,
        @Query('formaPagamento') formaPagamento: string,
        @Res() res: Response,
    ) {
        try {
            const filteredRequests =
                await this.requestService.findAllWithFilters(
                    status,
                    formaPagamento,
                );
            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                content: filteredRequests,
            });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestService.findOne(+id);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateRequestDto: UpdateRequestDto,
    // ) {
    //     return this.requestService.update(+id, updateRequestDto);
    // }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestService.remove(+id);
    }
}
