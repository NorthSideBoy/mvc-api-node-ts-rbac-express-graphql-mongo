import type { UpdateUserEmail } from "../../DTOs/user/input/update-user-email.dto";
import type { UpdateUserProfile } from "../../DTOs/user/input/update-user-profile.dto";
import type { UpdateUserRole } from "../../DTOs/user/input/update-user-role.dto";
import type { UpdateUserStatus } from "../../DTOs/user/input/update-user-status.dto";
import type { UpdateUserUsername } from "../../DTOs/user/input/update-user-username.dto";
import type { User } from "../../DTOs/user/output/user.dto";
import { EVENTS } from "../constants/events.constants";
import type { EventPayload } from "./event-payload.type";

type AuthRef = EventPayload<{ id: string; email: string; ip: string }>;
type UserId = Pick<User, "id">;
type UserRef = EventPayload<UserId & Pick<User, "role" | "username">>;

export interface EventMap {
	//Auth
	[EVENTS.AUTH.ACCOUNT_REGISTERED]: AuthRef;
	[EVENTS.AUTH.ACCOUNT_LOGGED_IN]: AuthRef;

	//User
	[EVENTS.USER.READ]: UserRef;
	[EVENTS.USER.CREATED]: UserRef;
	[EVENTS.USER.DELETED]: UserRef;
	[EVENTS.USER.EMAIL_UPDATED]: EventPayload<UserId & UpdateUserEmail>;
	[EVENTS.USER.PASSWORD_UPDATED]: EventPayload<UserId>;
	[EVENTS.USER.PICTURE_DELETED]: EventPayload<
		UserId & Pick<User, "role" | "username"> & { pictureId: string }
	>;
	[EVENTS.USER.PICTURE_UPDATED]: EventPayload<UserId & { pictureId: string }>;
	[EVENTS.USER.PROFILE_UPDATED]: EventPayload<UserId & UpdateUserProfile>;
	[EVENTS.USER.ROLE_UPDATED]: EventPayload<UserId & UpdateUserRole>;
	[EVENTS.USER.STATUS_UPDATED]: EventPayload<UserId & UpdateUserStatus>;
	[EVENTS.USER.USERNAME_UPDATED]: EventPayload<UserId & UpdateUserUsername>;
}
