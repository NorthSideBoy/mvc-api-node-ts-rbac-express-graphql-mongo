import {
	type DocumentType,
	getModelForClass,
	modelOptions,
	pre,
	prop,
	type ReturnModelType,
} from "@typegoose/typegoose";
import type { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Role } from "../rbac/role";
import type { User as Types } from "../types/user.type";
import { hasher } from "../utils/hasher.util";

@modelOptions({
	schemaOptions: {
		timestamps: true,
		versionKey: false,
	},
})

@pre<User>("save", async function () {
	this.password = await hasher.encrypt(this.password);
})

export class User {
	@prop({ required: true, trim: true })
	name: string;

	@prop({ required: true, trim: true })
	lastname: string;

	@prop({ required: true, trim: true, unique: true })
	username: string;

	@prop({ required: true, trim: true, unique: true })
	email: string;

	@prop({ default: Role.USER })
	role: Role;

	@prop({ required: true, trim: true })
	password: string;

	@prop({ required: true })
	birthday: Date;

	@prop({ default: false })
	enable: boolean;

	@prop({ default: new Date() })
	createdAt: Date;

	@prop({ default: new Date() })
	updatedAt: Date;

	public get plain(): Types.Schema {
		const doc = this as unknown as DocumentType<User>;
		const {
			name,
			lastname,
			username,
			email,
			role,
			password,
			birthday,
			enable,
			createdAt,
			updatedAt,
		} = doc;
		return {
			id: doc._id.toString(),
			name,
			lastname,
			username,
			email,
			role,
			password,
			birthday,
			enable,
			createdAt,
			updatedAt,
		};
	}

	public get secure(): Types.Secure {
		const { password, ...secure } = this.plain;
		return secure;
	}

	public get profile(): Types.Profile {
		const { id, createdAt, updatedAt, ...profile } = this.secure;
		return profile;
	}

	static async findByEmail(
		this: ReturnModelType<typeof User, BeAnObject>,
		email: string,
	) {
		// biome-ignore lint: Mongoose needs to type 'this'
		return await this.findOne({ email });
	}

	static async findByUsername(
		this: ReturnModelType<typeof User, BeAnObject>,
		username: string,
	) {
		// biome-ignore lint: Mongoose needs to type 'this'
		return await this.findOne({ username });
	}

	public async comparePassword(
		this: DocumentType<User, BeAnObject>,
		plain: string,
	): Promise<boolean> {
		return await hasher.compare(plain, this.password);
	}

	static async updatePassword(
		this: ReturnModelType<typeof User, BeAnObject>,
		id: string,
		password: string,
	) {
		const hash = await hasher.encrypt(password);
		// biome-ignore lint: Mongoose needs to type 'this'
		return await this.updateOne({ _id: id }, { password: hash });
	}

	static async findOneByRole(
		this: ReturnModelType<typeof User, BeAnObject>,
		role: Role,
	) {
		// biome-ignore lint: Mongoose needs to type 'this'
		const user = await this.findOne({ role });
		return user;
	}
}

const UserModel = getModelForClass(User);

export default UserModel;
