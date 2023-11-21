import { Address } from '@prisma/client';

export class CreateClientDTO {
    nome: string;
    telefone: string;
    email: string;
    endereco?: Address;
    usuarioId: number;
    createdAt: Date;
    updatedAt: Date;
}
