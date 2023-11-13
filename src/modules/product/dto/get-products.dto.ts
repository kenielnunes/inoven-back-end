import { Unit } from '@prisma/client';

export class GetProductsDTO {
    id?: string;
    descricao: string;
    categoriaId: string;
    variacaoId: string;
    unidade: Unit;
    imagensProduto?: any;
    page: string;
    perPage: string;
}
