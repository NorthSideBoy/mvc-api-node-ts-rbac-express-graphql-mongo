import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import type { UserUpdateStatusDTO } from "../DTOs/user/input/update-user-status.dto";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";

export async function updateUserStatus(
	id: string,
	data: UserUpdateStatusDTO,
	users: IUsers = new Users(),
): Promise<ResultDTO> {
	const affected = await users.updateStatus(id, data);
	return {
		success: affected > 0,
		affected,
	};
}
