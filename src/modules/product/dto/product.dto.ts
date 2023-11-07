import { Unit } from '@prisma/client';

export class ProductDTO {
    id?: number;
    descricao: string;
    categoria_id: number;
    variacao_id: number;
    unidade: Unit;
    imagem_produto?: any;
}
