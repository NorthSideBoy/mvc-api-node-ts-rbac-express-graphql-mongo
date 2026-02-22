import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../core/http.error";

export default class NotFoundError extends HttpError {
	constructor(message = "Not found.") {
		super(message, HttpErrorCode.NotFound, 404);
	}
}
