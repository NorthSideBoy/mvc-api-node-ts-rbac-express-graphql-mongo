import type { Role } from "../../../enums/role.enum";
import type { AccessGrant } from "../../../security/access-grant";

export type AuthStrategy = (
	authHeader: string,
	allowedRoles: ReadonlyArray<Role>,
) => Promise<AccessGrant>;
