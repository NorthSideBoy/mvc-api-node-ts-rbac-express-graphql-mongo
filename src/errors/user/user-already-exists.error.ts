import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class UserAlreadyExistsError extends ApplicationError {
	constructor(message = "User already exists") {
		super(message, ApplicationErrorCode.UserAlreadyExists);
	}
}
