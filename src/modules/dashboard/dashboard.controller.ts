import {
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserRequestDTO } from '../auth/dto/user-request.dto';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('revenue-per-year')
    async revenuePerMonth(@Res() res: Response, @Req() req: UserRequestDTO) {
        try {
            const result = await this.dashboardService.getRevenueForCurrentYear(
                req.user.id,
            );
            return res.status(200).send({
                content: result,
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message,
            });
        }
    }

    @Get('total-revenues')
    async allRevenues(@Res() res: Response, @Req() req: UserRequestDTO) {
        try {
            const value = await this.dashboardService.getAllRevenues(
                req.user.id,
            );

            return res.status(HttpStatus.OK).send({
                content: {
                    value: value,
                },
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }

    @Get('month-revenues')
    async revenueCurrentMonth(
        @Res() res: Response,
        @Req() req: UserRequestDTO,
    ) {
        try {
            const data = await this.dashboardService.getRevenueForCurrentMonth(
                req.user.id,
            );

            return res.status(HttpStatus.OK).send({
                content: data,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
