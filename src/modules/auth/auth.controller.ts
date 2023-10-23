import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async create(@Body() data: AuthDTO, @Res() res: Response) {
        try {
            await this.authService.auth(data);

            const token = jwt.sign(
                { sub: data.email, username: data.email },
                'secret',
                { expiresIn: '1h' },
            );

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Autenticado com sucesso',
                accessToken: token,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
