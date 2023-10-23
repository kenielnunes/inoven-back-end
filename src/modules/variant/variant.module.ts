import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';

@Module({
    controllers: [VariantController],
    providers: [VariantService, PrismaService],
    exports: [PrismaService],
})
export class VariantModule {}
