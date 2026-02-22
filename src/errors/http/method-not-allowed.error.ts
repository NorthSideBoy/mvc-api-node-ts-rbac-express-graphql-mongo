import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class MethodNotAllowedError extends HttpError {
	constructor(message = "Method not allowed.") {
		super(message, HttpErrorCode.MethodNotAllowed, 405);
	}
}
