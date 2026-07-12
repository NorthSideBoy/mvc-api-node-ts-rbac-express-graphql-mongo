import type { PaginateResult } from "mongoose";
import type { Pagination } from "../types/pagination.type";
import type Search from "../types/search.type";

function pagination<T>(result: PaginateResult<T>): Pagination {
	return {
		page: result.page ?? 1,
		limit: result.limit,
		total: result.totalDocs,
		pages: result.totalPages,
		hasNext: result.hasNextPage,
		hasPrev: result.hasPrevPage,
	};
}

export function search<TDocument, TOutput>(
	result: PaginateResult<TDocument>,
	mapDoc: (document: TDocument) => TOutput,
): Search<TOutput> {
	return {
		docs: result.docs.map(mapDoc),
		pagination: pagination(result),
	};
}
