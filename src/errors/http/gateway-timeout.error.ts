import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class GatewayTimeoutError extends HttpError {
	constructor(message = "Gateway Timeout") {
		super(message, 504, HttpErrorCode.GatewayTimeout);
	}
}
