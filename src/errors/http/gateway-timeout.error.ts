import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class GatewayTimeoutError extends HttpError {
	constructor(message = "Gateway timeout.") {
		super(message, HttpErrorCode.GatewayTimeout, 504);
	}
}
