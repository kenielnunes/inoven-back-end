import { Controller, Delete, Get, Param } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('variants')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    // @Post()
    // async create(@Body() data: StorageDTO, @Res() res: Response) {
    //     try {
    //         const created = await this.storageService.create(data);

    //         return res.status(HttpStatus.CREATED).send({
    //             statusCode: HttpStatus.CREATED,
    //             content: created,
    //             message: 'Variação criada com sucesso!',
    //         });
    //     } catch (error) {
    //         return res.status(HttpStatus.BAD_REQUEST).send({
    //             statusCode: HttpStatus.BAD_REQUEST,
    //             message: error.message,
    //         });
    //     }
    // }

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
