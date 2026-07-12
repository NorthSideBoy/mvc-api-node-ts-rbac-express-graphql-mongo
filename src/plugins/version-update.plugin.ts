import type { Schema } from "mongoose";

export function versionUpdatePlugin(schema: Schema) {
	schema.pre(["updateOne", "updateMany", "findOneAndUpdate"], function () {
		const update = this.getUpdate();

		if (!update || Array.isArray(update)) return;

		update.$inc = {
			...update.$inc,
			__v: 1,
		};

		this.setUpdate(update);
	});
}
