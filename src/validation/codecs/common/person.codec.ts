import z from "zod";
import { dateSchema } from "../../schemas/common.schemas";
import { firstnameSchema, lastnameSchema } from "../../schemas/person.schemas";

export const personCodec = z
	.object({
		firstname: firstnameSchema,
		lastname: lastnameSchema,
		birthday: dateSchema.optional(),
	})
	.strict();
