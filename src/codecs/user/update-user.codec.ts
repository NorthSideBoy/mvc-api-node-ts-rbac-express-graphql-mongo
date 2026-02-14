import { z } from "zod";
import {
	birthdaySchema,
	emailSchema,
	lastnameSchema,
	nameSchema,
	usernameSchema,
} from "./fields.schema";

export const updateUserCodec = z
	.object({
		name: nameSchema.optional(),
		lastname: lastnameSchema.optional(),
		username: usernameSchema.optional(),
		email: emailSchema.optional(),
		birthday: birthdaySchema.optional(),
	})
	.partial()
	.strict()
	.refine(
		(data) => Object.values(data).some((value) => value !== undefined),
		"At least one field must be provided",
	);
