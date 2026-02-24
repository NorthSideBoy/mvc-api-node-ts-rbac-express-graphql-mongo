import type { User } from "../../../types/user.type";

type UpdateUserProfileType = Partial<
	Pick<User.Create, "firstname" | "lastname" | "birthday">
>;

export default class UpdateUserProfile {
	firstname?: string;
	lastname?: string;
	birthday?: Date;
}

const _typeCheck: UpdateUserProfileType = {} as UpdateUserProfile;
