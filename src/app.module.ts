import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesController } from './modules/category/category.controller';
import { CategoriesModule } from './modules/category/category.module';
import { CategoryService } from './modules/category/category.service';
import { ClientModule } from './modules/client/client.module';
import { StorageModule } from './modules/google/storage/storage.module';
import { ProductController } from './modules/product/product.controller';
import { ProductModule } from './modules/product/product.module';
import { ProductService } from './modules/product/product.service';
import { RequestModule } from './modules/request/request.module';
import { UserModule } from './modules/user/user.module';
import { VariantController } from './modules/variant/variant.controller';
import { VariantModule } from './modules/variant/variant.module';
import { VariantService } from './modules/variant/variant.service';
import { RequestItemModule } from './modules/request-item/request-item.module';

@Module({
    imports: [
        CategoriesModule,
        ProductModule,
        VariantModule,
        RequestModule,
        AuthModule,
        UserModule,
        ClientModule,
        StorageModule,
        RequestItemModule,
    ],
    controllers: [CategoriesController, ProductController, VariantController],
    providers: [CategoryService, ProductService, VariantService],
    exports: [],
})
export class AppModule {}
