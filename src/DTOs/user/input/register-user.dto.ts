import type { User } from "../../../types/user.type";

export type RegisterUser = Omit<User.Create, "role">;
