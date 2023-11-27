import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ClientModule } from './modules/client/client.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { StorageModule } from './modules/google/storage/storage.module';
import { StorageService } from './modules/google/storage/storage.service';
import { PaginationModule } from './modules/pagination/pagination.module';
import { ProductImagesController } from './modules/product-images/product-images.controller';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { ProductImagesService } from './modules/product-images/product-images.service';
import { ProductController } from './modules/product/product.controller';
import { ProductModule } from './modules/product/product.module';
import { ProductService } from './modules/product/product.service';
import { ReportsModule } from './modules/reports/reports.module';
import { RequestItemModule } from './modules/request-item/request-item.module';
import { RequestModule } from './modules/request/request.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ProductModule,
        RequestModule,
        AuthModule,
        UserModule,
        ClientModule,
        StorageModule,
        RequestItemModule,
        PaginationModule,
        ProductImagesModule,
        ProductImagesModule,
        ReportsModule,
        DashboardModule,
    ],
    controllers: [ProductController, ProductImagesController],
    providers: [ProductService, StorageService, ProductImagesService],
    exports: [],
})
export class AppModule {}
