import { Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { log } from 'console';
import moment from 'moment';
import { RequestService } from '../request/request.service';

@Injectable()
export class DashboardService {
    constructor(private requestService: RequestService) {}
    async getRevenueForCurrentYear(usuarioId: number) {
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

        const today = moment();
        const startOfYear = today.clone().startOf('year');
        const endOfYear = today.clone().endOf('year');

        const paidRequests = await this.requestService.findAll(usuarioId, {
            status: Status.FINALIZADO,
            dataInicio: startOfYear.toISOString(),
            dataFim: endOfYear.toISOString(),
        });

        const monthsTotals = {};

        for await (const request of paidRequests.content) {
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
            months: sortedMonths,
            values: sortedTotalValues,
        };
    }

    async getAllRevenues(usuarioId: number) {
        const requests = await this.requestService.findAll(usuarioId, {
            status: Status.FINALIZADO,
            perPage: 9999999999999,
        });

        log(requests);

        const totalValue = requests.content.reduce(
            (acc, request) => acc + request.valorTotal,
            0,
        );

        return Number(totalValue.toFixed(2));
    }

    async getRevenueForCurrentMonth(usuarioId: number): Promise<{
        revenue: number;
        variation: number;
    }> {
        const today = moment();
        const firstDayOfMonth = today.clone().startOf('month');
        const lastDayOfMonth = today.clone().endOf('month');

        const filter = {
            dataInicio: firstDayOfMonth.toISOString(),
            dataFim: lastDayOfMonth.toISOString(),
            status: Status.FINALIZADO,
        };

        const requests = await this.requestService.findAll(usuarioId, filter);

        const totalValue = requests.content.reduce(
            (acc, request) => acc + request.valorTotal,
            0,
        );

        const currentMonthRevenue = Number(totalValue.toFixed(2));

        // Obtém o valor do mês anterior
        const previousMonthEnd = moment().subtract(1, 'months').endOf('month');

        const previousMonthStart = previousMonthEnd.clone().startOf('month');
        const previousMonthFilter = {
            dataInicio: previousMonthStart.toISOString(),
            dataFim: previousMonthEnd.toISOString(),
            status: Status.FINALIZADO,
        };

        const previousMonthRevenue = await this.requestService.findAll(
            usuarioId,
            previousMonthFilter,
        );

        log('previousMonthRevenue', previousMonthRevenue);

        const previousMonthTotalValue = previousMonthRevenue.content.reduce(
            (acc, request) => acc + request.valorTotal,
            0,
        );

        // Calcula a variação percentual
        const variation =
            currentMonthRevenue !== 0
                ? ((currentMonthRevenue - previousMonthTotalValue) /
                      currentMonthRevenue) *
                  100
                : 0;

        const roundedVariation = Number(variation.toFixed(2));

        return {
            revenue: currentMonthRevenue,
            variation: roundedVariation,
        };
    }
}
