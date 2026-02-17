import type { User } from "../../../types/user.type";

export type LoginUser = Pick<User.Schema, "email" | "password">;
