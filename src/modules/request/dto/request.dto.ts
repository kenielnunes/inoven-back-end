import { DeliveryModality, PaymentMethods, Status } from '@prisma/client';
import { RequestItemDTO } from 'src/modules/request-item/dto/request-item.dto';

export class RequestDTO {
    id?: number;
    clienteId: number;
    dataPedido: Date;
    dataEntrega: Date;
    status: Status;
    formaPagamento: PaymentMethods;
    modalidadeEntrega: DeliveryModality;
    itensPedido?: Partial<RequestItemDTO[]>;
}
