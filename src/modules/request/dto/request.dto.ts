import { DeliveryModality, PaymentMethods, Status } from '@prisma/client';

export class RequestDTO {
    id?: number;
    clienteId: number;
    dataPedido: Date;
    dataEntrega: Date;
    status: Status;
    formaPagamento: PaymentMethods;
    modalidadeEntrega: DeliveryModality;
}
