import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { EnumValidate } from 'src/utils/enum-validate';
import { formatDateToDateTime } from 'src/utils/format-date';
import { ClientService } from '../client/client.service';
import { StorageService } from '../google/storage/storage.service';
import { ProductService } from '../product/product.service';
import { RequestDTO } from './dto/request.dto';

@Injectable()
export class RequestService {
    constructor(
        private prisma: PrismaService,
        private clientService: ClientService,
        private enumValidate: EnumValidate,
        private productService: ProductService,
        private storageService: StorageService,
    ) {}

    async create(data: RequestDTO): Promise<RequestDTO> {
        await this.clientService.findOne(data.clienteId); //verifica se o cliente existe

        await this.enumValidate.isValidPaymentMethod(data.formaPagamento); //verifica se o método de pagamento é válido

        await this.enumValidate.isValidStatus(data.status); // verifica se o status é valido

        await this.enumValidate.isValidDeliveryModality(data.modalidadeEntrega); // verifica se a modalidade de entrega é valida

        for (const item of data.itensPedido) {
            const existsProduct = await this.productService.findOne(
                item.produtoId,
            );

            if (!existsProduct) {
                throw new Error('Produto não encontrado');
            }
        }

        const requestCreateData = {
            ...data,
            dataPedido: formatDateToDateTime(data.dataPedido),
            dataEntrega: formatDateToDateTime(data.dataEntrega),
            itensPedido: {
                create: data.itensPedido,
            },
        };

        // Cria o pedido
        const request = await this.prisma.request.create({
            data: requestCreateData,
        });

        return request;
    }

    async findAll() {
        const requests = await this.prisma.request.findMany({
            //     where: {
            //         status: {
            //             equals: status,
            //         },
            //         dataEntrega: {
            //             lte: new Date(dataEntrega),
            // gte: 2022-01-30,
            //         },
            //     },
            include: {
                cliente: true,
                itensPedido: true,
            },
        });

        return requests;
    }

    async findOne(id: number) {
        return this.prisma.request.findFirst({
            where: {
                id: id,
            },
        });
    }

    update(id: number) {
        return `This action updates a #${id} request`;
    }

    remove(id: number) {
        return `This action removes a #${id} request`;
    }
}
