import { Unit } from '@prisma/client';

export class ProductDTO {
    id?: number;
    descricao: string;
    categoriaId: number;
    variacaoId: number;
    unidade: Unit;
    imagensProduto?: any;
}
