export interface PaginatedResult<T> {
    content: T[];
    pagination: {
        totalPages: number;
        totalItems: number;
        currentPage: number;
        perPage: number;
        prevPage: number | null;
        nextPage: number | null;
    };
}

export type PaginateOptions = {
    page?: number | string;
    perPage?: number | string;
};
export type PaginateFunction = <T, K>(
    model: any,
    args?: K,
    options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const paginator = (
    defaultOptions: PaginateOptions,
): PaginateFunction => {
    return async (model, args: any = { where: undefined }, options) => {
        const page = Number(options?.page || defaultOptions?.page) || 1;
        const perPage =
            Number(options?.perPage || defaultOptions?.perPage) || 10;

        const skip = page > 0 ? perPage * (page - 1) : 0;

        const data = await model.findMany();

        const req = await Promise.all([
            model.findMany({
                ...args,
                take: perPage,
                skip,
            }),
        ]);

        const content = req[0];

        const totalItems = data.length;

        const totalPages = Math.ceil(totalItems / perPage);

        return {
            content,
            pagination: {
                totalPages,
                totalItems,
                currentPage: page,
                perPage,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            },
        };
    };
};
