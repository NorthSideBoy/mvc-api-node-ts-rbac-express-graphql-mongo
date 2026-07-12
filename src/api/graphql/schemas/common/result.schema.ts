import { Field, ObjectType } from "type-graphql";
import type { Result } from "../../../../types/result.type";

@ObjectType("Result")
export default class ResultGQL implements Result {
	@Field()
	success!: boolean;

	@Field()
	affected!: number;
}
