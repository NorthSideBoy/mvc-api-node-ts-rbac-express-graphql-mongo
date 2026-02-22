import type { Role } from "../enums/role.enum";
import type { Permission } from "../types/permission.type";

export interface IEdge {
	includes: Set<Role>;
	permissions: Set<Permission>;
}
