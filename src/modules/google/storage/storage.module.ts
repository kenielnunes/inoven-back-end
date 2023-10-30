import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
    controllers: [StorageController],
    providers: [StorageService, PrismaService],
    exports: [PrismaService],
})
export class StorageModule {}
