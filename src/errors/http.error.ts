export default class HttpError extends Error {
	readonly status: number;
	readonly code: string;

	constructor(message: string, status: number, code: string) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.status = status;
	}
}
