import bcrypt from "bcrypt";

const DEFAULT_SALT_ROUNDS = 10;

/**
 * Simple wrapper around bcrypt to keep hashing logic in one place.
 */
export const hasher = {
	encrypt: async (
		plain: string,
		saltRounds = DEFAULT_SALT_ROUNDS,
	): Promise<string> => bcrypt.hash(plain, saltRounds),

	compare: (plain: string, hashed: string): Promise<boolean> =>
		bcrypt.compare(plain, hashed),
};
