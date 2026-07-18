import type { Server } from "socket.io";
import type ExecutionContext from "../../../context/execution-context";
import { EVENTS } from "../../../events/constants/events.constants";
import { eventBus } from "../../../events/core/event-bus";
import type { Event } from "../../../events/types/event.type";
import type { EventMap } from "../../../events/types/event-map.type";
import type { SocketPayload } from "../../../events/types/event-payload.type";
import { logger } from "../../../utils/logger.util";
import { userRoom } from "../common/user-room.common";

type SocketDeliveryTarget = {
	delivery: "actor:self" | "target:self" | "target:watch" | "public";
	room: string;
};

type SocketEventDelivery<K extends keyof EventMap = keyof EventMap> = {
	rooms?: (event: Event<K>, ctx: ExecutionContext) => SocketDeliveryTarget[];
	public?: boolean;
};

function targetId(event: Event<keyof EventMap>): string {
	const data = event.payload.data;
	const id =
		data && typeof data === "object" ? (data as { id?: unknown }).id : null;
	if (typeof id !== "string")
		throw new Error(`Event ${String(event.name)} does not include data.id`);

	return id;
}

const SOCKET_EVENT_DELIVERY: Partial<
	Record<keyof EventMap, SocketEventDelivery>
> = {
	[EVENTS.USER.READ]: {
		rooms: (event, ctx) => [
			{ delivery: "actor:self", room: userRoom.self(ctx.actor.id) },
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.CREATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.PROFILE_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.STATUS_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.ROLE_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
		],
	},
	[EVENTS.USER.PASSWORD_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
		],
	},
	[EVENTS.USER.EMAIL_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.USERNAME_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.PICTURE_UPDATED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.PICTURE_DELETED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
	[EVENTS.USER.DELETED]: {
		rooms: (event) => [
			{ delivery: "target:self", room: userRoom.self(targetId(event)) },
			{ delivery: "target:watch", room: userRoom.watch(targetId(event)) },
		],
	},
};

class SocketBridge {
	private counter = 0;
	private readonly unsubscribers: Array<() => void> = [];

	constructor(private readonly io: Server) {}

	setup(): number {
		const events = Object.keys(SOCKET_EVENT_DELIVERY) as Array<keyof EventMap>;
		for (const event of events) {
			this.listen(event, async (ev, ctx) => this.deliver(ev, ctx));
		}
		return this.counter;
	}

	shutdown(): number {
		const total = this.unsubscribers.length;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		this.unsubscribers.length = 0;
		this.counter = 0;

		return total;
	}

	private listen<K extends keyof EventMap>(
		name: K,
		handler: (event: Event<K>, context: ExecutionContext) => Promise<void>,
	): void {
		const unsubscribe = eventBus.subscribe(
			name,
			async (event, ctx) => {
				try {
					await handler(event, ctx);
				} catch (error) {
					logger.error(
						{
							error,
							event: this.eventLog(event),
							actor: ctx.actor.audit,
						},
						`[Socket.IO] error bridging event: ${String(name)}`,
					);
				}
			},
			{ type: "bridge" },
		);
		this.unsubscribers.push(unsubscribe);
		this.counter++;
	}

	private async deliver<K extends keyof EventMap>(
		event: Event<K>,
		ctx: ExecutionContext,
	) {
		const delivery = SOCKET_EVENT_DELIVERY[event.name];
		if (!delivery) return;
		const targets = delivery.rooms?.(event, ctx) ?? [];
		if (delivery.public) targets.push({ delivery: "public", room: "public" });

		for (const target of targets) {
			const payload: SocketPayload<EventMap[K]> = {
				...event.payload,
				room: target.room,
			};
			if (target.delivery === "public") this.io.emit(event.name, payload);
			else this.io.to(target.room).emit(event.name, payload);
		}

		if (targets.length === 0) return;

		logger.info(
			{
				event: this.eventLog(event),
				socket: {
					deliveries: targets.map((target) => target.delivery),
					rooms: targets.map((target) => target.room),
				},
				actor: ctx.actor.audit,
			},
			`[Socket.IO] bridged event: ${String(event.name)}`,
		);
	}

	private eventLog<K extends keyof EventMap>(event: Event<K>) {
		return {
			id: event.payload.id,
			name: event.name,
			source: event.source,
		};
	}
}

let bridge: SocketBridge | null = null;

export const bridges = {
	initialize: (io: Server): number => {
		if (bridge) {
			logger.info("[Socket.IO] event bridge already initialized");
			return 1;
		}

		bridge = new SocketBridge(io);
		const total = bridge.setup();
		logger.info(`[Socket.IO] event bridge initialized: ${total}`);
		return total;
	},
	shutdown: (): number => {
		if (!bridge) {
			logger.info("[Socket.IO] event bridge already stopped");
			return 0;
		}

		const total = bridge.shutdown();
		bridge = null;
		logger.info(`[Socket.IO] event bridge stopped: ${total}`);
		return total;
	},
};
