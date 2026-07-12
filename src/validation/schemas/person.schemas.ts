import z from "zod";

export const firstnameSchema = z
	.string()
	.nonempty("Firstname is required")
	.min(2, "Firstname must be at least 2 characters")
	.max(50, "Firstname cannot exceed 50 characters")
	.refine(
		(val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:[-']+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$/.test(val),
		"Firstname can only contain letters, hyphens, and apostrophes (no spaces allowed)",
	)
	.trim()
	.toLowerCase();

export const lastnameSchema = z
	.string()
	.nonempty("Lastname is required")
	.min(2, "Lastname must be at least 2 characters")
	.max(70, "Lastname cannot exceed 70 characters")
	.refine(
		(val) =>
			/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:[-']+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*(?: [a-zA-ZáéíóúÁÉÍÓÚñÑ]+(?:[-']+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*)?$/.test(
				val,
			),
		"Lastname can only contain letters, hyphens, apostrophes, and at most one space",
	)
	.trim()
	.toLowerCase();
