import {
    Controller,
    Get,
    Header,
    HttpStatus,
    Query,
    Res,
} from '@nestjs/common';
import { log } from 'console';
import { Response } from 'express';
import { FilterRequestDTO } from '../request/dto/filter-request.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('requests')
    @Header('Content-type', 'application/pdf')
    async request(@Query() filter: FilterRequestDTO, @Res() res: Response) {
        try {
            const report = await this.reportsService.requestReport(filter);

            return res.send(report);
        } catch (error) {
            log('error ->', error);
            return res.status(HttpStatus.BAD_REQUEST).send({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message,
            });
        }
    }
}
