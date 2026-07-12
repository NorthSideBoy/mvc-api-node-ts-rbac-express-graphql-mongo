import { Field, InputType, ObjectType } from "type-graphql";
import type { Person } from "../../../../types/person.type";

@ObjectType("Person")
@InputType("PersonInput")
export default class PersonGQL implements Person {
	@Field()
	firstname!: string;

	@Field()
	lastname!: string;
}
