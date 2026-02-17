import { PERMISSIONS, type Permission } from "./permissions";
import { Role } from "./role";

export type RoleDefinition = {
	name: Role;
	includes?: Role[];
	permissions: Permission[];
};

export const ROLE_DEFINITIONS: readonly RoleDefinition[] = [
	{
		name: Role.ADMIN,
		permissions: [PERMISSIONS.USER_DELETE, PERMISSIONS.USER_ASSIGN_ROLE],
		includes: [Role.MANAGER, Role.USER],
	},
	{
		name: Role.MANAGER,
		permissions: [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_SET_STATUS],
		includes: [Role.USER],
	},
	{
		name: Role.USER,
		permissions: [
			PERMISSIONS.USER_READ,
			PERMISSIONS.USER_UPDATE,
			PERMISSIONS.USER_PASSWORD_CHANGE,
		],
	},
] as const;
