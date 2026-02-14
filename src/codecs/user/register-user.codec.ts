import { z } from "zod";
import {
	birthdaySchema,
	emailSchema,
	enableSchema,
	lastnameSchema,
	nameSchema,
	passwordSchema,
	usernameSchema,
} from "./fields.schema";

export const registerUserCodec = z
	.object({
		name: nameSchema,
		lastname: lastnameSchema,
		username: usernameSchema,
		email: emailSchema,
		password: passwordSchema,
		birthday: birthdaySchema,
		enable: enableSchema,
	})
	.strict();
