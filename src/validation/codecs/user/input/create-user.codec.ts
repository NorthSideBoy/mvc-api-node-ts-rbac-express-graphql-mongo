import z from "zod";
import { roleSchema } from "../../../schemas/user.schemas";
import { registerUserCodec } from "../../auth/input/register-user.codec";

export const createUserCodec = z
	.object({
		...registerUserCodec.shape,
		role: roleSchema,
	})
	.strict();
