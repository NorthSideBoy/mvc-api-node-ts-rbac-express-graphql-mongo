import type { AccessGrant } from "../security/access-grant";
import type BaseActor from "../security/actor";
import { AnonymousActor, systemActor } from "../security/actor";

export default class ExecutionContext {
	private constructor(readonly actor: BaseActor) {}

	static fromGrant(grant: AccessGrant): ExecutionContext {
		return new ExecutionContext(grant.actor);
	}

	static anonymous(): ExecutionContext {
		return new ExecutionContext(new AnonymousActor());
	}

	static system(): ExecutionContext {
		return new ExecutionContext(systemActor);
	}
}
