import type Pagination from "../../operation/output/pagination.dto";
import type Search from "../../operation/output/search.dto";
import type User from "./user.dto";

type SearchUserType = Search<User>;

export default class SearchUser {
	docs: User[];
	pagination: Pagination;
}

const _typeCheck: SearchUserType = {} as SearchUser;
