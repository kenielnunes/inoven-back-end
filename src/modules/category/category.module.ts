import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { CategoriesController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
    controllers: [CategoriesController],
    providers: [CategoryService, PrismaService],
    exports: [PrismaService],
})
export class CategoriesModule {}
