export type EventPayload<TData = unknown> = {
	id: string;
	subject: string;
	data: TData;
};

export type EventInput<TPayload extends EventPayload<unknown>> = Omit<
	TPayload,
	"id" | "subject"
>;

export type SocketPayload<TPayload extends EventPayload<unknown>> = TPayload & {
	room: string;
};
