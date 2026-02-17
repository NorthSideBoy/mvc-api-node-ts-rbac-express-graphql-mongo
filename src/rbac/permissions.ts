export const PERMISSIONS = {
	USER_CREATE: "users.create",
	USER_READ: "users.read",
	USER_UPDATE: "users.update",
	USER_SET_STATUS: "users.set_status",
	USER_DELETE: "users.delete",
	USER_ASSIGN_ROLE: "users.assign_role",
	USER_PASSWORD_CHANGE: "users.password.change",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
