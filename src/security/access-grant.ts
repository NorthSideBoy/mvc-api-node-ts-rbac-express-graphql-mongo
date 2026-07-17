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
		allowedRoles: ReadonlyArray<Role>,
	): AccessGrant {
		if (!claims.isEnabled()) throw new UserDisabledError();
		if (
			!includedRoles(claims.role).some((role) => allowedRoles.includes(role))
		) {
			throw new PermissionDeniedError();
		}

		return new AccessGrant(claims, claims.actor);
	}

	get actor(): UserActor {
		return this.issuedActor;
	}
}
