import { PaginationDTO } from 'src/modules/pagination/dto/pagination.dto';

export class FilterClientsDTO extends PaginationDTO {
    nomeCliente: string;
    usuarioId: number;
}
