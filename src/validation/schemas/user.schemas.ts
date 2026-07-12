import z from "zod";
import { Role, UpdateRole } from "../../enums/role.enum";

export const usernameSchema = z
	.string()
	.nonempty("Username is required")
	.min(3, "Username must be at least 3 characters")
	.max(30, "Username cannot exceed 30 characters")
	.trim()
	.refine(
		(val) => /^[a-zA-Z0-9_]+$/.test(val),
		"Username can only contain letters, numbers and underscores, no spaces allowed",
	);

export const roleSchema = z.enum(Role);

export const updateRoleSchema = z.enum(UpdateRole);

export const emailSchema = z
	.email("Invalid email format")
	.nonempty("Email is required")
	.max(100, "Email cannot exceed 100 characters")
	.trim()
	.toLowerCase();

export const passwordSchema = z
	.string()
	.nonempty("Password is required")
	.min(8, "Password must be at least 8 characters")
	.max(100, "Password cannot exceed 100 characters")
	.refine(
		(val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
		"Password must contain at least one uppercase letter, one lowercase letter, and one number",
	)
	.trim();
