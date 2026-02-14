import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import type { UserUpdatePasswordDTO } from "../DTOs/user/input/update-user-password.dto";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";
import { hasher } from "../utils/hasher.util";

export async function updateUserPassword(
	id: string,
	data: UserUpdatePasswordDTO,
	users: IUsers = new Users(),
): Promise<ResultDTO> {
	const hash = await hasher.encrypt(data.password);
	const affected = await users.updatePassword(id, hash);
	return {
		success: affected > 0,
		affected,
	};
}
