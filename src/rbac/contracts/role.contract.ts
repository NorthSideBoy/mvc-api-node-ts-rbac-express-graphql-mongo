import type { Role } from "../enums/role.enum";
import type { Permission } from "../types/permission.type";

export interface IRole {
	name: Role;
	includes?: Role[];
	permissions: readonly Permission[];
}
