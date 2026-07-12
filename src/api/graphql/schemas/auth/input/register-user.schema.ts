import { Field, InputType } from "type-graphql";
import type { RegisterUser } from "../../../../../DTOs/auth/input/register-user.dto";
import PersonGQL from "../../common/person.schema";

@InputType("RegisterUser")
export default class RegisterUserGQL
	extends PersonGQL
	implements Omit<RegisterUser, "picture">
{
	@Field()
	username!: string;

	@Field()
	password!: string;

	@Field()
	email!: string;

	@Field()
	birthday!: Date;

	@Field({ nullable: true })
	enable?: boolean;
}
