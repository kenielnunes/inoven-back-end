import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { StorageService } from './storage.service';

@Module({
    controllers: [StorageController],
    providers: [StorageService, PrismaService],
    exports: [PrismaService],
})
export class StorageController {}
