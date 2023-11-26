import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('requests')
    // @Header('Content-type', 'application/pdf')
    async findAll(@Res() res: Response) {
        try {
            await this.reportsService.execute();

            res.send('relatorio ok');
        } catch (error) {
            console.log('error.message -> ', error.message);
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
