import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { ClientService } from '../client/client.service';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
    controllers: [RequestController],
    providers: [RequestService, PrismaService, ClientService, EnumValidate],
})
export class RequestModule {}
