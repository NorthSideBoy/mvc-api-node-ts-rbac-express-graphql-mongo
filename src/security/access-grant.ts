import type { Role } from "../enums/role.enum";
import { PermissionDeniedError } from "../errors/application/permission-denied.error";
import { UserDisabledError } from "../errors/application/user-disabled.error";
import { includedRoles } from "../rbac/role-hierarchy";
import type { AccessClaims } from "./access-claims";
import type { UserActor } from "./actor";

export class AccessGrant {
	private constructor(
		public readonly claims: AccessClaims,
		private readonly issuedActor: UserActor,
	) {}

	static issue(
		claims: AccessClaims,
		actor: UserActor,
		allowedRoles: ReadonlyArray<Role>,
	): AccessGrant {
		if (!actor.enable) throw new UserDisabledError();
		if (!actor.role) throw new PermissionDeniedError();
		if (!includedRoles(actor.role).some((role) => allowedRoles.includes(role)))
			throw new PermissionDeniedError();

		return new AccessGrant(claims, actor);
	}

	get actor(): UserActor {
		return this.issuedActor;
	}
}
