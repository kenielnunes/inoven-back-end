import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { PaginationService } from '../pagination/pagination.service';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
    controllers: [ClientController],
    providers: [ClientService, PrismaService, PaginationService],
})
export class ClientModule {}
