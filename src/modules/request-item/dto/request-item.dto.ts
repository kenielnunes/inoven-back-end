export class RequestItemDTO {
    id?: number;
    pedido_id: number;
    produto_id: number;
    quantidade: number;
    observacao: string | null;
    imagem: string | null;
    valor_unitario: number;
}
