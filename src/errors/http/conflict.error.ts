import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class ConflictError extends HttpError {
	constructor(message = "Conflict") {
		super(message, 409, HttpErrorCode.Conflict);
	}
}
