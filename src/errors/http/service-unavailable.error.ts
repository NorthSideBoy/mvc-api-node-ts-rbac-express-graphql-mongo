import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class ServiceUnavailableError extends HttpError {
	constructor(message = "Service Unavailable") {
		super(message, 503, HttpErrorCode.ServiceUnavailable);
	}
}
