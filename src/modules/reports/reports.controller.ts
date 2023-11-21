import { Body, Controller, Get } from '@nestjs/common';
import { RequestReportDTO } from './dto/request-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @Get('requests')
    async findAll(@Body() data: RequestReportDTO) {
        return await this.reportsService.findRequests(data);
    }
}
