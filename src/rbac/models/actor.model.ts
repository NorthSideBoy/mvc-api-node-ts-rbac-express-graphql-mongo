import type { IActor } from "../contracts/actor.contract";
import RolePolicy from "../core/role-policy";
import type { Role } from "../enums/role.enum";
import type { Operation } from "../types/operation.type";

export default class Actor implements IActor {
	constructor(
		public readonly id: string,
		public readonly role: Role,
		private readonly policy: RolePolicy = RolePolicy.create(),
	) {}

	get audit(): IActor {
		return { id: this.id, role: this.role };
	}

	static dummy(role: Role): IActor {
		return new Actor("dummy", role);
	}

	can(operation: Operation): boolean {
		return this.policy.can(this, operation);
	}

	canManage(operation: Operation, target: IActor): boolean {
		return this.policy.canManage(this, operation, target);
	}

	canAssign(targetRole: Role): boolean {
		return this.policy.canAssign(this.role, targetRole);
	}

	canAccess(allowedRoles: ReadonlyArray<Role>): boolean {
		return this.policy.canAccess(this.role, allowedRoles);
	}
}
