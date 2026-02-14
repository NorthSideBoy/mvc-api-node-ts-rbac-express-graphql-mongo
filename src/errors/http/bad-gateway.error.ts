import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class BadGatewayError extends HttpError {
	constructor(message = "Bad Gateway") {
		super(message, 502, HttpErrorCode.BadGateway);
	}
}
