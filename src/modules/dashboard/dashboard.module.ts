import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { ClientService } from '../client/client.service';
import { StorageService } from '../google/storage/storage.service';
import { ProductService } from '../product/product.service';
import { RequestService } from '../request/request.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    controllers: [DashboardController],
    providers: [
        DashboardService,
        PrismaService,
        RequestService,
        ClientService,
        EnumValidate,
        ProductService,
        StorageService,
    ],
})
export class DashboardModule {}
