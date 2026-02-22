import type { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import CoreError from "./core.error";

export class ApplicationError extends CoreError {
	constructor(
		message: string,
		code: ApplicationErrorCode,
		cause?: unknown,
		metadata?: Record<string, unknown>,
	) {
		const options = { code, cause, metadata };
		super(message, options);
		this.name = this.constructor.name;
	}
}
