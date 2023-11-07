import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from '../google/storage/storage.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';

@Module({
    controllers: [ProductImagesController],
    providers: [ProductImagesService, PrismaService, StorageService],
    imports: [],
})
export class ProductImagesModule {}
