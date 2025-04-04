import {
    Controller,
    Get,
    Header,
    HttpStatus,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { log } from 'console';
import { Response } from 'express';
import { UserRequestDTO } from '../auth/dto/user-request.dto';
import { JwtAuthGuard } from '../auth/jtw-auth.guard';
import { FilterRequestDTO } from '../request/dto/filter-request.dto';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('requests')
    @Header('Content-type', 'application/pdf')
    async request(
        @Query() filter: FilterRequestDTO,
        @Res() res: Response,
        @Req() req: UserRequestDTO,
    ) {
        try {
            const report = await this.reportsService.requestReport(
                req.user.id,
                filter,
            );

            return res.send(report);
        } catch (error) {
            log(error);
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
