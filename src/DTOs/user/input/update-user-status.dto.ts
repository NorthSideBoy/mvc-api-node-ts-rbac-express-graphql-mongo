import type { User } from "../../../types/user.type";

type UpdateUserStatusType = Pick<User.Create, "enable">;

export default class UpdateUserStatus {
	enable: boolean;
}

const _typeCheck: UpdateUserStatusType = {} as UpdateUserStatus;
