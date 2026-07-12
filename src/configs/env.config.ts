import bcrypt from "bcrypt";
import dotenv from "dotenv";
import z from "zod";

dotenv.config({ quiet: true });

const optionalString = () =>
	z.preprocess(
		(value) =>
			typeof value === "string" && value.trim() === "" ? undefined : value,
		z.string().trim().min(1).optional(),
	);

const envSchema = z
	.object({
		// Common
		NODE_ENV: z.enum(["development", "production"]).default("development"),
		HOST: optionalString(),
		PORT: z.coerce.number().int().min(1).max(65535).default(3000),
		DOMAIN: optionalString(),
		LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
		RESPONSE_TIMEOUT: z.coerce.number().int().positive().default(5),

		// Database configuration
		DB_HOST: z.string().trim().min(1).default("127.0.0.1"),
		DB_PORT: z.coerce.number().int().min(1).max(65535).default(27017),
		DB_NAME: optionalString(),
		DB_USER: optionalString(),
		DB_PASSWORD: optionalString(),
		DB_AUTH_SOURCE: z.string().trim().min(1).default("admin"),
		DB_URI: optionalString(),

		// Socket.io admin-ui
		SOCKET_ADMIN_USERNAME: z.string().trim().min(1),
		SOCKET_ADMIN_PASSWORD: z
			.string()
			.trim()
			.min(1)
			.transform((val) => bcrypt.hashSync(val, 10)),

		// JWT Configuration
		JWT_SECRET: z.string().trim().min(1),
		JWT_EXPIRES_IN: z
			.string()
			.trim()
			.min(1)
			.regex(/^\d+(ms|s|m|h|d|w)$/, {
				message: "Invalid expiration format. Use: 1ms, 1s, 1m, 1h, 1d, 1w",
			})
			.default("1h"),

		// Cors
		CORS_ORIGIN: z.string().trim().min(1).default("*"),

		// Rate Limit
		RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(15),
		RATE_LIMIT_MAX: z.coerce.number().int().positive().default(500),

		// File
		MAX_FILE_SIZE: z.coerce.number().int().positive().default(5),
	})
	.superRefine((env, ctx) => {
		if (env.NODE_ENV === "production" && !env.DOMAIN) {
			ctx.addIssue({
				code: "custom",
				path: ["DOMAIN"],
				message:
					"DOMAIN is required in production. Use the public API domain, e.g. api.example.com",
			});
		}

		if (env.DOMAIN) {
			const domain = env.DOMAIN;
			const hasProtocol = /^https?:\/\//i.test(domain);
			const hasPathQueryOrHash = /[/?#]/.test(domain);

			if (hasProtocol || hasPathQueryOrHash) {
				ctx.addIssue({
					code: "custom",
					path: ["DOMAIN"],
					message:
						"DOMAIN must be a hostname without protocol, path, query, or hash, e.g. api.example.com",
				});
			}
		}

		const databaseUri = env.DB_URI;
		const hasDatabaseUri = !!databaseUri && !databaseUri.includes("${");

		if (hasDatabaseUri && !/^mongodb(\+srv)?:\/\//.test(databaseUri)) {
			ctx.addIssue({
				code: "custom",
				path: ["DB_URI"],
				message:
					"DB_URI must be a valid MongoDB URI, e.g. mongodb+srv://user:password@cluster.mongodb.net/database",
			});
		}

		if (hasDatabaseUri) return;

		const requiredDatabaseFields = [
			"DB_NAME",
			"DB_USER",
			"DB_PASSWORD",
		] as const;

		for (const field of requiredDatabaseFields) {
			if (!env[field]) {
				ctx.addIssue({
					code: "custom",
					path: [field],
					message: `${field} is required when DB_URI is not configured`,
				});
			}
		}
	});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	const errorMessages = parsed.error.issues.map(
		(issue) => `${issue.path.join(".")}: ${issue.message}`,
	);
	throw new Error(
		`Environment validation failed:\n${errorMessages.join("\n")}`,
	);
}

const env = parsed.data;
const isProduction = env.NODE_ENV === "production";
const serverHost = env.HOST ?? (isProduction ? "0.0.0.0" : "127.0.0.1");
const logLevel = env.LOG_LEVEL ?? (isProduction ? "info" : "debug");

const buildMongoUri = (): string => {
	if (env.DB_URI && !env.DB_URI.includes("${")) return env.DB_URI;

	if (!env.DB_NAME || !env.DB_USER || !env.DB_PASSWORD)
		throw new Error("Database configuration is incomplete");

	const user = encodeURIComponent(env.DB_USER);
	const password = encodeURIComponent(env.DB_PASSWORD);

	return `mongodb://${user}:${password}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}?authSource=${env.DB_AUTH_SOURCE}&directConnection=true`;
};

const buildPublicUrl = (): string => {
	if (isProduction) return `https://${env.DOMAIN}`;

	return `http://${serverHost}:${env.PORT}`;
};

const databaseUrl = buildMongoUri();
const maskedDatabaseUrl = databaseUrl.replace(
	/(:\/\/[^:]+:)[^@]+(@)/,
	"$1*****$2",
);

export const config = Object.freeze({
	server: {
		host: serverHost,
		port: env.PORT,
		nodeEnv: env.NODE_ENV,
		logLevel,
		publicUrl: buildPublicUrl(),
		responseTimeout: env.RESPONSE_TIMEOUT,
		isProduction,
		isDevelopment: !isProduction,
	},
	database: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		name: env.DB_NAME,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		authSource: env.DB_AUTH_SOURCE,
		connection: {
			uri: databaseUrl,
			maskedUri: maskedDatabaseUrl,
		},
	},
	socketAdmin: {
		username: env.SOCKET_ADMIN_USERNAME,
		password: env.SOCKET_ADMIN_PASSWORD,
	},
	jwt: {
		secret: env.JWT_SECRET,
		expiresIn: env.JWT_EXPIRES_IN,
	},
	cors: {
		origin: env.CORS_ORIGIN,
	},
	rateLimit: {
		windowMs: env.RATE_LIMIT_WINDOW,
		max: env.RATE_LIMIT_MAX,
	},
	file: {
		max_size: env.MAX_FILE_SIZE,
	},
} as const);

export type Config = typeof config;
