import type { Role } from "../rbac/role";

export namespace User {
	export type Entity = {
		id: string;
		name: string;
		lastname: string;
		username: string;
		role: Role;
		email: string;
		password: string;
		birthday: Date;
		enable?: boolean;
		createdAt: Date;
		updatedAt: Date;
	};

	export type Create = Omit<Entity, "id" | "createdAt" | "updatedAt">;

	export type Secure = Omit<Entity, "password">;

	export type Profile = Omit<Secure, "id" | "createdAt" | "updatedAt">;

	export type Update = Partial<
		Pick<Create, "name" | "lastname" | "username" | "email" | "birthday">
	>;

	export type UpdateStatus = Pick<Entity, "enable">;

	export type UpdateRole = Pick<Entity, "role">;

	export type Env = Omit<Profile, "role" | "enable"> & Pick<Entity, "password">;
}
