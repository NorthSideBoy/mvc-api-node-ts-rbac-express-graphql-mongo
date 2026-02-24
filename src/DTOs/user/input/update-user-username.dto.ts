import type { User } from "../../../types/user.type";

type UpdateUserUsernameType = Pick<User.Create, "username">;

export default class UpdateUserUsername {
	username: string;
}

const _typeCheck: UpdateUserUsernameType = {} as UpdateUserUsername;
