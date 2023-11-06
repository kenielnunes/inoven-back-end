import { Address } from '@prisma/client';

export class ClientDTO {
    id?: number;
    nome: string;
    telefone: string;
    email: string;
    endereco?: Address;
}
