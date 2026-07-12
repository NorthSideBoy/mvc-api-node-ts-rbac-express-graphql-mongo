import { ApplicationErrorCode } from "../../enums/application-error-code.enum";
import { ApplicationError } from "../core/application-error";

export class DocumentReferencedError extends ApplicationError {
	constructor(
		model: string,
		id: string,
		referencedBy: string,
		path: string,
		referencingId?: string,
	) {
		super(
			"The document is referenced.",
			ApplicationErrorCode.DocumentReferenced,
			undefined,
			{ model, id, referencedBy, path, referencingId },
		);
	}
}
