import { PaginationDTO } from 'src/modules/pagination/dto/pagination.dto';

export class FilterRequestDTO extends PaginationDTO {
    cliente: string;
}
