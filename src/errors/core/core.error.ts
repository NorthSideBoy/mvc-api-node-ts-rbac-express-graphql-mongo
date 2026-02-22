export default class CoreError extends Error {
	public readonly metadata?: Record<string, unknown>;
	public readonly code: string;

	constructor(
		message: string,
		options: {
			code: string;
			cause?: unknown;
			metadata?: Record<string, unknown>;
		},
	) {
		super(message, options);
		this.name = new.target.name;
		this.code = options.code;
		this.cause = options?.cause;
		this.metadata = options?.metadata;
		Error.captureStackTrace?.(this, new.target);
	}
}
