import { EventEmitter } from "node:events";
import type ExecutionContext from "../../context/execution-context";
import { context as executionContext } from "../../utils/context.util";
import { logger } from "../../utils/logger.util";
import type { Event } from "../types/event.type";
import type { EventMap } from "../types/event-map.type";

type EventConsumerType = "listener" | "bridge";

type SubscribeOptions = {
	type?: EventConsumerType;
};

type EventListener<K extends keyof EventMap> = (
	event: Event<K>,
	context: ExecutionContext,
) => void | Promise<void>;

function eventLog<K extends keyof EventMap>(event: Event<K>) {
	return {
		id: event.payload.id,
		name: event.name,
		source: event.source,
	};
}

class EventBus extends EventEmitter {
	static create(): EventBus {
		return new EventBus();
	}

	publish<K extends keyof EventMap>(event: Event<K>): boolean {
		const context = executionContext.get();
		logger.info(
			{
				event: eventLog(event),
				consumers: this.listenerCount(event.name),
				actor: context.actor.audit,
			},
			`[EventBus] published event: ${event.name}`,
		);
		return this.emit(event.name, event, context);
	}

	subscribe<K extends keyof EventMap>(
		name: K,
		listener: EventListener<K>,
		options: SubscribeOptions = {},
	): () => void {
		const type = options.type ?? "listener";
		const wrappedListener = (
			event: Event<K>,
			context: ExecutionContext,
		): void => {
			if (type === "listener") {
				logger.info(
					{
						event: eventLog(event),
						actor: context.actor.audit,
					},
					`[EventBus] received event: ${name}`,
				);
			}
			try {
				const result = listener(event, context);
				if (result instanceof Promise) {
					void result.catch((error) => {
						this.logConsumerError(name, event, context, type, error);
					});
				}
			} catch (error) {
				this.logConsumerError(name, event, context, type, error);
			}
		};

		this.on(name, wrappedListener);

		return () => {
			this.off(name, wrappedListener);
		};
	}

	private logConsumerError<K extends keyof EventMap>(
		name: K,
		event: Event<K>,
		context: ExecutionContext,
		type: EventConsumerType,
		error: unknown,
	): void {
		logger.error(
			{
				error,
				event: eventLog(event),
				consumer: { type },
				actor: context.actor.audit,
			},
			`[EventBus] error processing event: ${String(name)}`,
		);
	}
}

export const eventBus = EventBus.create();
