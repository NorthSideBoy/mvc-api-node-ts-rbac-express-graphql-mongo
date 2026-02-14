import { z } from "zod";
import { roleSchema } from "./fields.schema";

export const updateUserRoleCodec = z
	.object({
		role: roleSchema,
	})
	.strict();
