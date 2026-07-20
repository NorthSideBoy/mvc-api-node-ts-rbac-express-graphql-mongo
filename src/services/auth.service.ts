import type { LoginUser } from "../DTOs/auth/input/login-user.dto";
import type { RegisterUser } from "../DTOs/auth/input/register-user.dto";
import type { AuthenticatedUser } from "../DTOs/auth/output/authenticated-user.dto";
import type { User as DTO } from "../DTOs/user/output/user.dto";
import { InvalidUserCredentialsError } from "../errors/application/invalid-user-credentials.error";
import { EVENTS } from "../events/constants/events.constants";
import User from "../models/user.model";
import { tokenizer } from "../utils/tokenizer.util";
import { decode } from "../utils/validator.util";
//import { loginUserCodec } from "../validation/codecs/auth/input/login-user.codec";
import { registerUserCodec } from "../validation/codecs/auth/input/register-user.codec";
import BaseService from "./base.service";
import UserService from "./user.service";

type AuthEventMetadata = {
	ip: string;
};

export default class AuthService extends BaseService {
	private readonly userService = new UserService(this.ctx);

	private toAuthenticated(user: DTO, token: string): AuthenticatedUser {
		return { ...user, token };
	}

	async register(
		input: RegisterUser,
		metadata: AuthEventMetadata,
	): Promise<AuthenticatedUser> {
		const decoded = decode(registerUserCodec, input);
		const user = await this.userService.register(decoded);
		const token = tokenizer.sign(user.sign);
		this.emit(EVENTS.AUTH.ACCOUNT_REGISTERED, {
			id: user.id,
			email: user.email,
			ip: metadata.ip,
		});

		return this.toAuthenticated(user.dto(), token);
	}

	async login(
		input: LoginUser,
		metadata: AuthEventMetadata,
	): Promise<AuthenticatedUser> {
		const user = await User.findByEmail(input.email);
		if (!user) throw new InvalidUserCredentialsError();
		const isValid = await user.comparePassword(input.password);
		if (!isValid) throw new InvalidUserCredentialsError();
		const token = tokenizer.sign(user.sign);
		const authenticated = this.toAuthenticated(user.dto(), token);
		this.emit(EVENTS.AUTH.ACCOUNT_LOGGED_IN, {
			id: user.id,
			email: user.email,
			ip: metadata.ip,
		});

		return authenticated;
	}
}
