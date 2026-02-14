import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import type { UserUpdateRoleDTO } from "../DTOs/user/input/update-user-role.dto";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";

export async function updateUserRole(
	id: string,
	data: UserUpdateRoleDTO,
	users: IUsers = new Users(),
): Promise<ResultDTO> {
	const affected = await users.updateRole(id, data);
	return {
		success: affected > 0,
		affected,
	};
}
