import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    controllers: [ProductController],
    providers: [ProductService, PrismaService],
    exports: [PrismaService],
})
export class ProductModule {}
