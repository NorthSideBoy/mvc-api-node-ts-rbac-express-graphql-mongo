import {
	Body,
	FormField,
	Middlewares,
	Post,
	Request,
	Response,
	Route,
	SuccessResponse,
	Tags,
	UploadedFile,
} from "tsoa";
import type { LoginUser } from "../../../DTOs/auth/input/login-user.dto";
import type { AuthenticatedUser } from "../../../DTOs/auth/output/authenticated-user.dto";
import AuthService from "../../../services/auth.service";
import type { ExtendedRequest } from "../../common/types/extended-request.type";
import { clientIp } from "../../common/utils/client-ip.util";
import { authLimiter } from "../middlewares/rate-limiter.middleware";
import { BaseController } from "./base.controller";

@Route("auth")
@Tags("Auth")
export class AuthController extends BaseController {
	private readonly authService = new AuthService();

	/**
	 * @summary Register account
	 */
	@Post("/register")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(409, "Conflict")
	@Response(422, "UnprocessableEntity")
	@Response(429, "TooManyRequests")
	@Response(500, "InternalServerError")
	async register(
		@Request() request: ExtendedRequest,
		@FormField() firstname: string,
		@FormField() lastname: string,
		@FormField() username: string,
		@FormField() email: string,
		@FormField() password: string,
		@FormField() birthday?: Date,
		@FormField() enable?: boolean,
		@UploadedFile() upload?: Express.Multer.File,
	): Promise<AuthenticatedUser> {
		return await this.authService.register(
			{
				firstname,
				lastname,
				username,
				email,
				password,
				birthday,
				enable,
				picture: this.handleUpload(upload),
			},
			{ ip: clientIp(request) },
		);
	}

	/**
	 * @summary Login account
	 */
	@Post("/login")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(422, "UnprocessableEntity")
	@Response(429, "TooManyRequests")
	@Response(500, "InternalServerError")
	@Middlewares([authLimiter])
	async login(
		@Request() request: ExtendedRequest,
		@Body() body: LoginUser,
	): Promise<AuthenticatedUser> {
		return await this.authService.login(body, { ip: clientIp(request) });
	}
}
