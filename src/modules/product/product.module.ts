import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from '../google/storage/storage.service';
import { PaginationService } from '../pagination/pagination.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        PrismaService,
        PaginationService,
        StorageService,
    ],
    exports: [PrismaService],
})
export class ProductModule {}
