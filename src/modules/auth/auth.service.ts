import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async auth(data: AuthDTO) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            throw new Error('Nenhum usuário encontrado nesse email');
        }

        const auth = user.senha === data.senha;

        if (!auth) {
            throw new Error('Senha incorreta');
        }

        return auth;
    }
}
