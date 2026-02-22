import type { IActor as ActorLike } from "../rbac/contracts/actor.contract";
import type { Role } from "../rbac/enums/role.enum";
import type { Operation } from "../rbac/types/operation.type";

export enum Kind {
	USER = "USER",
	ANONYMOUS = "ANONYMOUS",
	SYSTEM = "SYSTEM",
}

export interface IActor {
	readonly kind: Kind;
	readonly id: string;
	readonly username: string;
	readonly role: Role;
	readonly enable: boolean;
	readonly issuedAt?: number;
	readonly expiresAt?: number;
	can(operation: Operation): boolean;
	canManage(operation: Operation, target: ActorLike): boolean;
	canAssign(targetRole: Role): boolean;
	canAccess(allowed: ReadonlyArray<Role>): boolean;
}
