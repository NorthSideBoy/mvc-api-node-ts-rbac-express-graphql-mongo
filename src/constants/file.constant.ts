export const BYTES_PER_MB = 1024 * 1024;

export const FILE_SIZE_LIMITS = {
	default: 5 * BYTES_PER_MB,
	image: 2 * BYTES_PER_MB,
} as const;
