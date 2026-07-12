import type { Result } from "../types/result.type";

export function result<Meta = unknown>(
	count: number,
	meta?: Meta,
): Result<Meta> {
	const output: Result<Meta> = {
		success: count > 0,
		affected: count,
	};

	if (meta !== undefined) output.meta = meta;

	return output;
}
