import z from "zod";
import { dateSchema, idSchema } from "../../schemas/common.schemas";

export const entityCodec = z
	.object({
		id: idSchema,
		createdAt: dateSchema,
		updatedAt: dateSchema,
	})
	.strict();
