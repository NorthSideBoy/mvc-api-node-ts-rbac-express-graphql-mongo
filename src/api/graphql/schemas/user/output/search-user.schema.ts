import { Field, ObjectType } from "type-graphql";
import type { User } from "../../../../../DTOs/user/output/user.dto";
import type Search from "../../../../../types/search.type";
import PaginationGQL from "../../common/pagination.schema";
import UserGQL from "./user.schema";

@ObjectType("SearchUser")
export default class SearchUserGQL implements Search<User> {
	@Field(() => [UserGQL])
	docs!: UserGQL[];

	@Field(() => PaginationGQL)
	pagination!: PaginationGQL;
}
