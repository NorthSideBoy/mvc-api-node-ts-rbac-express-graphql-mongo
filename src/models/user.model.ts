import {
	type DocumentType,
	getModelForClass,
	pre,
	prop,
} from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose/lib/types";
import { Expose, Type } from "class-transformer";
import type mongoose from "mongoose";
import { Types } from "mongoose";
import type { User as DTO } from "../DTOs/user/output/user.dto";
import { Role } from "../enums/role.enum";
import { field } from "../plugins/paginate-query.plugin";
import type { Token } from "../types/token.type";
import { hasher } from "../utils/hasher.util";
import { mapper } from "../utils/mapper.util";
import { userCodec } from "../validation/codecs/user/output/user.codec";
import type { EntityModelType } from "./entity.model";
import { File } from "./file.model";
import { Person } from "./person.model";

type UserModel = EntityModelType<typeof User>;

@pre<User>("save", async function () {
	const isHash = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
	if (!isHash.test(this.password))
		this.password = await hasher.encrypt(this.password);
})
export class User extends Person {
	@Expose()
	@field()
	@prop({ required: true, trim: true, unique: true })
	username: string;

	@Expose()
	@field()
	@prop({ required: true, trim: true, unique: true })
	email: string;

	@Expose()
	@field()
	@prop({ default: Role.USER, type: String })
	role: Role;

	@Type(() => File)
	@Expose()
	@prop({ ref: () => File, required: true, autopopulate: true })
	picture: Ref<File>;

	@prop({ required: true, trim: true })
	password: string;

	@Expose()
	@field({ filterable: false })
	@prop({ required: true })
	birthday: Date;

	@Expose()
	@field()
	@prop({ default: false })
	enable: boolean;

	public dto(this: DocumentType<User>): DTO {
		return mapper.toDto(User, this, userCodec);
	}

	public get sign(): Token.Sign {
		return {
			sub: this.id,
			username: this.username,
			role: this.role,
			enable: this.enable,
		};
	}

	public async comparePassword(
		this: DocumentType<User>,
		plain: string,
	): Promise<boolean> {
		return await hasher.compare(plain, this.password);
	}

	static async findByEmail(this: UserModel, email: string) {
		// biome-ignore lint: Mongoose return type handled by Typegoose
		return await this.findOne({ email });
	}

	static async findByUsername(this: UserModel, username: string) {
		// biome-ignore lint: Mongoose return type handled by Typegoose
		return await this.findOne({ username });
	}

	static async findOneByRole(this: UserModel, role: Role) {
		// biome-ignore lint: Mongoose return type handled by Typegoose
		return await this.findOne({ role });
	}

	static async updatePassword(
		this: UserModel,
		id: string,
		password: string,
	) {
		const hash = await hasher.encrypt(password);

		// biome-ignore lint: Mongoose return type handled by Typegoose
		return await this.updateOne({ _id: id }, { password: hash });
	}

	static async isUsernameAvailable(
		this: UserModel,
		username: string,
		id?: string,
	): Promise<boolean> {
		const query: mongoose.QueryFilter<User> = { username };
		if (id) query._id = { $ne: new Types.ObjectId(id) };

		// biome-ignore lint: Mongoose return type handled by Typegoose
		const exists = await this.exists(query);
		return exists === null;
	}

	static async isEmailAvailable(
		this: UserModel,
		email: string,
		id?: string,
	): Promise<boolean> {
		const query: mongoose.QueryFilter<User> = { email };
		if (id) query._id = { $ne: new Types.ObjectId(id) };

		// biome-ignore lint: Mongoose return type handled by Typegoose
		const exists = await this.exists(query);
		return exists === null;
	}
}

const userModel = getModelForClass(User) as UserModel;

export default userModel;
