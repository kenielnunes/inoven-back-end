import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { ClientService } from '../client/client.service';
import { StorageService } from '../google/storage/storage.service';
import { ProductService } from '../product/product.service';
import { RequestItemService } from '../request-item/request-item.service';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
    controllers: [RequestController],
    providers: [
        RequestService,
        PrismaService,
        ClientService,
        EnumValidate,
        RequestItemService,
        ProductService,
        StorageService,
    ],
})
export class RequestModule {}
