import type { UserLoginDTO } from "../DTOs/user/input/login-user.dto";
import type { UserDTO } from "../DTOs/user/output/user.dto";
import { InvalidCredentialsError } from "../errors/user/invalid-credentials.error";
import { Users } from "../repositories/users.repository";
import type { IUsers } from "../types/users.type";
import { hasher } from "../utils/hasher.util";

export async function loginUser(
	credentials: UserLoginDTO,
	users: IUsers = new Users(),
): Promise<UserDTO> {
	const user = await users.findByEmail(credentials.email);
	if (!user) throw new InvalidCredentialsError();
	const validPassword = await hasher.compare(
		credentials.password,
		user.password,
	);
	if (!validPassword) throw new InvalidCredentialsError();
	const { password, ...secure } = user;
	return secure;
}
