import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class ServiceUnavailableError extends HttpError {
	constructor(message = "Service unavailable.") {
		super(message, HttpErrorCode.ServiceUnavailable, 503);
	}
}
