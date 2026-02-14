import { z } from "zod";
import {
	birthdaySchema,
	emailSchema,
	enableSchema,
	lastnameSchema,
	nameSchema,
	passwordSchema,
	roleSchema,
	usernameSchema,
} from "./fields.schema";

export const createUserCodec = z
	.object({
		name: nameSchema,
		lastname: lastnameSchema,
		username: usernameSchema,
		email: emailSchema,
		password: passwordSchema,
		birthday: birthdaySchema,
		enable: enableSchema,
		role: roleSchema,
	})
	.strict();
