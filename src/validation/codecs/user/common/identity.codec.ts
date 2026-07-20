import z from "zod";
import { idSchema } from "../../../schemas/common.schemas";
import { roleSchema, usernameSchema } from "../../../schemas/user.schemas";

export const identityCodec = z.object({
	id: idSchema,
	username: usernameSchema,
	role: roleSchema,
	enable: z.boolean().default(true),
});
