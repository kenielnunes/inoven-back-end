import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import { PrismaService } from 'src/database/PrismaService';
import { formatNumberToCurrency } from 'src/utils/format-number-to-currency';
import { generatePdfWithPdfMake } from 'src/utils/generate-pdf';
import { stringToSlug } from 'src/utils/string-to-slug';
import { FindRequestDTO } from '../request/dto/find-request.dto';
import { RequestService } from '../request/request.service';

@Injectable()
export class ReportsService {
    constructor(
        private prisma: PrismaService,
        private requestService: RequestService,
    ) {}

    async execute(): Promise<Buffer> {
        const requests = await this.requestService.findAll();

        // console.log('movimentacoes -> ', movimentacoes);

        const fonts: TFontDictionary = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique',
            },
        };

        const docDefinitions = await this.generateDocDefinitions(
            requests.content as any,
        );

        return await generatePdfWithPdfMake(fonts, docDefinitions);
    }

    private async generateDocDefinitions(
        data: FindRequestDTO[],
    ): Promise<TDocumentDefinitions> {
        console.log('data: ', data);

        // const dataHoraAtual = moment()
        //     .tz('America/Sao_Paulo')
        //     .format('DD/MM/YYYY HH:mm');

        const nomeAssociado = 'Keniel';

        const clientName = 'Keniel';
        const clientNameSlug = stringToSlug(clientName);

        const docTransactions = data.map((transaction) => {
            const valorTotal = !transaction.valorTotal
                ? ''
                : transaction.valorTotal;

            return [
                {
                    text: "moment(transaction.dataPedido).format('DD/MM/YYYY')",
                    style: 'tableContent',
                },
                {
                    text: " moment(transaction.dataPedido).format('DD/MM/YYYY')",
                    style: 'tableContent',
                },
                { text: transaction.status, style: 'tableContent' },
                { text: transaction.formaPagamento, style: 'tableContent' },
                {
                    text: `${formatNumberToCurrency(
                        Number(transaction.valorTotal),
                        {
                            symbol: true,
                        },
                    )}`,
                    alignment: 'right',
                    noWrap: true,
                    style: 'tableContent',
                },
            ];
        });

        const footerQuestionOne =
            'Como recarregar o saldo disponível no meu cartão?';

        const footerAnswerOne = `É possível recarregar o seu cartão por boleto bancário, PIX, depósito identificado, DOC ou TED. Para carregar o cartão por boleto no app, toque em “Recarregar cartão” e, depois, em “boleto bancário”. Escolha o valor da recarga e, para finalizar, toque em “gerar boleto”. O código pode ser copiado ou enviado por e-mail para fazer o pagamento.\n
        PIX, por chave indicado. Já via TED ou DOC, o cliente deve transferir a quantia desejada para a conta bancaria indicada. Ambas indicações, estão informadas em Aplicativos e Site, em área acesso restrita, juntamente com seu extrato e de mais informações pessoais da sua conta.
        `;
        const footerQuestionTwo =
            'Como funciona cartão pré-pago em comparação com um cartão de débito?';

        const footerAnswerTwo = `Embora o cartão de débito e o pré-pago tenham semelhanças, como serem baseados em saldo na conta, a maior diferença está na função. O cartão de débito é vinculado a uma conta-corrente de onde provém o saldo a ser utilizado, enquanto o pré-pago é recarregado pelo usuário com quantias específicas.\n
        Vale lembrar que, enquanto o cartão de débito é passado em débito em maquininhas (POS), o cartão pré-pago utiliza a função crédito em POS Virtuais ou em maquininhas (TEF) em estabelecimentos credenciados.
        `;

        const footerQuestionThree =
            'Quais as desvantagens do seu cartão em relação a outros cartões bandeirados (Visa, Master e outros)?';

        const footerAnswerThree = `O seu cartão não aceita compras parceladas. Além disso, só é possível fazer compras no cartão pré-pago se o cliente tiver saldo na conta. Ainda, o seu cartão não possui taxa de gerenciamento do cartão, algo não muito comum em outras bandeiras.
        `;

        const docDefinitions: TDocumentDefinitions = {
            // compress: false,
            defaultStyle: {
                font: 'Helvetica',
            },
            content: [
                {
                    text: `Extrato Detalhado`,
                    alignment: 'center',
                    fontSize: 16,
                    bold: true,
                    margin: [0, 30, 0, 30],
                },
                { text: 'Dados do Cartão', style: 'subheader' },
                {
                    text: `Nome: ${nomeAssociado}`,
                    marginBottom: 5,
                },
                '\n',
                // {
                //     text: 'Detalhes da Compra',
                //     style: 'subheader',
                //     marginBottom: 20,
                // },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    text: 'Detalhes do Período',
                                    style: 'subheader',
                                    alignment: 'left',
                                },
                                {
                                    text: `Data e hora de emissão: ${'dataHoraAtual'}`,
                                    alignment: 'right',
                                    margin: [0, 10, 0, 10],
                                    decoration: 'underline',
                                },
                            ],
                        ],
                    },
                    layout: 'noBorders',
                    margin: [0, 0, 0, 15],
                },
                {
                    table: {
                        headerRows: 1,
                        dontBreakRows: true,
                        widths: [
                            'auto',
                            'auto',
                            '15%',
                            'auto',
                            '10%',
                            'auto',
                            'auto',
                            'auto',
                            '*',
                        ],
                        body: [
                            [
                                {
                                    text: 'Data',
                                    style: 'tableHeader',
                                },

                                {
                                    text: 'NSU',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Autorização',
                                    style: 'tableHeader',
                                },

                                {
                                    text: 'Parcela',
                                    style: 'tableHeader',
                                },
                                {
                                    text: 'Valor',
                                    style: 'tableHeader',
                                    alignment: 'right',
                                },
                            ],
                            ...docTransactions,
                            [
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: '',
                                },
                                {
                                    text: 'Total',
                                    fontSize: 10,
                                    bold: true,
                                    style: 'tableContent',
                                },
                                {
                                    text: `${formatNumberToCurrency(
                                        Number(data[0].valorTotal),
                                        { symbol: true },
                                    )}`,
                                    fontSize: 10,
                                    noWrap: true,
                                    bold: true,
                                    alignment: 'right',
                                    style: 'tableContent',
                                },
                            ],
                        ],
                    },
                    layout: 'lightHorizontalLines',
                },
                // {
                //     text: footerQuestionOne,
                //     style: 'footerTitle',
                // },
                // {
                //     text: footerAnswerOne,
                //     style: 'footerContent',
                // },
                // {
                //     text: footerQuestionTwo,
                //     style: 'footerTitle',
                // },
                // {
                //     text: footerAnswerTwo,
                //     style: 'footerContent',
                // },
                // {
                //     text: footerQuestionThree,
                //     style: 'footerTitle',
                // },
                // {
                //     text: footerAnswerThree,
                //     style: 'footerContent',
                // },
            ],
            pageMargins: [40, 40, 40, 210],

            footer: function (currentPage, pageCount, pageSize) {
                // if (currentPage === pageCount) {
                return [
                    {
                        stack: [
                            {
                                text: footerQuestionOne,
                                style: 'footerTitle',
                            },
                            {
                                text: footerAnswerOne,
                                style: 'footerContent',
                            },
                            {
                                text: footerQuestionTwo,
                                style: 'footerTitle',
                            },
                            {
                                text: footerAnswerTwo,
                                style: 'footerContent',
                            },
                            {
                                text: footerQuestionThree,
                                style: 'footerTitle',
                            },
                            {
                                text: footerAnswerThree,
                                style: 'footerContent',
                            },
                            {
                                text: `${currentPage}`,
                                alignment: 'right',
                            },
                        ],
                        margin: [40, 0],
                    },
                ];
                // }
            },

            // Evento afterPageContent

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    alignment: 'center',
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 10],
                },
                tableExample: {
                    margin: [0, 5, 0, 15],
                    alignment: 'center',
                },
                tableHeader: {
                    // bold: true,
                    fontSize: 10,
                    color: 'black',
                    marginBottom: 2,
                    alignment: 'center',
                },
                tableContent: {
                    fontSize: 8,
                    margin: [0, 5],
                    alignment: 'center',
                },
                footerTitle: {
                    fontSize: 10,
                    margin: [0, 5],
                    alignment: 'left',
                    bold: true,
                },
                footerContent: {
                    fontSize: 8,
                    alignment: 'justify',
                },
            },
        };

        return docDefinitions;
    }
}
