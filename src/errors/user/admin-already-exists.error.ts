import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../application-error";

export class AdminAlreadyExistsError extends ApplicationError {
	constructor(message = "Admin already exists") {
		super(message, ApplicationErrorCode.AdminAlreadyExists);
	}
}
