import { Kind } from "../enums/kind.enum";
import { Role } from "../rbac/enums/role.enum";
import { default as RBACActor } from "../rbac/models/actor.model";
import type { AccessClaims } from "./access-claims";

export default abstract class BaseActor extends RBACActor {
	abstract readonly kind: Kind;

	protected constructor(
		id: string,
		role: Role,
		public readonly username: string,
		public readonly enable: boolean,
	) {
		super(id, role);
	}
}

export class UserActor extends BaseActor {
	readonly kind = Kind.USER;

	private constructor(
		id: string,
		username: string,
		role: Role,
		enable: boolean,
		public readonly issuedAt: number,
		public readonly expiresAt: number,
	) {
		super(id, role, username, enable);
	}

	static fromClaims(claims: AccessClaims): UserActor {
		return new UserActor(
			claims.subject,
			claims.username,
			claims.role,
			claims.enable,
			claims.issuedAt,
			claims.expiresAt,
		);
	}

	isActive(): boolean {
		const now = Date.now();
		return this.enable && now >= this.issuedAt && now <= this.expiresAt;
	}
}

export class AnonymousActor extends BaseActor {
	readonly kind = Kind.ANONYMOUS;

	constructor(sessionId?: string) {
		super(
			sessionId || crypto.randomUUID(),
			Role.ANONYMOUS,
			Kind.ANONYMOUS,
			true,
		);
	}
}

class SystemActor extends BaseActor {
	readonly kind = Kind.SYSTEM;

	private constructor() {
		super(process.pid.toString(), Role.JOKER, Kind.SYSTEM, true);
	}

	static create(): SystemActor {
		return new SystemActor();
	}
}

export const systemActor = SystemActor.create();
