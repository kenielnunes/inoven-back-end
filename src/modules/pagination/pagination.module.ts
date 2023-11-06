import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PaginationService } from './pagination.service';

@Module({
    providers: [PaginationService, PrismaService],
    exports: [PrismaService],
})
export class PaginationModule {}
