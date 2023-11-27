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
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { UserRequestDTO } from '../auth/dto/user-request.dto';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { FilterRequestDTO } from './dto/filter-request.dto';
import { RequestDTO } from './dto/request.dto';
import { UpdateRequestDTO } from './dto/update-request.dto';
import { RequestService } from './request.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(
    FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/modules/google/storage/assets/uploads',
            filename: (req, file, cb) => {
                console.log(file);
                cb(null, `${file.originalname}`);
            },
        }),
    }),
)
@Controller('requests')
export class RequestController {
    constructor(private readonly requestService: RequestService) {}

    @Post()
    async create(
        @Body() data: RequestDTO,
        @Res() res: Response,
        @Req() req: UserRequestDTO,
    ) {
        try {
            const created = await this.requestService.create({
                ...data,
                usuarioId: req.user.id,
            });
            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Pedido criado com sucesso!',
            });
        } catch (error) {
            return res.status(error.status).send({
                statusCode: error.status,
                message: error.message,
            });
        }
    }

    @Get()
    async findAll(@Query() filter: FilterRequestDTO, @Res() res: Response) {
        try {
            const filteredRequests = await this.requestService.findAll(filter);

            return res.status(HttpStatus.OK).send(filteredRequests);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestService.findOne(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRequestDto: UpdateRequestDTO,
    ) {
        return await this.requestService.update(Number(id), updateRequestDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestService.remove(+id);
    }
}
