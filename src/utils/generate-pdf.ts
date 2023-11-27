import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

export async function generatePdfWithPdfMake(
    fonts: TFontDictionary,
    docDefinitions: TDocumentDefinitions,
): Promise<Buffer> {
    const printer = new PdfPrinter(fonts);

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    // console.log('pdfDoc -> ', pdfDoc);

    const chunks = [];

    return new Promise((resolve: any) => {
        pdfDoc.on('data', (chunk) => {
            // console.log('chunk -> ', chunk);
            chunks.push(chunk);
        });

        pdfDoc.end();

        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);

            resolve(result);
        });
    });
}
