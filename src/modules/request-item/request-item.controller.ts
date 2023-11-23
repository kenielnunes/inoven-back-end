import { Controller, Delete, Get, Param } from '@nestjs/common';
import { RequestItemService } from './request-item.service';

@Controller('request-item')
export class RequestItemController {
    constructor(private readonly requestItemService: RequestItemService) {}

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
