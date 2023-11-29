import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { PrismaService } from 'src/database/PrismaService';
import { generatePdfWithPdfMake } from 'src/utils/generate-pdf';
import { FilterRequestDTO } from '../request/dto/filter-request.dto';
import { RequestService } from '../request/request.service';

@Injectable()
export class ReportsService {
    constructor(
        private prisma: PrismaService,
        private requestService: RequestService,
    ) {}

    async requestReport(usuarioId: number, filter: FilterRequestDTO) {
        const fonts: TFontDictionary = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique',
            },
        };

        const req = await this.requestService.findAll(usuarioId, filter);

        const requests = req.content;

        const body = [];

        for await (const request of requests) {
            const rows = [];

            rows.push({ text: request.id, style: 'tableContent' });
            rows.push({ text: request.cliente.nome, style: 'tableContent' });
            rows.push({ text: request.status, style: 'tableContent' });
            rows.push({
                text: request.observacao || 'Nada informado',
                style: 'tableContent',
            });
            rows.push({ text: request.formaPagamento, style: 'tableContent' });
            rows.push({
                text: `R$ ${request.valorTotal.toFixed(2)}`,
                style: 'tableContent',
            });

            body.push(rows);
        }

        const totalValue = requests.reduce(
            (acc, request) => acc + request.valorTotal,
            0,
        );

        body.push([
            { text: 'Total', style: 'tableHeader', colSpan: 5 },
            {},
            {},
            {},
            {},
            { text: `R$ ${totalValue.toFixed(2)}`, style: 'tableHeader' },
        ]);

        if (requests.length === 0) {
            const docDefinitions: TDocumentDefinitions = {
                defaultStyle: {
                    font: 'Helvetica',
                },
                content: [
                    {
                        text: 'Relatório de Pedidos',
                        style: 'header',
                    },
                    {
                        text: `Data e hora de emissão: ${moment().format(
                            'DD/MM/YYYY HH:mm:ss',
                        )}`,
                        style: 'subheader',
                    },
                    {
                        style: 'subheader',
                        text: 'Nada encontrado',
                        alignment: 'center',
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                        margin: [5, 5, 5, 5],
                    },
                    tableContent: {
                        fontSize: 13,
                        color: 'black',
                        margin: [5, 5, 5, 5],
                    },
                },
            };

            return await generatePdfWithPdfMake(fonts, docDefinitions);
        } else {
            const docDefinitions: TDocumentDefinitions = {
                defaultStyle: {
                    font: 'Helvetica',
                },
                content: [
                    {
                        text: 'Relatório de Pedidos',
                        style: 'header',
                    },
                    {
                        text: `Data de emissão: ${moment().format(
                            'DD/MM/YYYY HH:mm:ss',
                        )}`,
                        style: 'subheader',
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [30, '*', '*', '*', 80, 80],
                            body: [
                                [
                                    { text: 'ID', style: 'tableHeader' },
                                    { text: 'Cliente', style: 'tableHeader' },
                                    { text: 'Status', style: 'tableHeader' },
                                    {
                                        text: 'Observação',
                                        style: 'tableHeader',
                                    },
                                    {
                                        text: 'Forma de pagamento',
                                        style: 'tableHeader',
                                    },
                                    { text: 'Valor', style: 'tableHeader' },
                                ],
                                ...body,
                            ],
                        },
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15],
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                        margin: [5, 5, 5, 5],
                    },
                    tableContent: {
                        fontSize: 13,
                        color: 'black',
                        margin: [5, 5, 5, 5],
                    },
                },
            };

            return await generatePdfWithPdfMake(fonts, docDefinitions);
        }
    }
}
