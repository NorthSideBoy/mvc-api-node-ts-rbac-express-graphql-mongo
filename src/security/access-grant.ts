import type { Role } from "../enums/role.enum";
import { PermissionDeniedError } from "../errors/authorization/permission-denied.error";
import { UserDisabledError } from "../errors/user/user-disabled.error";
import type { AccessClaims } from "./access-claims";
import type { UserActor } from "./actor";

export class AccessGrant {
	private constructor(public readonly claims: AccessClaims) {}

	static issue(
		claims: AccessClaims,
		allowedRoles: ReadonlyArray<Role>,
	): AccessGrant {
		if (!claims.isEnabled()) throw new UserDisabledError();
		if (!claims.actor.canAccess(allowedRoles))
			throw new PermissionDeniedError();
		return new AccessGrant(claims);
	}

	get actor(): UserActor {
		return this.claims.actor;
	}
}
