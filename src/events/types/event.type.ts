import type { EventMap } from "./event-map.type";

export type Event<K extends keyof EventMap = keyof EventMap> = {
	name: K;
	source: string;
	payload: EventMap[K];
};
