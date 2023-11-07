import { UserSituation, UserType } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class UserDTO {
    id?: number;
    nome: string;
    @IsEmail(
        {},
        {
            message: 'TEM QUE SER EMAIL BURRO',
        },
    )
    email: string;
    senha: string;
    @IsEnum(UserType, {
        message: `É apenas valido os valores: ${Object.keys(UserType)}`,
    })
    nivelAcesso: UserType;
    @IsEnum(UserSituation, {
        message: `É apenas valido os valores: ${Object.keys(UserSituation)}`,
    })
    situacao: UserSituation;
}
