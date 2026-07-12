import z from "zod";
import { firstnameSchema, lastnameSchema } from "../../schemas/person.schemas";

export const personCodec = z
	.object({
		firstname: firstnameSchema,
		lastname: lastnameSchema,
	})
	.strict();
