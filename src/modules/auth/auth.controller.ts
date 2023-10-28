import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async auth(@Body() data: AuthDTO, @Res() res: Response) {
        try {
            const accessToken = await this.authService.login({
                email: data.email,
                senha: data.senha,
            });

            return res.status(HttpStatus.OK).send({
                statusCode: HttpStatus.OK,
                message: 'Autenticado com sucesso',
                accessToken: accessToken,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
