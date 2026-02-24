import type Pagination from "./pagination.dto";

export default interface Search<T> {
	docs: T[];
	pagination: Pagination;
}
