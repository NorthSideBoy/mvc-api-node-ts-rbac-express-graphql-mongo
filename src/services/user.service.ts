import type { DocumentType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import type { CreateUser } from "../DTOs/user/input/create-user.dto";
import type { QueryUsers } from "../DTOs/user/input/query-users.dto";
import type { UpdateUserEmail } from "../DTOs/user/input/update-user-email.dto";
import type { UpdateUserPassword } from "../DTOs/user/input/update-user-password.dto";
import type { UpdateUserPicture } from "../DTOs/user/input/update-user-picture.dto";
import type { UpdateUserProfile } from "../DTOs/user/input/update-user-profile.dto";
import type { UpdateUserRole } from "../DTOs/user/input/update-user-role.dto";
import type { UpdateUserStatus } from "../DTOs/user/input/update-user-status.dto";
import type { UpdateUserUsername } from "../DTOs/user/input/update-user-username.dto";
import type { User as DTO } from "../DTOs/user/output/user.dto";
import type { Role } from "../enums/role.enum";
import { DuplicatePasswordError } from "../errors/application/duplicate-password.error";
import { EmailInUseError } from "../errors/application/email-in-use.error";
import { UserNotFoundError } from "../errors/application/user-not-found.error";
import { UsernameInUseError } from "../errors/application/username-in-use.error";
import { EVENTS } from "../events/constants/events.constants";
import { result } from "../factories/result.factory";
import { search } from "../factories/search.factory";
import UserHelper from "../helpers/user.helper";
import { extToMimetype } from "../mappers/mimetype.mapper";
import User, { type User as UserEntity } from "../models/user.model";
import { Permission } from "../rbac";
import type { Result } from "../types/result.type";
import type Search from "../types/search.type";
import { file as fileUtil } from "../utils/file.util";
import { decode } from "../utils/validator.util";
import { createUserCodec } from "../validation/codecs/user/input/create-user.codec";
import { queryUsersCodec } from "../validation/codecs/user/input/query-users.codec";
import { updateUserEmailCodec } from "../validation/codecs/user/input/update-user-email.codec";
import { updateUserPasswordCodec } from "../validation/codecs/user/input/update-user-password.codec";
import { updateUserPictureCodec } from "../validation/codecs/user/input/update-user-picture.codec";
import { updateUserProfileCodec } from "../validation/codecs/user/input/update-user-profile.codec";
import { updateUserRoleCodec } from "../validation/codecs/user/input/update-user-role.codec";
import { updateUserStatusCodec } from "../validation/codecs/user/input/update-user-status.codec";
import { updateUserUsernameCodec } from "../validation/codecs/user/input/update-user-username.codec";
import { idSchema } from "../validation/schemas/common.schemas";
import BaseService from "./base.service";
import FileService from "./file.service";
import StorageService from "./storage.service";

export default class UserService extends BaseService {
	private readonly storage = new StorageService();
	private readonly fileService = new FileService();
	private readonly userHelper = new UserHelper();

	private async getUserByIdOrThrow(
		id: string,
	): Promise<DocumentType<UserEntity>> {
		const userId = decode(idSchema, id);
		const user = await User.findById(userId);
		if (!user) throw new UserNotFoundError();

		return user;
	}

	async create(input: CreateUser): Promise<DTO> {
		const decoded = decode(createUserCodec, input);
		this.authorize(Permission.User.Create, decoded);
		const user = await this.userHelper.create(decoded);
		this.emit(EVENTS.USER.CREATED, {
			id: user.id,
			username: user.username,
			role: user.role,
		});

		return user.dto();
	}

	async findById(id: string): Promise<DTO | null> {
		this.authorize(Permission.User.Read);
		const userId = decode(idSchema, id);
		const user = await User.findById(userId);
		if (!user) return null;

		this.emit(EVENTS.USER.READ, {
			id: user.id,
			username: user.username,
			role: user.role,
		});

		return user.dto();
	}

	async exists(id: string): Promise<boolean> {
		const userId = decode(idSchema, id);
		const exists = await User.exists({ _id: userId });

		return exists !== null;
	}

	async findAll(): Promise<DTO[]> {
		this.authorize(Permission.User.Read);
		const users = await User.find();

		return users.map((user) => user.dto());
	}

	async query(input: QueryUsers): Promise<Search<DTO>> {
		this.authorize(Permission.User.Read);
		const decoded = decode(queryUsersCodec, input);
		const result = await User.query(decoded);

		return search(result, (user) => user.dto());
	}

	async updateProfile(id: string, input: UpdateUserProfile): Promise<Result> {
		const decoded = decode(updateUserProfileCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdateProfile, user);
		const operation = await User.updateOne({ _id: id }, decoded);
		this.emit(EVENTS.USER.PROFILE_UPDATED, { id, ...decoded });

		return result(operation.modifiedCount);
	}

	async updateStatus(id: string, input: UpdateUserStatus): Promise<Result> {
		const decoded = decode(updateUserStatusCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdateStatus, user);
		const operation = await User.updateOne({ _id: id }, decoded);
		this.emit(EVENTS.USER.STATUS_UPDATED, { id, ...decoded });

		return result(operation.modifiedCount);
	}

	async updateRole(id: string, input: UpdateUserRole): Promise<Result> {
		const decoded = decode(updateUserRoleCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		const role = decoded.role as unknown as Role;
		this.authorize(Permission.User.UpdateRole, {
			id: user.id,
			role: user.role,
			assignedRole: role,
		});
		const operation = await User.updateOne({ _id: id }, decoded);
		this.emit(EVENTS.USER.ROLE_UPDATED, { id, ...decoded });

		return result(operation.modifiedCount);
	}

	async updatePassword(id: string, input: UpdateUserPassword): Promise<Result> {
		const decoded = decode(updateUserPasswordCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdatePassword, user);
		const isSamePassword = await user.comparePassword(decoded.password);
		if (isSamePassword) throw new DuplicatePasswordError();
		const operation = await User.updatePassword(id, decoded.password);
		this.emit(EVENTS.USER.PASSWORD_UPDATED, { id });

		return result(operation.modifiedCount);
	}

	async updateEmail(id: string, input: UpdateUserEmail): Promise<Result> {
		const decoded = decode(updateUserEmailCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdateEmail, user);
		const isEmailAvailable = await User.isEmailAvailable(decoded.email, id);
		if (!isEmailAvailable) throw new EmailInUseError(decoded.email);
		const operation = await User.updateOne({ _id: id }, decoded);
		this.emit(EVENTS.USER.EMAIL_UPDATED, { id, ...decoded });

		return result(operation.modifiedCount);
	}

	async updateUsername(id: string, input: UpdateUserUsername): Promise<Result> {
		const decoded = decode(updateUserUsernameCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdateUsername, user);
		const isUsernameAvailable = await User.isUsernameAvailable(
			decoded.username,
			id,
		);
		if (!isUsernameAvailable) throw new UsernameInUseError(decoded.username);
		const operation = await User.updateOne({ _id: id }, decoded);
		this.emit(EVENTS.USER.USERNAME_UPDATED, { id, ...decoded });

		return result(operation.modifiedCount);
	}

	async updatePicture(id: string, input: UpdateUserPicture): Promise<Result> {
		const decoded = decode(updateUserPictureCodec, input);
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.UpdatePicture, user);
		const picture = user.dto().picture;
		if (this.userHelper.isDefaultPicture(picture.filename)) {
			const newPictureId = await this.userHelper.processUserPicture(
				decoded.picture,
			);
			const operation = await User.updateOne(
				{ _id: id },
				{ picture: new Types.ObjectId(newPictureId) },
			);
			this.emit(EVENTS.USER.PICTURE_UPDATED, { id, pictureId: newPictureId });

			return result(operation.modifiedCount);
		}
		const overwritten = await this.storage.overwrite({
			filepath: picture.path,
			filename: picture.filename,
			file: decoded.picture,
		});
		const ext = fileUtil.ext(overwritten);
		const size = overwritten.size;
		const mimetype = extToMimetype(ext);

		const operation = await this.fileService.update(picture.id, {
			filename: overwritten.name,
			ext,
			size,
			mimetype,
		});
		this.emit(EVENTS.USER.PICTURE_UPDATED, { id, pictureId: picture.id });

		return operation;
	}

	async delete(id: string): Promise<Result> {
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.Delete, user);
		const picture = user.dto().picture;
		const operation = await User.deleteOne({ _id: id });
		this.emit(EVENTS.USER.DELETED, {
			id,
			username: user.username,
			role: user.role,
		});
		if (!this.userHelper.isDefaultPicture(picture.filename)) {
			await this.fileService.delete(picture.id);
			await this.storage.delete(picture.path, picture.filename);
		}

		return result(operation.deletedCount);
	}

	async deletePicture(id: string): Promise<Result> {
		const user = await this.getUserByIdOrThrow(id);
		this.authorize(Permission.User.DeletePicture, user);
		const picture = user.dto().picture;
		if (this.userHelper.isDefaultPicture(picture.filename)) return result(0);
		const defaultPictureId = await this.userHelper.getDefaultPictureId();
		const operation = await User.updateOne(
			{ _id: id },
			{ picture: new Types.ObjectId(defaultPictureId) },
		);
		await this.fileService.delete(picture.id);
		await this.storage.delete(picture.path, picture.filename);
		this.emit(EVENTS.USER.PICTURE_DELETED, {
			id,
			username: user.username,
			role: user.role,
			pictureId: picture.id,
		});

		return result(operation.modifiedCount);
	}
}
