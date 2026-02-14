import { Role as PrismaRole, type Users as PrismaUsers } from "@prisma/client";
import { Role } from "../rbac/role";
import type { User } from "../types/user.type";
import type { IUsers } from "../types/users.type";
import { PrismaRepository } from "./prisma.repository";

export class Users extends PrismaRepository implements IUsers {
	protected readonly model = this.client.users;

	private parseRole(role: PrismaRole): Role {
		const map: Record<PrismaRole, Role> = {
			[PrismaRole.ADMIN]: Role.ADMIN,
			[PrismaRole.MANAGER]: Role.MANAGER,
			[PrismaRole.USER]: Role.USER,
		};

		return map[role];
	}

	private readonly toEntity = (user: PrismaUsers): User.Entity => ({
		...user,
		role: this.parseRole(user.role),
	});

	private sanitizeUpdate(data: User.Update): Partial<User.Update> {
		const entries = Object.entries(data).filter(
			([, value]) => value !== undefined,
		);
		return Object.fromEntries(entries);
	}

	async create(data: User.Create): Promise<User.Entity> {
		return await this.execute(async () => {
			const user = await this.model.create({ data });
			return this.toEntity(user);
		});
	}

	async findByEmail(email: string): Promise<User.Entity | null> {
		return await this.execute(async () => {
			const user = await this.model.findUnique({ where: { email } });
			if (!user) return null;
			return this.toEntity(user);
		});
	}

	async findById(id: string): Promise<User.Entity | null> {
		return await this.execute(async () => {
			const user = await this.model.findUnique({ where: { id } });
			if (!user) return null;
			return this.toEntity(user);
		});
	}

	async update(id: string, data: User.Update): Promise<number> {
		return await this.execute(async () => {
			const sanitized = this.sanitizeUpdate(data);
			const { count } = await this.model.updateMany({
				where: { id },
				data: sanitized,
			});
			return count;
		});
	}

	async updateStatus(id: string, data: User.UpdateStatus): Promise<number> {
		return await this.execute(async () => {
			const { count } = await this.model.updateMany({
				where: { id },
				data,
			});
			return count;
		});
	}

	async updateRole(id: string, data: User.UpdateRole): Promise<number> {
		return await this.execute(async () => {
			const { count } = await this.model.updateMany({
				where: { id },
				data,
			});
			return count;
		});
	}

	async updatePassword(id: string, password: string): Promise<number> {
		return await this.execute(async () => {
			const { count } = await this.model.updateMany({
				where: { id },
				data: { password },
			});
			return count;
		});
	}

	async delete(id: string): Promise<number> {
		return await this.execute(async () => {
			const { count } = await this.model.deleteMany({ where: { id } });
			return count;
		});
	}
}
