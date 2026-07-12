import {
	getModelForClass,
	modelOptions,
	plugin,
	prop,
} from "@typegoose/typegoose";
import type { Base } from "@typegoose/typegoose/lib/defaultClasses";
import type {
	AnyParamConstructor,
	DocumentType,
	ReturnModelType,
} from "@typegoose/typegoose/lib/types";
import { Expose } from "class-transformer";
import type mongoose from "mongoose";
import type { Types } from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import paginatePlugin from "mongoose-paginate-v2";
import { schemaOptions } from "../constants/schema-options.constant";
import {
	field,
	type QueryModel,
	queryPlugin,
} from "../plugins/paginate-query.plugin";
import { versionUpdatePlugin } from "../plugins/version-update.plugin";

export type EntityModelType<T extends AnyParamConstructor<unknown>> =
	ReturnModelType<T> &
		Pick<mongoose.PaginateModel<DocumentType<InstanceType<T>>>, "paginate"> &
		Pick<QueryModel<DocumentType<InstanceType<T>>>, "query">;

@plugin(paginatePlugin)
@plugin(queryPlugin)
@plugin(versionUpdatePlugin)
@plugin(mongooseAutoPopulate)
@modelOptions({ schemaOptions })
export class Entity implements Base {
	_id!: Types.ObjectId;

	@Expose()
	@field({ sortable: false })
	id!: string;

	@Expose()
	@field({ range: true })
	@prop({ default: Date.now })
	createdAt: Date;

	@Expose()
	@field({ range: true })
	@prop({ default: Date.now })
	updatedAt: Date;
}

const entityModel = getModelForClass(Entity);

export default entityModel;
