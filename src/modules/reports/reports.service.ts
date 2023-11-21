import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/PrismaService';
import { RequestReportDTO } from './dto/request-report.dto';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) {}

    async findRequests(data: RequestReportDTO) {
        const args: Prisma.RequestFindManyArgs = {};

        if (data.status) {
            args.where = {
                status: {
                    equals: data.status,
                },
            };
        }

        return await this.prisma.request.findMany(args);
    }
}
