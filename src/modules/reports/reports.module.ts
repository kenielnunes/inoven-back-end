import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { ClientService } from '../client/client.service';
import { StorageService } from '../google/storage/storage.service';
import { ProductService } from '../product/product.service';
import { RequestService } from '../request/request.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
    controllers: [ReportsController],
    providers: [
        ReportsService,
        PrismaService,
        RequestService,
        ClientService,
        EnumValidate,
        ProductService,
        StorageService,
    ],
    imports: [],
})
export class ReportsModule {}
