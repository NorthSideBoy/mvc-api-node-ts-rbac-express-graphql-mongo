import type { User } from "../../../types/user.type";

export type UpdateUserPassword = Pick<User.Schema, "password">;
