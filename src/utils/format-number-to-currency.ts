/**
 * Formata um número como valor monetário em reais.
 *
 * @param number O número a ser formatado.
 * @param options Opções para formatação personalizada. (Opcional)
 *               - symbol: Se verdadeiro, inclui o símbolo de moeda (R$) na formatação.
 *               - centsToReal: Se verdadeiro, divide o número por 100 para converter centavos em reais.
 *               - integerOnly: Se verdadeiro, retorna apenas o número inteiro, sem os centavos.
 *               - useComma: Se verdadeiro, usa vírgula como separador decimal. Caso contrário, usa ponto.
 * @returns O valor formatado como um valor monetário em reais.
 */
export function formatNumberToCurrency(
    number: number,
    options?: {
        symbol?: boolean;
        centsToReal?: boolean;
        integerOnly?: boolean;
        useComma?: boolean;
    },
): string {
    const {
        symbol = true,
        centsToReal = false,
        integerOnly = false,
        useComma = false,
    } = options || {};

    // Se centsToReal for verdadeiro, divide o número por 100 para converter centavos em reais
    if (centsToReal) {
        number /= 100;
    }

    // Cria um objeto Intl.NumberFormat para formatar o número como valor monetário em formato brasileiro
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: integerOnly ? 0 : 2,
        maximumFractionDigits: integerOnly ? 0 : 2,
    });

    // Formata o número com a configuração definida
    const formattedValue = formatter.format(number);

    // Substitui a vírgula pelo ponto se a opção useComma for falsa
    const decimalSeparator = useComma ? ',' : '.';
    const formattedWithDecimal = formattedValue.replace(',', decimalSeparator);

    // Remove o símbolo da moeda da string formatada e remove espaços em branco adicionais se o parametro symbol for undefined | false
    if (!symbol) {
        const valueWithoutSymbol = formattedWithDecimal
            .replace('R$', '')
            .trim();

        return valueWithoutSymbol;
    }

    // Retorna a string formatada, incluindo o símbolo da moeda
    return formattedWithDecimal;
}
