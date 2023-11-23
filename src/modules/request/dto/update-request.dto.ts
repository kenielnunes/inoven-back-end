import { DeliveryModality, PaymentMethods, Status } from '@prisma/client';
import { RequestItemDTO } from 'src/modules/request-item/dto/request-item.dto';

// Assume RequestUpdateInput is the Prisma generated type for updating Request
export class UpdateRequestDTO {
    id?: number;
    status?: Status;
    formaPagamento?: PaymentMethods;
    modalidadeEntrega?: DeliveryModality;
    dataEntrega?: Date;
    observacao?: string;
    itensPedido?: RequestItemDTO[];
}
