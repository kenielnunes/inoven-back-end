import { TDocumentDefinitions } from 'pdfmake/interfaces';

export async function generatePdfWithPdfMake(
    docDefinitions: TDocumentDefinitions,
) {
    // // console.log('pdfDoc -> ', pdfDoc);
    // const chunks = [];
    // return new Promise((resolve: any) => {
    //     pdfDoc.on('data', (chunk) => {
    //         // console.log('chunk -> ', chunk);
    //         chunks.push(chunk);
    //     });
    //     pdfDoc.end();
    //     pdfDoc.on('end', () => {
    //         const result = Buffer.concat(chunks);
    //         resolve(result);
    //     });
    // });
}
