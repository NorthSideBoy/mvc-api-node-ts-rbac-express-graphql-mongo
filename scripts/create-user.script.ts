import { confirm, input, password, select } from "@inquirer/prompts";
import type { CreateUser as DTO } from "../src/DTOs/user/input/create-user.dto";
import { Role } from "../src/enums/role.enum";
import UserService from "../src/services/user.service";
import { logger } from "../src/utils/logger.util";
import { decode, valid } from "../src/utils/validator.util";
import { createUserCodec } from "../src/validation/codecs/user/input/create-user.codec";
import { dateSchema } from "../src/validation/schemas/common.schemas";
import {
	firstnameSchema,
	lastnameSchema,
} from "../src/validation/schemas/person.schemas";
import {
	emailSchema,
	passwordSchema,
	usernameSchema,
} from "../src/validation/schemas/user.schemas";
import BaseScript from "./base.script";

export default class CreateUser extends BaseScript {
	readonly name = "create-user";
	readonly description = "Create a user";

	async run() {
		const userService = new UserService();
		const data: Partial<DTO> = { enable: true };

		const answer = await confirm({
			message: "Do you want to create a user account?",
		});

		if (!answer) return;

		data.firstname = await input({
			message: "Enter user's firstname:",
			validate: valid(firstnameSchema),
		});

		data.lastname = await input({
			message: "Enter user's lastname:",
			validate: valid(lastnameSchema),
		});

		data.username = await input({
			message: "Enter user's username:",
			validate: valid(usernameSchema),
		});

		data.email = await input({
			message: "Enter user's email:",
			validate: valid(emailSchema),
		});

		data.role = await select({
			message: "Select user's role:",
			choices: Object.values(Role),
			default: Role.ADMIN,
		});

		const birthday = await input({
			message: "Enter user's birthday (optional):",
			validate: (value) => value === "" || valid(dateSchema)(value),
		});
		if (birthday) data.birthday = birthday;

		const password1 = await password({
			message: "Enter user's password:",
			mask: true,
			validate: valid(passwordSchema),
		});

		await password({
			message: "Confirm password:",
			mask: true,
			validate: (value) => {
				if (value !== password1) return "Passwords do not match";
				return true;
			},
		});

		data.password = password1;

		const decoded = decode(createUserCodec, data);
		const user = await userService.create(decoded);
		logger.info({ user });
	}
}
