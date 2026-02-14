import type { User } from "./user.type";

export interface IUsers {
	create(data: User.Create): Promise<User.Entity>;
	findByEmail(email: string): Promise<User.Entity | null>;
	findById(id: string): Promise<User.Entity | null>;
	update(id: string, data: User.Update): Promise<number>;
	updateStatus(id: string, data: User.UpdateStatus): Promise<number>;
	updateRole(id: string, data: User.UpdateRole): Promise<number>;
	updatePassword(id: string, password: string): Promise<number>;
	delete(id: string): Promise<number>;
}
