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
import type { Result } from "../DTOs/operation/output/result.dto";
import type { CreateUser } from "../DTOs/user/input/create-user.dto";
import type { LoginUser } from "../DTOs/user/input/login-user.dto";
import type { RegisterUser } from "../DTOs/user/input/register-user.dto";
import type { UpdateUser } from "../DTOs/user/input/update-user.dto";
import type { UpdateUserPassword } from "../DTOs/user/input/update-user-password.dto";
import type { UpdateUserRole } from "../DTOs/user/input/update-user-role.dto";
import type { UpdateUserStatus } from "../DTOs/user/input/update-user-status.dto";
import type { AuthenticatedUser } from "../DTOs/user/output/auth-user.dto";
import type { User } from "../DTOs/user/output/user.dto";
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
		@Body() body: RegisterUser | unknown,
		@Request() _request: ExtendedRequest,
	): Promise<AuthenticatedUser> {
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
		@Body() body: LoginUser | unknown,
		@Request() _request: ExtendedRequest,
	): Promise<AuthenticatedUser> {
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
	 * @summary Get user by id
	 */
	@Get("/{id}")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.USER])
	async findById(
		@Path() id: string,
		@Request() request: ExtendedRequest,
	): Promise<User | null> {
		return this.userService.findById(id, request.access);
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
	async create(
		@Body() body: CreateUser | unknown,
		@Request() request: ExtendedRequest,
	): Promise<User> {
		this.setStatus(201);
		return this.userService.create(body, request.access);
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
	@Security("Bearer", [Role.USER])
	async update(
		@Path() id: string,
		@Body() body: UpdateUser | unknown,
		@Request() request: ExtendedRequest,
	): Promise<Result> {
		return this.userService.update(id, body, request.access);
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
		@Body() body: UpdateUserStatus | unknown,
		@Request() request: ExtendedRequest,
	): Promise<Result> {
		return this.userService.updateStatus(id, body, request.access);
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
	@Security("Bearer", [Role.ADMIN])
	async updateRole(
		@Path() id: string,
		@Body() body: UpdateUserRole | unknown,
		@Request() request: ExtendedRequest,
	): Promise<Result> {
		return this.userService.updateRole(id, body, request.access);
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
	@Security("Bearer", [Role.USER])
	async updatePassword(
		@Path() id: string,
		@Body() body: UpdateUserPassword | unknown,
		@Request() request: ExtendedRequest,
	): Promise<Result> {
		return this.userService.updatePassword(id, body, request.access);
	}

	/**
	 * @summary Delete user by id
	 */
	@Delete("/{id}")
	@SuccessResponse(200)
	@Response(401, "Unauthorized")
	@Response(404, "NotFound")
	@Response(500, "InternalServerError")
	@Security("Bearer", [Role.ADMIN])
	async delete(
		@Path() id: string,
		@Request() request: ExtendedRequest,
	): Promise<Result> {
		return this.userService.delete(id, request.access);
	}
}
