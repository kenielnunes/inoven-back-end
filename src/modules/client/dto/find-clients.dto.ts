import { Address } from '@prisma/client';

export class FindClientsDTO {
    createdAt: Date;
    updatedAt: Date;
    nome: string;
    telefone: string;
    email: string;
    endereco?: Address;
}
