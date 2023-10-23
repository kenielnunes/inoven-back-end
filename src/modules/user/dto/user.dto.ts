import { UserSituation, UserType } from '@prisma/client';

export class UserDTO {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    tipoUsuario: UserType;
    situacao: UserSituation;
}
