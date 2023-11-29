import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/PrismaService';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(data: AuthDTO) {
        const user = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            throw new Error('Nenhum usuário encontrado com esse email');
        }

        const auth = user.senha === data.senha;

        if (!auth) {
            throw new Error('Senha incorreta');
        }

        return user;
    }

    async login(data: AuthDTO) {
        const userExists = await this.validateUser(data);

        const payload = {
            sub: userExists.id,
            name: userExists.nome,
            email: userExists.email,
        };

        return this.jwtService.sign(payload);
    }
}
