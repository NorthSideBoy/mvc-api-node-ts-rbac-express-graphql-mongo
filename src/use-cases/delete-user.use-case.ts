import type { ResultDTO } from "../DTOs/operation/output/result.dto";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";

export async function deleteUser(
	id: string,
	users: IUsers = new Users(),
): Promise<ResultDTO> {
	const affected = await users.delete(id);
	return {
		success: affected > 0,
		affected,
	};
}
