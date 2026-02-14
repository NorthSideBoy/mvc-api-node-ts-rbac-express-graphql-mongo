import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class BadRequestError extends HttpError {
	constructor(message = "Bad request") {
		super(message, 400, HttpErrorCode.BadRequest);
	}
}
