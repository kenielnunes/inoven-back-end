import {
    Client,
    DeliveryModality,
    PaymentMethods,
    Status,
} from '@prisma/client';
import { RequestItemDTO } from 'src/modules/request-item/dto/request-item.dto';

export class FindRequestDTO {
    usuarioId: number;
    id?: number;
    clienteId: number;
    cliente: Client;
    dataPedido: Date;
    dataEntrega: Date;
    observacao: null | string;
    status: Status;
    formaPagamento: PaymentMethods;
    modalidadeEntrega: DeliveryModality;
    itensPedido: RequestItemDTO[];
    valorTotal: number;
}
