import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class BadGatewayError extends HttpError {
	constructor(message = "Bad Gateway.") {
		super(message, HttpErrorCode.BadGateway, 502);
	}
}
