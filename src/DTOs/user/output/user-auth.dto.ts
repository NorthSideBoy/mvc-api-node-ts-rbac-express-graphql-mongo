import type { User } from "../../../types/user.type";

export type UserAuthDTO = User.Secure & { token: string };
