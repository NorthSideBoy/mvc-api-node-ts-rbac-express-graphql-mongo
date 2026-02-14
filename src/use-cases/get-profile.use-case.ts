import type { UserDTO } from "../DTOs/user/output/user.dto";
import { UserNotFoundError } from "../errors/user/user-not-found.error";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";

export async function getProfile(
	userId: string,
	users: IUsers = new Users(),
): Promise<UserDTO> {
	const user = await users.findById(userId);
	if (!user) throw new UserNotFoundError();
	const { password, ...secure } = user;
	return secure;
}
