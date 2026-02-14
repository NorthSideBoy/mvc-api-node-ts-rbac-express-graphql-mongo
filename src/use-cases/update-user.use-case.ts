import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import type { UserUpdateDTO } from "../DTOs/user/input/update-user.dto";
import { RepositoryErrorCode } from "../enums/repository-error-code.enum";
import { RepositoryError } from "../errors/repository-error";
import { UserAlreadyExistsError } from "../errors/user/user-already-exists.error";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";

export async function updateUser(
	id: string,
	data: UserUpdateDTO,
	users: IUsers = new Users(),
): Promise<ResultDTO> {
	try {
		const affected = await users.update(id, data);
		return {
			success: affected > 0,
			affected,
		};
	} catch (error) {
		if (
			error instanceof RepositoryError &&
			error.code === RepositoryErrorCode.UniqueConstraint
		)
			throw new UserAlreadyExistsError();
		throw error;
	}
}
