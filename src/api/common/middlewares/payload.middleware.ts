import type { IncomingMessage } from "node:http";
import type { ErrorRequestHandler, RequestHandler, Response } from "express";
import PayloadTooLargeError from "../../../errors/http/payload-too-large.error";

type ParserError = Error & {
	status?: unknown;
	statusCode?: unknown;
	type?: unknown;
	code?: unknown;
};

export const normalizePayloadError = (error: unknown): unknown => {
	if (error instanceof PayloadTooLargeError || !(error instanceof Error))
		return error;

	const { status, statusCode, type, code } = error as ParserError;
	const isPayloadTooLarge =
		status === 413 ||
		statusCode === 413 ||
		type === "entity.too.large" ||
		type === "parameters.too.many" ||
		code === "LIMIT_FILE_SIZE" ||
		code === "LIMIT_FIELD_VALUE";

	return isPayloadTooLarge ? new PayloadTooLargeError(undefined, error) : error;
};

export const payloadErrorMiddleware: ErrorRequestHandler = (
	error,
	_request,
	_response,
	next,
) => next(normalizePayloadError(error));

const sendPayloadTooLarge = (
	request: IncomingMessage,
	response: Response,
): void => {
	if (response.headersSent || response.writableEnded || response.destroyed) {
		request.destroy();
		return;
	}

	request.pause();
	const error = new PayloadTooLargeError();
	const body = JSON.stringify({ message: error.message, code: error.code });
	response.statusCode = error.status;
	response.setHeader("Connection", "close");
	response.setHeader("Content-Type", "application/json; charset=utf-8");
	response.setHeader("Content-Length", Buffer.byteLength(body));
	response.end(body, () => request.destroy());
};

export const payloadLimit = (maxBytes: number): RequestHandler => {
	if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0)
		throw new TypeError("Payload limit must be a positive safe integer");

	return (request, response, next) => {
		const contentLength = request.headers["content-length"];
		if (contentLength && Number(contentLength) > maxBytes) {
			sendPayloadTooLarge(request, response);
			return;
		}

		if (request.readableLength > maxBytes) {
			sendPayloadTooLarge(request, response);
			return;
		}

		const originalPush = request.push;
		let receivedBytes = request.readableLength;
		let exceeded = false;
		request.push = function push(chunk, encoding) {
			if (chunk === null) return originalPush.call(this, null);
			if (exceeded) return false;

			receivedBytes += Buffer.byteLength(
				chunk as string | NodeJS.ArrayBufferView,
				encoding,
			);
			if (receivedBytes > maxBytes) {
				exceeded = true;
				this.pause();
				sendPayloadTooLarge(this, response);
				return false;
			}

			return originalPush.call(this, chunk, encoding);
		};

		const cleanup = () => {
			request.push = originalPush;
		};
		request.once("end", cleanup);
		request.once("close", cleanup);
		request.once("aborted", cleanup);
		response.once("finish", () => {
			if (!request.readableEnded) request.destroy();
			cleanup();
		});
		next();
	};
};
