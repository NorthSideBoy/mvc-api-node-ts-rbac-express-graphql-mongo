import type IUser from "../../contracts/user.contract";
import type { AuthenticatedUser } from "../../DTOs/auth/output/authenticated-user.dto";
import type { UpdateUserEmail } from "../../DTOs/user/input/update-user-email.dto";
import type { UpdateUserPassword } from "../../DTOs/user/input/update-user-password.dto";
import type { UpdateUserProfile } from "../../DTOs/user/input/update-user-profile.dto";
import type { UpdateUserRole } from "../../DTOs/user/input/update-user-role.dto";
import type { UpdateUserStatus } from "../../DTOs/user/input/update-user-status.dto";
import type { UpdateUserUsername } from "../../DTOs/user/input/update-user-username.dto";
import { EVENTS } from "../constants/events.conts";

type UserId = Pick<IUser, "id">;
type AuthRef = UserId & Pick<AuthenticatedUser, "token">;
type UserRef = UserId & Pick<IUser, "role" | "username">;

export interface EventMap {
	//Auth
	[EVENTS.AUTH_USER_LOGGED_IN]: AuthRef;
	[EVENTS.AUTH_USER_REGISTERED]: AuthRef;

	//User
	[EVENTS.USER_CREATED]: UserRef;
	[EVENTS.USER_DELETED]: UserRef;
	[EVENTS.USER_EMAIL_UPDATED]: UserId & UpdateUserEmail;
	[EVENTS.USER_PASSWORD_UPDATED]: UserId & UpdateUserPassword;
	[EVENTS.USER_PICTURE_DELETED]: UserRef & { pictureId: string };
	[EVENTS.USER_PICTURE_UPDATED]: UserId & { pictureId: string };
	[EVENTS.USER_PROFILE_UPDATED]: UserId & UpdateUserProfile;
	[EVENTS.USER_ROLE_UPDATED]: UserId & UpdateUserRole;
	[EVENTS.USER_STATUS_UPDATED]: UserId & UpdateUserStatus;
	[EVENTS.USER_USERNAME_UPDATED]: UserId & UpdateUserUsername;
}
