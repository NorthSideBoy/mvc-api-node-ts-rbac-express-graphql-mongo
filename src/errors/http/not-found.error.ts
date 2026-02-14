import { HttpErrorCode } from "../../enums/http-error-code.enum";
import HttpError from "../http.error";

export default class NotFoundError extends HttpError {
	constructor(message = "Not found") {
		super(message, 404, HttpErrorCode.NotFound);
	}
}
