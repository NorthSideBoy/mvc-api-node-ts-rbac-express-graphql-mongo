import { Field, InputType } from "type-graphql";
import type { CreateUser } from "../../../../../DTOs/user/input/create-user.dto";
import { UpdateRole } from "../../../../../enums/role.enum";
import PersonGQL from "../../common/person.schema";

@InputType("CreateUser")
export default class CreateUserGQL
	extends PersonGQL
	implements Omit<CreateUser, "picture" | "role">
{
	@Field()
	username!: string;

	@Field(() => UpdateRole)
	role!: UpdateRole;

	@Field()
	password!: string;

	@Field()
	email!: string;

	@Field()
	birthday!: Date;

	@Field({ nullable: true })
	enable?: boolean;
}
