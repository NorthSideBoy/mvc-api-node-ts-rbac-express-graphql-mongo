import type { User } from "../../../types/user.type";

export type UserRegisterDTO = Omit<User.Create, "role">;
