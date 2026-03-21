import { EventEmitter } from "node:events";
import type ExecutionContext from "../../context/execution-context";
import { logger } from "../../utils/logger.util";
import type { Event } from "../types/event.type";
import type { EventMap } from "../types/event-map.type";

class EventBus extends EventEmitter {
	private constructor() {
		super();
	}

	static create(): EventBus {
		return new EventBus();
	}

	publish<K extends keyof EventMap>(
		event: Event<K>,
		context: ExecutionContext,
	): boolean {
		logger.info({ event }, `[EventBus] ${event.name} event emitted`);
		return this.emit(event.name, event, context);
	}

	subscribe<K extends keyof EventMap>(
		name: K,
		listener: (event: Event<K>, context: ExecutionContext) => void,
	): () => void {
		const wrappedListener = (
			event: Event<K>,
			context: ExecutionContext,
		): void => {
			logger.info({ event }, `[EventBus] ${name} event listened`);
			listener(event, context);
		};

		this.on(name, wrappedListener);

		return () => {
			this.off(name, wrappedListener);
		};
	}
}

export const eventBus = EventBus.create();
