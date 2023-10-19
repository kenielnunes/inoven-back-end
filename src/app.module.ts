import { Module } from '@nestjs/common';
import { CategoriesController } from './modules/categories/categories.controller';
import { CategoriesModule } from './modules/categories/categories.module';
import { CategoriesService } from './modules/categories/categories.service';

@Module({
    imports: [CategoriesModule],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [],
})
export class AppModule {}
