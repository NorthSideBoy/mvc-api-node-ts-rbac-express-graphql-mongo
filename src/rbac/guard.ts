import { Role } from "./role";

export function isRole(role: unknown): role is Role {
	return Object.values(Role).includes(role as Role);
}

export function isAdminRole(role: unknown): role is Role.ADMIN {
	return role === Role.ADMIN;
}

export function isManagerRole(role: unknown): role is Role.MANAGER {
	return role === Role.MANAGER;
}

export function isUserRole(role: unknown): role is Role.USER {
	return role === Role.USER;
}
