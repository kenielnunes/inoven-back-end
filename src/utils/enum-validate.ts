import {
    Category,
    DeliveryModality,
    PaymentMethods,
    Status,
} from '@prisma/client';

export class EnumValidate {
    async execute(value: string, objEnum: object) {
        const objValues = Object.keys(objEnum);

        const isValid = objValues.includes(value);

        return isValid;
    }

    async isValidPaymentMethod(value: string) {
        const isValidPaymentMethod = await this.execute(value, PaymentMethods);

        if (!isValidPaymentMethod) {
            throw new Error('Método de pagamento inválido');
        }
    }

    async isValidStatus(value: string) {
        const isValidStatus = await this.execute(value, Status);

        if (!isValidStatus) {
            throw new Error('Status inválido');
        }
    }

    async isValidDeliveryModality(value: string) {
        const isValidDeliveryMethod = await this.execute(
            value,
            DeliveryModality,
        );

        if (!isValidDeliveryMethod) {
            throw new Error('Método de entrega inválido');
        }
    }

    async isValidCategory(value: string) {
        const isValidCategory = await this.execute(value, Category);

        if (!isValidCategory) {
            throw new Error('Categoria inválida');
        }
    }
}
