import type { UserCreateDTO } from "../DTOs/user/input/create-user.dto";
import type { UserDTO } from "../DTOs/user/output/user.dto";
import { RepositoryErrorCode } from "../enums/repository-error-code.enum";
import { RepositoryError } from "../errors/repository-error";
import { UserAlreadyExistsError } from "../errors/user/user-already-exists.error";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";
import { hasher } from "../utils/hasher.util";

export async function createUser(
	data: UserCreateDTO,
	users: IUsers = new Users(),
): Promise<UserDTO> {
	try {
		const hash = await hasher.encrypt(data.password);
		const user = await users.create({ ...data, password: hash });
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
