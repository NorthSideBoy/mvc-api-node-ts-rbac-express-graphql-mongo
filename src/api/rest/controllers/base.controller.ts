import { Controller } from "tsoa";
import { makeFile } from "../../../factories/file.factory";

export class BaseController extends Controller {
	protected handleUpload(file?: Express.Multer.File): File | undefined {
		if (!file) return undefined;
		return makeFile(file.buffer, file.originalname, {
			type: file.mimetype,
			lastModified: Date.now(),
		});
	}
}
