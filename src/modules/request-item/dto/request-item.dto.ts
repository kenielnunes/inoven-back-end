export class RequestItemDTO {
    id?: number;
    pedidoId: number;
    produtoId: number;
    quantidade: number;
    observacao: string | null;
    valorUnitario: number;
}
