import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { formatDateToDateTime } from 'src/utils/format-date';
import { ClientService } from '../client/client.service';
import { RequestDTO } from './dto/request.dto';

@Injectable()
export class RequestService {
    constructor(
        private prisma: PrismaService,
        private clientService: ClientService,
        private enumValidate: EnumValidate,
    ) {}

    async create(data: RequestDTO): Promise<RequestDTO> {
        await this.clientService.findOne(data.clienteId); // verifica se existe um cliente com o id

        await this.enumValidate.isValidPaymentMethod(data.formaPagamento); // valida metodo de pagamento

        await this.enumValidate.isValidStatus(data.status); // valida o status

        await this.enumValidate.isValidDeliveryModality(data.modalidadeEntrega); // valida modalidade de entrega

        // cria o pedido
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
