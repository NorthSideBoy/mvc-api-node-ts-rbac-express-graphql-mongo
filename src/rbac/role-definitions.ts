import { Role } from "../enums/role.enum";
import { AccessScope, Permission } from "./policy";
import type { AbilityRule, RoleDefinition } from "./types";

const { User, All } = Permission;
const { Own, Managed, Included } = AccessScope;

export const ROLE_DEFINITIONS: readonly RoleDefinition[] = [
	{
		role: Role.ADMIN,
		includes: [Role.MANAGER, Role.USER],
		rules: [
			{ permission: User.Delete, access: Managed },
			{ permission: User.UpdateRole, access: Managed },
			{ permission: User.UpdateProfile, access: Included },
			{ permission: User.UpdateUsername, access: Included },
			{ permission: User.UpdateEmail, access: Included },
			{ permission: User.UpdatePassword, access: Included },
			{ permission: User.UpdatePicture, access: Included },
			{ permission: User.DeletePicture, access: Included },
		],
	},
	{
		role: Role.MANAGER,
		includes: [Role.USER],
		rules: [
			{ permission: User.Create, access: Managed },
			{ permission: User.UpdateStatus, access: Managed },
		],
	},
	{
		role: Role.USER,
		rules: [
			{ permission: User.Read },
			{ permission: User.UpdateProfile, access: Own },
			{ permission: User.UpdateUsername, access: Own },
			{ permission: User.UpdateEmail, access: Own },
			{ permission: User.UpdatePassword, access: Own },
			{ permission: User.UpdatePicture, access: Own },
			{ permission: User.DeletePicture, access: Own },
		],
	},
] as const;

export const ANONYMOUS_RULES: readonly AbilityRule[] = [] as const;

export const SYSTEM_RULES: readonly AbilityRule[] = [
	{ permission: All.Wildcard },
] as const;
