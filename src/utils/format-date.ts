export function formatDateToDateTime(date: Date): string | null {
    const formatedDate = new Date(date).toISOString();

    return formatedDate; // Retorna null se o valor de entrada não for uma data e hora válida
}
