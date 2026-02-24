import type Result from "../DTOs/operation/output/result.dto";

export function result(count: number): Result {
	return {
		success: count > 0,
		affected: count,
	};
}
