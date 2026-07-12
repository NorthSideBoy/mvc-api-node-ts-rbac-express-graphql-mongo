import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
import {
	Arg,
	Ctx,
	Mutation,
	Query,
	Resolver,
	UseMiddleware,
} from "type-graphql";
import { Role } from "../../../enums/role.enum";
import UserService from "../../../services/user.service";
import { mapper } from "../../../utils/mapper.util";
import { authGuard } from "../middlewares/auth.middleware";
import { contextMiddleware } from "../middlewares/context.middleware";
import ResultGQL from "../schemas/common/result.schema";
// biome-ignore lint: GQL schemas should not be type
import CreateUserGQL from "../schemas/user/input/create-user.schema";
import QueryUsersGQL from "../schemas/user/input/query-users.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserEmailGQL from "../schemas/user/input/update-user-email.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserPasswordGQL from "../schemas/user/input/update-user-password.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserProfileGQL from "../schemas/user/input/update-user-profile.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserRoleGQL from "../schemas/user/input/update-user-role.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserStatusGQL from "../schemas/user/input/update-user-status.schema";
// biome-ignore lint: GQL schemas should not be type
import UpdateUserUsernameGQL from "../schemas/user/input/update-user-username.schema";
import SearchUserGQL from "../schemas/user/output/search-user.schema";
import UserGQL from "../schemas/user/output/user.schema";
import type { GraphQLContext } from "../types/graphql-context.type";
import BaseResolver from "./base.resolver";

@Resolver()
export default class UserResolver extends BaseResolver {
	private userService(ctx: GraphQLContext): UserService {
		return new UserService(ctx.req.context);
	}

	@Query(() => UserGQL, { nullable: true })
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async findById(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
	): Promise<UserGQL | null> {
		const result = await this.userService(ctx).findById(id);
		if (!result) return null;

		return mapper.toClass(UserGQL, result);
	}

	@Query(() => [UserGQL])
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async findAll(@Ctx() ctx: GraphQLContext): Promise<UserGQL[]> {
		const result = await this.userService(ctx).findAll();

		return result.map((item) => mapper.toClass(UserGQL, item));
	}

	@Query(() => SearchUserGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async search(
		@Ctx() ctx: GraphQLContext,
		@Arg("query", () => QueryUsersGQL, { nullable: true })
		query?: QueryUsersGQL,
	): Promise<SearchUserGQL> {
		const result = await this.userService(ctx).query(query ?? {});

		return mapper.toClass(SearchUserGQL, {
			docs: result.docs.map((item) => mapper.toClass(UserGQL, item)),
			pagination: result.pagination,
		});
	}

	@Mutation(() => UserGQL)
	@UseMiddleware([authGuard("Bearer", [Role.MANAGER]), contextMiddleware()])
	async create(
		@Ctx() ctx: GraphQLContext,
		@Arg("data") data: CreateUserGQL,
		@Arg("upload", () => GraphQLUpload, { nullable: true })
		upload?: Promise<FileUpload>,
	): Promise<UserGQL> {
		const picture = await this.handleUpload(upload);
		const result = await this.userService(ctx).create(
			Object.assign(
				{ picture },
				{ ...data, role: data.role as unknown as Role },
			),
		);

		return mapper.toClass(UserGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async updateProfile(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserProfileGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updateProfile(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.MANAGER]), contextMiddleware()])
	async updateStatus(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserStatusGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updateStatus(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async updateRole(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserRoleGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updateRole(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async updatePassword(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserPasswordGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updatePassword(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async updateEmail(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserEmailGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updateEmail(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async updateUsername(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("data") data: UpdateUserUsernameGQL,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).updateUsername(id, data);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.USER]), contextMiddleware()])
	async updatePicture(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
		@Arg("upload", () => GraphQLUpload) upload: Promise<FileUpload>,
	): Promise<ResultGQL> {
		const picture = await this.handleUpload(upload);
		const result = await this.userService(ctx).updatePicture(id, { picture });

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async delete(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).delete(id);

		return mapper.toClass(ResultGQL, result);
	}

	@Mutation(() => ResultGQL)
	@UseMiddleware([authGuard("Bearer", [Role.ADMIN]), contextMiddleware()])
	async deletePicture(
		@Ctx() ctx: GraphQLContext,
		@Arg("id") id: string,
	): Promise<ResultGQL> {
		const result = await this.userService(ctx).deletePicture(id);

		return mapper.toClass(ResultGQL, result);
	}
}
