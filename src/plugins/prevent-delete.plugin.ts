import type { Model, Query, Schema } from "mongoose";
import { Types } from "mongoose";
import { DocumentReferencedError } from "../errors/application/document-referenced.error";

type Reference = {
	collection: string;
	path: string;
};

type Options = {
	references: Reference[];
};

type DeleteOneQuery = Query<unknown, unknown> & {
	model: Model<{ _id: Types.ObjectId }>;
};

const objectId = (value: unknown): Types.ObjectId | undefined => {
	const id =
		value && typeof value === "object" && "$eq" in value ? value.$eq : value;

	if (id instanceof Types.ObjectId) return id;
	if (typeof id === "string" && Types.ObjectId.isValid(id))
		return new Types.ObjectId(id);
};

const targetId = async (
	query: DeleteOneQuery,
): Promise<Types.ObjectId | undefined> => {
	const filter = query.getFilter() as Record<string, unknown>;
	return (
		objectId(filter._id) ??
		(
			(await query.model.findOne(filter).select("_id").lean()) as {
				_id?: Types.ObjectId;
			} | null
		)?._id
	);
};

export function preventDelete(schema: Schema, options: Options) {
	schema.pre(
		"deleteOne",
		{ document: false, query: true },
		async function (this: DeleteOneQuery) {
			const id = await targetId(this);
			if (!id) return;

			for (const reference of options.references) {
				const document = await this.model.db
					.collection(reference.collection)
					.findOne({ [reference.path]: id }, { projection: { _id: 1 } });
				if (!document) continue;

				throw new DocumentReferencedError(
					this.model.modelName,
					id.toString(),
					reference.collection,
					reference.path,
					document._id?.toString(),
				);
			}
		},
	);
}
