import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class PermissionDeniedError extends ApplicationError {
	constructor(message = "Insufficient permissions.") {
		super(message, ApplicationErrorCode.PermissionDenied);
	}
}
