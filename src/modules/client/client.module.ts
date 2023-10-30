import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
    controllers: [ClientController],
    providers: [ClientService, PrismaService],
})
export class ClientModule {}
