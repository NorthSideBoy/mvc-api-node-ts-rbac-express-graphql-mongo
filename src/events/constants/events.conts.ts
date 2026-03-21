export const EVENTS = {
	// Auth
	AUTH_USER_REGISTERED: "auth.user.registered",
	AUTH_USER_LOGGED_IN: "auth.user.logged_in",

	// User
	USER_CREATED: "user.created",
	USER_PROFILE_UPDATED: "user.profile.updated",
	USER_STATUS_UPDATED: "user.status.updated",
	USER_ROLE_UPDATED: "user.role.updated",
	USER_PASSWORD_UPDATED: "user.password.updated",
	USER_EMAIL_UPDATED: "user.email.updated",
	USER_USERNAME_UPDATED: "user.username.updated",
	USER_PICTURE_UPDATED: "user.picture.updated",
	USER_PICTURE_DELETED: "user.picture.deleted",
	USER_DELETED: "user.deleted",
} as const;
