import type File from "../output/file.dto";

type UploadFileType = Pick<File, "filename"> & { file: Express.Multer.File };

export type UploadFile = {
	filename: string;
	file: Express.Multer.File;
};

const _typeCheck: UploadFileType = {} as UploadFile;
