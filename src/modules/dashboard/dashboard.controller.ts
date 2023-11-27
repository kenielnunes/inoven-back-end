import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('revenue-per-year')
    async revenuePerMonth(@Res() res: Response) {
        try {
            const result = await this.dashboardService.getRevenuePerYear();
            return res.status(200).send({
                content: result,
            });
        } catch (error) {
            return res.status(400).send({
                message: error.message,
            });
        }
    }
}
