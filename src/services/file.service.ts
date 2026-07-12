import type { CreateFile } from "../DTOs/file/input/create-file.dto";
import type { UpdateFile } from "../DTOs/file/input/update-file.dto";
import type { File as DTO } from "../DTOs/file/output/file.dto";
import { result } from "../factories/result.factory";
import File from "../models/file.model";
import type { Result } from "../types/result.type";
import { decode } from "../utils/validator.util";
import { createFileCodec } from "../validation/codecs/file/input/create-file.codec";
import { updateFileCodec } from "../validation/codecs/file/input/update-file.codec";
import { idSchema } from "../validation/schemas/common.schemas";
import BaseService from "./base.service";

export default class FileService extends BaseService {
	async findById(id: string): Promise<DTO | null> {
		const fileId = decode(idSchema, id);
		const file = await File.findById(fileId);

		return file?.dto() || null;
	}

	async findByFilename(filename: string): Promise<DTO | null> {
		const file = await File.findByFilename(filename);

		return file?.dto() || null;
	}

	async create(input: CreateFile): Promise<DTO> {
		const decoded = decode(createFileCodec, input);
		const file = await File.create(decoded);

		return file.dto();
	}

	async update(id: string, input: UpdateFile): Promise<Result> {
		const decoded = decode(updateFileCodec, input);
		const operation = await File.updateOne({ _id: id }, decoded);

		return result(operation.modifiedCount);
	}

	async delete(id: string): Promise<Result> {
		const operation = await File.deleteOne({ _id: id });

		return result(operation.deletedCount);
	}
}
