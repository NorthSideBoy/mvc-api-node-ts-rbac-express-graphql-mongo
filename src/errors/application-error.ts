export type ApplicationErrorOptions = {
	details?: unknown;
	cause?: unknown;
};

export class ApplicationError extends Error {
	readonly code: string;
	readonly details?: unknown;
	readonly cause?: unknown;

	constructor(
		message: string,
		code: string,
		options: ApplicationErrorOptions = {},
	) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.details = options.details;
		this.cause = options.cause;
	}
}
