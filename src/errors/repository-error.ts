import { RepositoryErrorCode } from "../enums/repository-error-code.enum";

export type RepositoryErrorOptions = {
	details?: unknown;
	cause?: unknown;
};

export class RepositoryError extends Error {
	readonly code: RepositoryErrorCode;
	readonly details?: unknown;
	readonly cause?: unknown;

	constructor(
		message: string,
		code: RepositoryErrorCode = RepositoryErrorCode.Unknown,
		options: RepositoryErrorOptions = {},
	) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.details = options.details;
		this.cause = options.cause;
	}
}
