import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { PrismaService } from 'src/database/PrismaService';
import { RequestService } from '../request/request.service';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
        private requestService: RequestService,
    ) {}
    async getRevenuePerYear() {
        // Cria um objeto para mapear os meses para seus equivalentes numéricos
        const monthToNumber = {
            janeiro: 1,
            fevereiro: 2,
            março: 3,
            abril: 4,
            maio: 5,
            junho: 6,
            julho: 7,
            agosto: 8,
            setembro: 9,
            outubro: 10,
            novembro: 11,
            dezembro: 12,
        };

        const paidRequests = await this.requestService.findAll({
            status: 'FINALIZADO',
        });
        const monthsTotals = {};

        for (const request of paidRequests.content) {
            const month = moment(request.dataEntrega)
                .locale('pt-br')
                .format('MMMM');
            const value = request.valorTotal;

            // Inicializa o total do mês se ainda não existir
            if (!monthsTotals[month]) {
                monthsTotals[month] = 0;
            }

            // Soma o valor ao total do mês
            monthsTotals[month] += value;
        }

        // Obtém os meses únicos
        const uniqueMonths = Object.keys(monthsTotals);

        // Obtém os meses únicos e os ordena numericamente
        const sortedMonths = uniqueMonths.sort(
            (a, b) =>
                monthToNumber[a.toLowerCase()] - monthToNumber[b.toLowerCase()],
        );

        const sortedTotalValues = sortedMonths.map((month) =>
            parseFloat(monthsTotals[month].toFixed(2)),
        );

        return {
            meses: sortedMonths,
            valores: sortedTotalValues,
        };
    }
}
