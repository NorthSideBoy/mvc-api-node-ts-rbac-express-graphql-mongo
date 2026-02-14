import type { UserRegisterDTO } from "../DTOs/user/input/register-user.dto";
import type { UserDTO } from "../DTOs/user/output/user.dto";
import { RepositoryErrorCode } from "../enums/repository-error-code.enum";
import { RepositoryError } from "../errors/repository-error";
import { UserAlreadyExistsError } from "../errors/user/user-already-exists.error";
import { Role } from "../rbac/role";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";
import { hasher } from "../utils/hasher.util";

export async function registerUser(
	data: UserRegisterDTO,
	users: IUsers = new Users(),
): Promise<UserDTO> {
	try {
		const hash = await hasher.encrypt(data.password);
		data.password = hash;
		const user = await users.create({
			...data,
			role: Role.USER,
		});
		const { password, ...secure } = user;
		return secure;
	} catch (error) {
		if (
			error instanceof RepositoryError &&
			error.code === RepositoryErrorCode.UniqueConstraint
		)
			throw new UserAlreadyExistsError();
		throw error;
	}
}
