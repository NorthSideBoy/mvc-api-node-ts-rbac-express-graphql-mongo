import type ExecutionContext from "../context/execution-context";
import { eventBus } from "../events/core/event-bus";
import type { Event } from "../events/types/event.type";
import type { EventMap } from "../events/types/event-map.type";
import { logger } from "../utils/logger.util";

export abstract class BaseListener {
	abstract setup(): number;
	protected counter = 0;
	private readonly unsubscribers: Array<() => void> = [];

	protected listen<K extends keyof EventMap>(
		name: K,
		handler: (event: Event<K>, context: ExecutionContext) => Promise<void>,
	): void {
		const unsubscribe = eventBus.subscribe(
			name,
			async (event, context) => {
				try {
					await handler(event, context);
				} catch (error) {
					logger.error(
						{
							error,
							event: {
								id: event.payload.id,
								name: event.name,
								source: event.source,
							},
							actor: context.actor.audit,
						},
						`[EventBus] error processing event: ${String(name)}`,
					);
				}
			},
			{ type: "listener" },
		);
		this.unsubscribers.push(unsubscribe);
		this.counter++;
	}

	shutdown(): number {
		const total = this.unsubscribers.length;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		this.unsubscribers.length = 0;
		this.counter = 0;

		return total;
	}
}
