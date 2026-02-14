import {
	Body,
	Controller,
	Delete,
	Get,
	Path,
	Post,
	Put,
	Request,
	Response,
	Route,
	Security,
	SuccessResponse,
	Tags,
} from "tsoa";
import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import type { UserCreateDTO } from "../DTOs/user/input/create-user.dto";
import type { UserLoginDTO } from "../DTOs/user/input/login-user.dto";
import type { UserRegisterDTO } from "../DTOs/user/input/register-user.dto";
import type { UserUpdateDTO } from "../DTOs/user/input/update-user.dto";
import type { UserUpdatePasswordDTO } from "../DTOs/user/input/update-user-password.dto";
import type { UserUpdateRoleDTO } from "../DTOs/user/input/update-user-role.dto";
import type { UserUpdateStatusDTO } from "../DTOs/user/input/update-user-status.dto";
import type { UserDTO } from "../DTOs/user/output/user.dto";
import type { UserAuthDTO } from "../DTOs/user/output/user-auth.dto";
import { Role } from "../rbac/role";
import { UserService } from "../services/user.service";
import type { ExtendedRequest } from "../types/extended-request.type";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
	private readonly userService = new UserService();

	/**
	 * @summary Register user
	 */
	@Post("/register")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(409, "Conflict")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	async register(
		@Body() body: UserRegisterDTO | unknown,
		@Request() _request: ExtendedRequest,
	): Promise<UserAuthDTO> {
		return this.userService.register(body);
	}

	/**
	 * @summary Login user
	 */
	@Post("/login")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	async login(
		@Body() body: UserLoginDTO | unknown,
		@Request() _request: ExtendedRequest,
	): Promise<UserAuthDTO> {
		return this.userService.login(body);
	}

	@Get("/test")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.ADMIN])
	async test(@Request() _request: ExtendedRequest): Promise<boolean> {
		return true;
	}

	/**
	 * @summary Get current user profile
	 */
	@Get("/me")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.USER])
	async me(@Request() request: ExtendedRequest): Promise<UserDTO> {
		return this.userService.profile(request.access.sub);
	}

	/**
	 * @summary Get user by id
	 */
	@Get("/{id}")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async findById(@Path() id: string): Promise<UserDTO> {
		return this.userService.findById(id);
	}

	/**
	 * @summary Create user
	 */
	@Post("/")
	@SuccessResponse(201)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(409, "Conflict")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async create(@Body() body: UserCreateDTO | unknown): Promise<UserDTO> {
		this.setStatus(201);
		return this.userService.create(body);
	}

	/**
	 * @summary Update user by id
	 */
	@Put("/{id}")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(409, "Conflict")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async update(
		@Path() id: string,
		@Body() body: UserUpdateDTO | unknown,
	): Promise<ResultDTO> {
		return this.userService.update(id, body);
	}

	/**
	 * @summary Enable or disable user
	 */
	@Put("/{id}/status")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async updateStatus(
		@Path() id: string,
		@Body() body: UserUpdateStatusDTO | unknown,
	): Promise<ResultDTO> {
		return this.userService.updateStatus(id, body);
	}

	/**
	 * @summary Promote or demote user role
	 */
	@Put("/{id}/role")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async updateRole(
		@Path() id: string,
		@Body() body: UserUpdateRoleDTO | unknown,
	): Promise<ResultDTO> {
		return this.userService.updateRole(id, body);
	}

	/**
	 * @summary Update user password
	 */
	@Put("/{id}/password")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(422, "UnprocessableEntity")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async updatePassword(
		@Path() id: string,
		@Body() body: UserUpdatePasswordDTO | unknown,
	): Promise<ResultDTO> {
		return this.userService.updatePassword(id, body);
	}

	/**
	 * @summary Delete user by id
	 */
	@Delete("/{id}")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.MANAGER])
	async delete(@Path() id: string): Promise<ResultDTO> {
		return this.userService.delete(id);
	}
}
