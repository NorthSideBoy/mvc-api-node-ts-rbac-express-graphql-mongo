import type { Role } from "../../../enums/role.enum";
import type { AccessGrant } from "../../../security/access-grant";
import type { ExtendedRequest } from "../../common/types/extended-request.type";
import { authorize } from "../../common/utils/auth.util";

export async function expressAuthentication(
	request: ExtendedRequest,
	securityName: string,
	allowedRoles: Role[],
): Promise<AccessGrant> {
	const access = await authorize(
		request.headers.authorization,
		securityName,
		allowedRoles,
	);
	request.access = access;
	return access;
}
