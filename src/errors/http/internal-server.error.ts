import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class InternalServerError extends HttpError {
	constructor(message = "Internal server error.") {
		super(message, HttpErrorCode.InternalError, 500);
	}
}
