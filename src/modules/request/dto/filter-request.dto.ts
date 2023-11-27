import { PaymentMethods, Status } from '@prisma/client';
import { PaginationDTO } from 'src/modules/pagination/dto/pagination.dto';

export class FilterRequestDTO extends PaginationDTO {
    cliente?: string;
    clienteId?: number;
    status?: Status;
    dataInicio?: Date | string;
    dataFim?: Date | string;
    formaPagamento?: PaymentMethods;
}
