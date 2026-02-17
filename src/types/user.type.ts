import type { Role } from "../rbac/role";
import { UpdateRole as RoleUpdate } from "../rbac/role";
export namespace User {
	export type Schema = {
		id: string;
		name: string;
		lastname: string;
		username: string;
		role: Role;
		email: string;
		password: string;
		birthday: Date;
		enable: boolean;
		createdAt: Date;
		updatedAt: Date;
	};

	export type Create = Omit<Schema, "id" | "createdAt" | "updatedAt">;

	export type Secure = Omit<Schema, "password">;

	export type Profile = Omit<Secure, "id" | "createdAt" | "updatedAt">;

	export type Update = Partial<
		Pick<Create, "name" | "lastname" | "username" | "email" | "birthday">
	>;

	export type UpdateStatus = Pick<Schema, "enable">;

	export type UpdateRole = {
		role: RoleUpdate;
	};

	export type Env = Omit<Profile, "role" | "enable"> & Pick<Schema, "password">;
}
