import { Injectable } from '@nestjs/common';
import fs from 'fs';
import PDFPrinter from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

@Injectable()
export class ReportsService {
    constructor() {}

    async execute() {
        const fonts: TFontDictionary = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique',
            },
        };

        const docDefinitions: TDocumentDefinitions = {
            defaultStyle: {
                font: 'Helvetica',
            },
            content: [
                {
                    text: 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
                },
            ],
        };

        const pdfDoc = new PDFPrinter(fonts).createPdfKitDocument(
            docDefinitions,
        );

        pdfDoc.pipe(fs.createWriteStream('Relatorio.pdf'));

        pdfDoc.end();
    }
}
