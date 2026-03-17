import type { CreateUser } from "../../user/input/create-user.dto";

export type RegisterUser = Omit<CreateUser, "role">;
