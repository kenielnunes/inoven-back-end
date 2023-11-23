import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class RequestItemService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return await this.prisma.requestItem.findMany();
    }

    findOne(id: number) {
        return `This action returns a #${id} requestItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} requestItem`;
    }
}
