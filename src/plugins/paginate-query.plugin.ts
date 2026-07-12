import type {
	PaginateModel,
	PaginateOptions,
	PaginateResult,
	Schema,
} from "mongoose";

type QueryParams = Record<string, unknown>;
type SortDirection = 1 | -1;
type Sort = Record<string, SortDirection>;

interface Field {
	propertyKey: string;
	fieldName: string;
	filterable: boolean;
	sortable: boolean;
	range?: boolean;
	searchable?: boolean;
	type: "string" | "number" | "date" | "boolean";
	prop?: string;
}

const designTypeMap = new Map<unknown, Field["type"]>([
	[String, "string"],
	[Number, "number"],
	[Boolean, "boolean"],
	[Date, "date"],
]);

interface OperatorFilter {
	operator: unknown;
	value: unknown;
}

const operatorMap = {
	neq: "$ne",
	gt: "$gt",
	gte: "$gte",
	lt: "$lt",
	lte: "$lte",
} as const;

const fieldMap = new Map<string, Field[]>();
const classParentMap = new Map<string, string | undefined>();

function inferPropertyType(target: object, propertyKey: string): Field["type"] {
	const designType = Reflect.getMetadata("design:type", target, propertyKey);
	return designTypeMap.get(designType) ?? "string";
}

function registerClassParent(target: object, className: string): void {
	const parentPrototype = Object.getPrototypeOf(target);
	const parentClassName = parentPrototype?.constructor?.name;

	if (parentClassName && parentClassName !== "Object") {
		classParentMap.set(className, parentClassName);
		return;
	}

	if (!classParentMap.has(className)) classParentMap.set(className, undefined);
}

function appendField(className: string, field: Field): void {
	const existing = fieldMap.get(className) ?? [];
	fieldMap.set(className, [...existing, field]);
}

function collectFields(
	className: string,
	predicate: (field: Field) => boolean,
	visited = new Set<string>(),
): Field[] {
	if (visited.has(className)) return [];
	visited.add(className);

	const parentClassName = classParentMap.get(className);
	const inherited = parentClassName
		? collectFields(parentClassName, predicate, visited)
		: [];
	const own = (fieldMap.get(className) ?? []).filter(predicate);
	const merged = new Map<string, Field>();

	for (const item of inherited) merged.set(item.propertyKey, item);
	for (const item of own) merged.set(item.propertyKey, item);

	return [...merged.values()];
}

export function field(
	options: Partial<Omit<Field, "propertyKey" | "fieldName">> = {},
): PropertyDecorator {
	return (target: object, propertyKey: string | symbol) => {
		const className = target.constructor.name;
		registerClassParent(target, className);
		const propName = propertyKey as string;
		const config: Field = {
			propertyKey: propName,
			fieldName: options.prop || propName,
			filterable: options.filterable ?? true,
			sortable: options.sortable ?? true,
			range: options.range,
			searchable: options.searchable,
			type: options.type ?? inferPropertyType(target, propName),
		};

		appendField(className, config);
	};
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildWildcardRegex(value: string): RegExp {
	const pattern = value
		.split("*")
		.map((part) => escapeRegex(part))
		.join(".*");
	return new RegExp(`^${pattern}$`, "i");
}

function normalizeValue(
	value: unknown,
	type: Field["type"] = "string",
): unknown {
	if (value === undefined || value === null) return value;

	if (type === "number") {
		const normalized = Number(value);
		return Number.isNaN(normalized) ? value : normalized;
	}
	if (type === "boolean") {
		if (typeof value === "boolean") return value;
		if (value === "true") return true;
		if (value === "false") return false;
		return value;
	}
	if (type === "date") {
		if (value instanceof Date) return value;
		const normalized = new Date(value as string | number);
		return Number.isNaN(normalized.getTime()) ? value : normalized;
	}
	return value;
}

function isOperatorFilter(value: unknown): value is OperatorFilter {
	return (
		typeof value === "object" &&
		value !== null &&
		"operator" in value &&
		"value" in value
	);
}

function buildRange(
	from?: unknown,
	to?: unknown,
	type?: Field["type"],
): QueryParams | undefined {
	if (from === undefined && to === undefined) return undefined;
	const range: QueryParams = {};
	if (from !== undefined) range.$gte = normalizeValue(from, type);
	if (to !== undefined) range.$lte = normalizeValue(to, type);
	return range;
}

function buildOperatorFilter(
	{ operator, value }: OperatorFilter,
	type: Field["type"],
): unknown {
	const normalized = normalizeValue(value, type);

	if (operator === "like") {
		return typeof normalized === "string"
			? new RegExp(escapeRegex(normalized), "i")
			: normalized;
	}

	const mongoOperator =
		typeof operator === "string"
			? operatorMap[operator as keyof typeof operatorMap]
			: undefined;
	return mongoOperator ? { [mongoOperator]: normalized } : normalized;
}

function buildFilters(
	query: QueryParams,
	filterableFields: Field[],
): QueryParams {
	const filters: QueryParams = {};
	const stringFields = filterableFields
		.filter(
			(config) =>
				config.type === "string" &&
				!config.range &&
				config.fieldName !== "id" &&
				config.searchable !== false,
		)
		.map((config) => config.fieldName);

	for (const config of filterableFields) {
		if (config.range) {
			const fromKey = `${config.propertyKey}From`;
			const toKey = `${config.propertyKey}To`;
			const fromValue = query[fromKey];
			const toValue = query[toKey];
			if (fromValue !== undefined || toValue !== undefined) {
				const range = buildRange(fromValue, toValue, config.type);
				if (range) filters[config.fieldName] = range;
			}
		} else {
			const value = query[config.propertyKey];
			if (value === undefined || value === null) continue;

			if (typeof value === "string") {
				if (config.type === "string" && value.includes("*")) {
					filters[config.fieldName] = buildWildcardRegex(value);
				} else {
					filters[config.fieldName] = normalizeValue(value, config.type);
				}
			} else if (Array.isArray(value)) {
				filters[config.fieldName] = {
					$in: value.map((item) => normalizeValue(item, config.type)),
				};
			} else if (isOperatorFilter(value)) {
				filters[config.fieldName] = buildOperatorFilter(value, config.type);
			} else {
				filters[config.fieldName] = normalizeValue(value, config.type);
			}
		}
	}

	if (query.search && typeof query.search === "string" && stringFields.length) {
		const searchRegex = new RegExp(escapeRegex(query.search), "i");
		filters.$or = stringFields.map((field) => ({ [field]: searchRegex }));
	}

	return filters;
}

function buildSort(
	sortStr: string | undefined,
	sortableFields: Field[],
	defaultSort: Sort,
): Sort {
	if (!sortStr) return defaultSort;

	const sortParts = sortStr
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	const sortObj: Sort = {};

	for (const part of sortParts) {
		let direction: SortDirection = 1;
		let field = part;
		if (field.startsWith("-")) {
			direction = -1;
			field = field.substring(1);
		} else if (field.startsWith("+")) {
			direction = 1;
			field = field.substring(1);
		}

		const sortableField = sortableFields.find((sf) => sf.propertyKey === field);
		if (sortableField) {
			sortObj[sortableField.fieldName] = direction;
		}
	}

	return Object.keys(sortObj).length ? sortObj : defaultSort;
}

export interface QueryPluginOptions {
	defaultSort?: Sort;
}

export interface QueryModel<TDocument> {
	query<Query extends QueryParams = QueryParams>(
		queryParams: Query,
		paginateOptions?: PaginateOptions,
	): Promise<PaginateResult<TDocument>>;
}

type QueryPluginModel<TDocument> = Pick<PaginateModel<TDocument>, "paginate"> &
	QueryModel<TDocument> & {
		modelName: string;
	};

export function queryPlugin(schema: Schema, options?: QueryPluginOptions) {
	const defaultSort = options?.defaultSort ?? { createdAt: -1 };

	const query = function <TDocument, Query extends QueryParams = QueryParams>(
		this: QueryPluginModel<TDocument>,
		queryParams: Query,
		paginateOptions?: PaginateOptions,
	): Promise<PaginateResult<TDocument>> {
		const normalizedQuery = queryParams;
		const modelName = this.modelName;
		const filterableFields = collectFields(
			modelName,
			(field) => field.filterable,
		);
		const sortableFields = collectFields(modelName, (field) => field.sortable);

		const filters = buildFilters(normalizedQuery, filterableFields);
		const sort = buildSort(
			typeof normalizedQuery.sort === "string"
				? normalizedQuery.sort
				: undefined,
			sortableFields,
			defaultSort,
		);

		const page = Math.max(1, Number(normalizedQuery.page) || 1);
		const limit = Math.min(
			100,
			Math.max(1, Number(normalizedQuery.limit) || 10),
		);

		const paginateOpts: PaginateOptions = {
			page,
			limit,
			sort,
			...paginateOptions,
		};

		return this.paginate(filters, paginateOpts) as Promise<
			PaginateResult<TDocument>
		>;
	};

	schema.statics.query = query as unknown as NonNullable<
		typeof schema.statics.query
	>;
}
