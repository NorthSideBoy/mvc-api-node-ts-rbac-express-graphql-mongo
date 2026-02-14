import type { User } from "../../../types/user.type";

export type UserUpdatePasswordDTO = Pick<User.Entity, "password">;
