import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class ConflictError extends HttpError {
	constructor(message = "Conflict.") {
		super(message, HttpErrorCode.Conflict, 409);
	}
}
