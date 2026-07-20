import { Kind } from "../enums/kind.enum";
import type { Role } from "../enums/role.enum";
import { type AppAbility, defineAbilityFor } from "../rbac";
import type { Identity } from "../types/identity.type";
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
	public issuedAt: number;
	public expiresAt: number;

	private constructor(identity: Identity, claims: AccessClaims) {
		super(identity.id, identity.role, identity.role, identity.enable);
		this.issuedAt = claims.issuedAt;
		this.expiresAt = claims.expiresAt;
	}

	static fromIdentity(identity: Identity, claims: AccessClaims): UserActor {
		return new UserActor(identity, claims);
	}

	isActive(): boolean {
		const now = Math.floor(Date.now() / 1000);
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
