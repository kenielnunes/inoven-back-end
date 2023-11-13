import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PaginationModule {}
