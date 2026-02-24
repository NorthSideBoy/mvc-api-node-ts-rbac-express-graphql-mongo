import type { User } from "../../../types/user.type";

type UpdateUserEmailType = Pick<User.Create, "email">;

export default class UpdateUserEmail {
	email: string;
}

const _typeCheck: UpdateUserEmailType = {} as UpdateUserEmail;
