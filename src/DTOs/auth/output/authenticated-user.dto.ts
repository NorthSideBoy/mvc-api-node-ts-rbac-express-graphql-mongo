import type { User } from "../../user/output/user.dto";

export interface AuthenticatedUser extends User {
	token: string;
}
