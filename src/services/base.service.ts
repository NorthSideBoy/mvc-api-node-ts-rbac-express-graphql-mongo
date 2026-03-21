import type ExecutionContext from "../context/execution-context";
import { PermissionDeniedError } from "../errors/application/permission-denied.error";
import { eventBus } from "../events/core/event-bus";
import type { EventMap } from "../events/types/event-map.type";
import type { IActor, Role } from "../rbac";
import type { Operation } from "../rbac/types/operation.type";
import { context } from "../utils/context.util";

export default class BaseService {
	protected readonly ctx: ExecutionContext;

	constructor(ctx?: ExecutionContext) {
		this.ctx = ctx || context.get();
	}

	protected can(operation: Operation, message?: string) {
		if (!this.ctx.actor.can(operation))
			throw new PermissionDeniedError(message);
	}

	protected canManage(operation: Operation, target: IActor, message?: string) {
		if (!this.ctx.actor.canManage(operation, target))
			throw new PermissionDeniedError(message);
	}

	protected canAssign(role: Role, message?: string) {
		if (!this.ctx.actor.canAssign(role))
			throw new PermissionDeniedError(message);
	}

	protected emit<K extends keyof EventMap>(
		event: K,
		payload: EventMap[K],
	): boolean {
		return eventBus.publish(
			{
				name: event,
				source: this.constructor.name,
				payload,
			},
			this.ctx,
		);
	}
}
