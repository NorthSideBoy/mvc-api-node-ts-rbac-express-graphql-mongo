import type { User } from "../../../types/user.type";

export type UserLoginDTO = Pick<User.Entity, "email" | "password">;
