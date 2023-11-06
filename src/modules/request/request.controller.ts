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
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { RequestDTO } from './dto/request.dto';
import { RequestService } from './request.service';

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
    async create(@Body() data: RequestDTO, @Res() res: Response) {
        try {
            const created = await this.requestService.create(data);
            return res.status(HttpStatus.CREATED).send({
                statusCode: HttpStatus.CREATED,
                content: created,
                message: 'Pedido criado com sucesso!',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get()
    async findAll(@Query('') queryParams: RequestDTO, @Res() res: Response) {
        try {
            const filteredRequests = await this.requestService.findAll();
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
