import type { User } from "../../../types/user.type";

type UpdateUserPasswordType = Pick<User.Create, "password">;

export default class UpdateUserPassword {
	password: string;
}

const _typeCheck: UpdateUserPasswordType = {} as UpdateUserPassword;
