import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RequestItemDTO } from './dto/request-item.dto';
import { RequestItemService } from './request-item.service';

@Controller('request-item')
export class RequestItemController {
    constructor(private readonly requestItemService: RequestItemService) {}

    @Post()
    async create(@Body() data: RequestItemDTO) {
        return await this.requestItemService.create(data);
    }

    @Get()
    findAll() {
        return this.requestItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.requestItemService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.requestItemService.remove(+id);
    }
}
