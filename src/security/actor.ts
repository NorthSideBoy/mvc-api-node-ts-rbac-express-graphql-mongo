import { Kind } from "../enums/kind.enum";
import type { Role } from "../enums/role.enum";
import { type AppAbility, defineAbilityFor } from "../rbac";
import type { AccessClaims } from "./access-claims";

type ActorAudit = {
	id: string;
	role: Role | Kind.ANONYMOUS | Kind.SYSTEM;
};

export default abstract class BaseActor {
	abstract readonly kind: Kind;
	private cachedAbility?: AppAbility;

	protected constructor(
		public readonly id: string,
		public readonly role: Role | null,
		public readonly username: string,
		public readonly enable: boolean,
	) {}

	get ability(): AppAbility {
		this.cachedAbility ??= defineAbilityFor(this);

		return this.cachedAbility;
	}

	get audit(): ActorAudit {
		return {
			id: this.id,
			role:
				this.role ?? (this.kind === Kind.SYSTEM ? Kind.SYSTEM : Kind.ANONYMOUS),
		};
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
		super(sessionId || crypto.randomUUID(), null, Kind.ANONYMOUS, true);
	}
}

class SystemActor extends BaseActor {
	readonly kind = Kind.SYSTEM;

	private constructor() {
		super(process.pid.toString(), null, Kind.SYSTEM, true);
	}

	static create(): SystemActor {
		return new SystemActor();
	}
}

export const systemActor = SystemActor.create();
