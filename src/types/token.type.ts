import type { User } from "./user.type";

export namespace Token {
	export type Sign = { sub: string } & Pick<
		User.Entity,
		"username" | "role" | "enable"
	>;

	export type Payload = Sign & { iat: number; exp: number };
}
