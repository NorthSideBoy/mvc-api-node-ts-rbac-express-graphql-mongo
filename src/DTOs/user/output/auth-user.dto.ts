import type { User } from "../../../types/user.type";

export type AuthenticatedUser = User.Secure & { token: string };
