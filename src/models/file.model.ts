import path from "node:path";
import {
	getModelForClass,
	plugin,
	prop,
	type ReturnModelType,
} from "@typegoose/typegoose";
import type { DocumentType } from "@typegoose/typegoose/lib/types";
import { Expose } from "class-transformer";
import type { File as DTO } from "../DTOs/file/output/file.dto";
import { FileVisibility } from "../enums/file-visibility.enum";
import type { Mimetype } from "../enums/mimetype.enum";
import { preventDelete } from "../plugins/prevent-delete.plugin";
import { mapper } from "../utils/mapper.util";
import { url } from "../utils/url.util";
import { fileCodec } from "../validation/codecs/file/output/file.codec";
import { Entity } from "./entity.model";

@plugin(preventDelete, {
	references: [{ collection: "users", path: "picture" }],
})
export class File extends Entity {
	@Expose()
	@prop({ required: true, trim: true })
	alt: string;

	@Expose()
	@prop({ required: true, unique: true, trim: true })
	filename: string;

	@Expose()
	@prop({ required: true })
	size: number;

	@Expose()
	@prop({ required: true, type: String })
	mimetype: Mimetype;

	@Expose()
	@prop({ required: true, trim: true })
	ext: string;

	@Expose()
	@prop({ required: true, trim: true })
	path: string;

	@Expose()
	@prop({ required: true, default: FileVisibility.PUBLIC, type: String })
	visibility: FileVisibility;

	@Expose()
	public get url(): string {
		return url.from(path.join(this.path, this.filename));
	}

	public dto(this: DocumentType<File>): DTO {
		return mapper.toDto(File, this, fileCodec);
	}

	static async findByFilename(
		this: ReturnModelType<typeof File>,
		filename: string,
	) {
		// biome-ignore lint: Mongoose return type handled by Typegoose
		return await this.findOne({ filename });
	}

	public get absolutePath(): string {
		return path.join(process.cwd(), "storage", this.path);
	}
}

const fileModel = getModelForClass(File);

export default fileModel;
