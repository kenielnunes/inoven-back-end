import { UserSituation, UserType } from '@prisma/client';

export class UserDTO {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    nivelAcesso: UserType;
    situacao: UserSituation;
    createdAt: Date;
    updatedAt: Date;
}
