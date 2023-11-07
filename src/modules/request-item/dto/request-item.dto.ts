export class RequestItemDTO {
    id?: number;
    pedidoId: number;
    produtoId: number;
    quantidade: number;
    observacao: string | null;
    imagem: string | null;
    valorUnitario: number;
}
