import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class BadRequestError extends HttpError {
	constructor(message = "Bad request.") {
		super(message, HttpErrorCode.BadRequest, 400);
	}
}
