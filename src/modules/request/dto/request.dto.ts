import { DeliveryModality, PaymentMethods, Status } from '@prisma/client';
import { RequestItemDTO } from 'src/modules/request-item/dto/request-item.dto';

export class RequestDTO {
    id?: number;
    cliente_id: number;
    data_pedido: Date;
    data_entrega: Date;
    status: Status;
    forma_pagamento: PaymentMethods;
    modalidade_entrega: DeliveryModality;
    itens_pedido?: Partial<RequestItemDTO[]>;
}
