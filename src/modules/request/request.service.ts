import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { formatDateToDateTime } from 'src/utils/format-date';
import { RequestDTO } from './dto/request.dto';

@Injectable()
export class RequestService {
    constructor(private prisma: PrismaService) {}

    async create(data: RequestDTO): Promise<RequestDTO> {
        console.log(new Date('2017-06-01T08:30').toISOString());

        const request = await this.prisma.request.create({
            data: {
                ...data,
                dataPedido: formatDateToDateTime(data.dataPedido),
                dataEntrega: formatDateToDateTime(data.dataEntrega),
            },
        });

        return request;
    }

    async findAll() {
        const requests = await this.prisma.request.findMany({
            include: {
                cliente: true,
            },
        });

        return requests;
    }

    async findAllWithFilters(
        status: string,
        paymentMethod: string,
    ): Promise<RequestDTO[]> {
        const filteredRequests = (await this.findAll()).filter((request) => {
            if (status && request.status !== status) {
                return false;
            }
            if (paymentMethod && request.formaPagamento !== paymentMethod) {
                return false;
            }
            return true;
        });

        return filteredRequests;
    }

    findOne(id: number) {
        return `This action returns a #${id} request`;
    }

    update(id: number) {
        return `This action updates a #${id} request`;
    }

    remove(id: number) {
        return `This action removes a #${id} request`;
    }
}
