import type { HttpErrorCode } from "../../enums/http-error-code.enum";
import CoreError from "./core.error";

export default class HttpError extends CoreError {
	readonly status: number;

	constructor(
		message: string,
		code: HttpErrorCode,
		status: number,
		cause?: unknown,
		metadata?: Record<string, unknown>,
	) {
		const options = { code, status, cause, metadata };
		super(message, options);
		this.status = status;
		this.name = this.constructor.name;
	}
}
