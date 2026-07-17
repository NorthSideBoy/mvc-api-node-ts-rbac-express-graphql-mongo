export type EventPayload<TData = unknown> = {
	id: string;
	subject: string;
	data: TData;
};

export type SocketPayload<TPayload extends EventPayload<unknown>> = TPayload & {
	room: string;
};
