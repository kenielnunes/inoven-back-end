import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { StorageService } from '../google/storage/storage.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService, PrismaService, StorageService, EnumValidate],
    exports: [PrismaService, EnumValidate],
})
export class ProductModule {}
