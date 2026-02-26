import {
	Body,
	Controller,
	FormField,
	Post,
	Request,
	Response,
	Route,
	SuccessResponse,
	Tags,
	UploadedFile,
} from "tsoa";
import type { UploadFile } from "../../../DTOs/file/input/upload-file.dto";
import type File from "../../../DTOs/file/output/file.dto";
import { decode } from "../../../utils/validator.util";
import { uploadFileCodec } from "../../../validation/codecs/file/upload-file.codec";
import { multerFileSchema } from "../../../validation/schemas/file.schemas";

@Route("files")
@Tags("Files")
export class FileController extends Controller {
	/**
	 * @summary Upload file
	 */
	@Post("/upload")
	@SuccessResponse(200)
	@Response(400, "BadRequest")
	@Response(409, "Conflict")
	@Response(422, "UnprocessableEntity")
	@Response(429, "TooManyRequests")
	@Response(500, "InternalServerError")
	async upload(
		@FormField() title: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<File> {
		const input = {
			filename: title,
			file,
		};
		const decoded = decode<UploadFile>(uploadFileCodec, input);
		console.log(decoded);

		return {} as File;
	}
}
