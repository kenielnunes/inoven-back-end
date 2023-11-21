import { Category, Unit } from '@prisma/client';

export class CreateProductDTO {
    usuarioId?: number;
    categoria: Category;
    descricao: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    unidade: Unit;
    imagensProduto?: any;
}
