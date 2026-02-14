import { Role } from "./role";

export type RoleDefinition = {
	name: Role;
	includes?: Role[];
};

export const ROLE_DEFINITIONS: readonly RoleDefinition[] = [
	{
		name: Role.ADMIN,
		includes: [Role.MANAGER, Role.USER],
	},
	{
		name: Role.MANAGER,
		includes: [Role.USER],
	},
	{
		name: Role.USER,
	},
] as const;
