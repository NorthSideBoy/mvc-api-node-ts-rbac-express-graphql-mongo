export function makeFile(
	buffer: Buffer,
	filename: string,
	options?: FilePropertyBag,
): File {
	const uint8Array = new Uint8Array(buffer);
	return new File([uint8Array], filename, options);
}
