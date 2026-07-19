import { getModelForClass, prop } from "@typegoose/typegoose";
import { Expose } from "class-transformer";
import { field } from "../plugins/paginate-query.plugin";
import type { Person as IPerson } from "../types/person.type";
import { Entity } from "./entity.model";

export class Person extends Entity implements IPerson {
	@Expose()
	@field()
	@prop({ required: true, trim: true })
	firstname: string;

	@Expose()
	@field()
	@prop({ required: true, trim: true })
	lastname: string;

	@Expose()
	@field({ filterable: false })
	@prop()
	birthday?: Date;
}

const personModel = getModelForClass(Person);

export default personModel;
