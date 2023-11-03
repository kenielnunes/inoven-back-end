import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { RequestItemController } from './request-item.controller';
import { RequestItemService } from './request-item.service';

@Module({
    controllers: [RequestItemController],
    providers: [RequestItemService, PrismaService],
})
export class RequestItemModule {}
