import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import type { FileUpload } from "graphql-upload/processRequest.mjs";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import AuthService from "../../../services/auth.service";
import { mapper } from "../../../utils/mapper.util";
import { clientIp } from "../../common/utils/client-ip.util";
import { authLimiter } from "../middlewares/rate-limiter.middleware";
// biome-ignore lint: GQL schemas should not be type
import LoginUserGQL from "../schemas/auth/input/login-user.schema";
// biome-ignore lint: GQL schemas should not be type
import RegisterUserGQL from "../schemas/auth/input/register-user.schema";
import AuthenticatedUserGQL from "../schemas/auth/output/authenticated-user.schema";
import type { GraphQLContext } from "../types/graphql-context.type";
import BaseResolver from "./base.resolver";

@Resolver()
export default class AuthResolver extends BaseResolver {
	private authService(ctx: GraphQLContext): AuthService {
		return new AuthService(ctx.req.context);
	}

	@Mutation(() => AuthenticatedUserGQL)
	async register(
		@Ctx() ctx: GraphQLContext,
		@Arg("data") data: RegisterUserGQL,
		@Arg("upload", () => GraphQLUpload, { nullable: true })
		upload?: Promise<FileUpload>,
	): Promise<AuthenticatedUserGQL> {
		const picture = await this.handleUpload(upload);
		const result = await this.authService(ctx).register(
			Object.assign({ picture }, data),
			{ ip: clientIp(ctx.req) },
		);
		const gql = mapper.toClass(AuthenticatedUserGQL, result);

		return gql;
	}

	@Mutation(() => AuthenticatedUserGQL)
	@UseMiddleware(authLimiter())
	async login(
		@Ctx() ctx: GraphQLContext,
		@Arg("data") data: LoginUserGQL,
	): Promise<AuthenticatedUserGQL> {
		const result = await this.authService(ctx).login(data, {
			ip: clientIp(ctx.req),
		});
		const gql = mapper.toClass(AuthenticatedUserGQL, result);

		return gql;
	}
}
