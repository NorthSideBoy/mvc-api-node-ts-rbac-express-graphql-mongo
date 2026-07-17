import { randomUUID } from "node:crypto";
import type ExecutionContext from "../context/execution-context";
import { eventBus } from "../events/core/event-bus";
import type { EventMap } from "../events/types/event-map.type";
import {
	type AppPermission,
	Authorizer,
	subjectForPermission,
	type UserAuthorizationTarget,
} from "../rbac";
import { context } from "../utils/context.util";

export default class BaseService {
	protected readonly ctx: ExecutionContext;
	protected readonly authorizer: Authorizer;

	constructor(ctx?: ExecutionContext) {
		this.ctx = ctx || context.get();
		this.authorizer = new Authorizer(this.ctx.actor);
	}

	protected authorize(
		permission: AppPermission,
		target?: UserAuthorizationTarget,
		message?: string,
	) {
		this.authorizer.authorize(
			permission.action,
			subjectForPermission(permission, target),
			message,
		);
	}

	protected emit<K extends keyof EventMap>(
		event: K,
		data: EventMap[K]["data"],
	): boolean {
		return eventBus.publish({
			name: event,
			source: this.constructor.name,
			payload: {
				id: randomUUID(),
				subject: this.ctx.actor.id,
				data,
			} as EventMap[K],
		});
	}
}
