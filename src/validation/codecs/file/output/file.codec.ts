import { urlSchema } from "../../../schemas/common.schemas";
import {
	altSchema,
	extSchema,
	filenameSchema,
	mimetypeSchema,
	pathSchema,
	sizeSchema,
	visibilitySchema,
} from "../../../schemas/file.schemas";
import { entityOutputCodec } from "../../common/helpers.codec";

export const fileCodec = entityOutputCodec({
	alt: altSchema,
	filename: filenameSchema,
	size: sizeSchema,
	mimetype: mimetypeSchema,
	path: pathSchema,
	ext: extSchema,
	url: urlSchema,
	visibility: visibilitySchema,
});
