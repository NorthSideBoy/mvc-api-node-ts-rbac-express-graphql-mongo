import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class DuplicatePasswordError extends ApplicationError {
	constructor(message = "Password must be different") {
		super(message, ApplicationErrorCode.DuplicatePassword);
	}
}
