import z from "zod";
import { dateSchema } from "../../schemas/common.schemas";

export const queryCodec = z
	.object({
		page: z.coerce.number<number>().int().min(1).optional(),
		limit: z.coerce.number<number>().int().min(1).optional(),
		sort: z.string().trim().min(1).optional(),
		search: z.string().trim().min(1).optional(),
		createdAtFrom: dateSchema.optional(),
		createdAtTo: dateSchema.optional(),
		updatedAtFrom: dateSchema.optional(),
		updatedAtTo: dateSchema.optional(),
	})
	.strict();
