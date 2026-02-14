import { createUserCodec } from "../codecs/user/create-user.codec";
import { loginUserCodec } from "../codecs/user/login-user.codec";
import { registerUserCodec } from "../codecs/user/register-user.codec";
import { updateUserCodec } from "../codecs/user/update-user.codec";
import { updateUserPasswordCodec } from "../codecs/user/update-user-password.codec";
import { updateUserRoleCodec } from "../codecs/user/update-user-role.codec";
import { updateUserStatusCodec } from "../codecs/user/update-user-status.codec";
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
import { createUser } from "../use-cases/create-user.use-case";
import { deleteUser } from "../use-cases/delete-user.use-case";
import { findUserById } from "../use-cases/find-user-by-id.use-case";
import { getProfile } from "../use-cases/get-profile.use-case";
import { loginUser } from "../use-cases/login-user.use-case";
import { registerUser } from "../use-cases/register-user.use-case";
import { updateUser } from "../use-cases/update-user.use-case";
import { updateUserPassword } from "../use-cases/update-user-password.use-case";
import { updateUserRole } from "../use-cases/update-user-role.use-case";
import { updateUserStatus } from "../use-cases/update-user-status.use-case";
import { tokenizer } from "../utils/tokenizer.util";
import { decode } from "../utils/validator.util";

export class UserService {
	async register(input: unknown): Promise<UserAuthDTO> {
		const decoded = decode<UserRegisterDTO>(registerUserCodec, input);

		const user = await registerUser(decoded);

		const token = tokenizer.sign({
			sub: user.id,
			username: user.username,
			role: user.role,
			enable: user.enable ?? true,
		});

		return { ...user, token };
	}

	async login(input: unknown): Promise<UserAuthDTO> {
		const decoded = decode<UserLoginDTO>(loginUserCodec, input);

		const user = await loginUser(decoded);

		const token = tokenizer.sign({
			sub: user.id,
			username: user.username,
			role: user.role,
			enable: user.enable ?? true,
		});

		return { ...user, token };
	}

	async profile(userId: string): Promise<UserDTO> {
		return getProfile(userId);
	}

	async findById(userId: string): Promise<UserDTO> {
		return findUserById(userId);
	}

	async create(input: unknown): Promise<UserDTO> {
		const decoded = decode<UserCreateDTO>(createUserCodec, input);
		return createUser(decoded);
	}

	async update(id: string, input: unknown): Promise<ResultDTO> {
		const decoded = decode<UserUpdateDTO>(updateUserCodec, input);
		return updateUser(id, decoded);
	}

	async updateStatus(id: string, input: unknown): Promise<ResultDTO> {
		const decoded = decode<UserUpdateStatusDTO>(updateUserStatusCodec, input);
		return updateUserStatus(id, decoded);
	}

	async updateRole(id: string, input: unknown): Promise<ResultDTO> {
		const decoded = decode<UserUpdateRoleDTO>(updateUserRoleCodec, input);
		return updateUserRole(id, decoded);
	}

	async updatePassword(id: string, input: unknown): Promise<ResultDTO> {
		const decoded = decode<UserUpdatePasswordDTO>(
			updateUserPasswordCodec,
			input,
		);
		return updateUserPassword(id, decoded);
	}

	async delete(id: string): Promise<ResultDTO> {
		return deleteUser(id);
	}
}
