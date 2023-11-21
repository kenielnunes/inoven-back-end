import { Status } from '@prisma/client';

export class RequestReportDTO {
    dataInicio?: string;
    dataFinal?: string;
    status?: Status;
}
