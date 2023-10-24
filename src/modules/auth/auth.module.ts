import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/database/PrismaService';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './config/contants';
import { LocalStrategy } from './config/local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
