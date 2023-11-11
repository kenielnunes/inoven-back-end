// pagination.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
    paginate<T>(items: T[], page: number, limit: number): Pagination<T> {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / limit);
        const currentPage = page;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;

        const paginatedItems = items.slice(startIndex, endIndex);

        return {
            pagination: {
                page: currentPage,
                limit: limit,
                totalItems: totalItems,
                totalPages: totalPages,
                prevPage: prevPage,
                nextPage: nextPage,
            },
            content: paginatedItems,
        };
    }
}

export interface Pagination<T> {
    content: T[];
    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        prevPage: number | null;
        nextPage: number | null;
    };
}
