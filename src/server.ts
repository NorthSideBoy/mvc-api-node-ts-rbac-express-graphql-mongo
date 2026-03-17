import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import { buildSchema } from "type-graphql";
import { formatGraphQLError } from "./api/graphql/middlewares/error.middleware";
import UserResolver from "./api/graphql/resolvers/user.resolver";
import swaggerDocument from "./api/rest/docs/swagger.json";
import { expressAuthentication } from "./api/rest/middlewares/auth.middleware";
import { errorMiddleware } from "./api/rest/middlewares/error.middleware";
import { generalLimiter } from "./api/rest/middlewares/rate-limiter.middleware";
import { RegisterRoutes } from "./api/rest/routes/routes";
import { bootstrap, shutdown } from "./bootstrap";
import { config } from "./configs/env.config";
import { Role } from "./enums/role.enum";
import type { GraphQLContext } from "./types/graphql-context.type";
import { logger } from "./utils/logger.util";

const maxFileSize = config.file.max_size * 1024 * 1024;

const app = express();

app.use(
	config.server.isProduction
		? pinoHttp({ logger: logger.raw, level: config.server.logLevel })
		: (_req, _res, next) => next(),
);
app.use(cors({ origin: config.cors.origin }));
app.use(express.json({ limit: maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: maxFileSize }));
app.use(generalLimiter);

app.use("/public", express.static("storage/public"));
app.use(
	"/private",
	async (req, _res, next) => {
		await expressAuthentication(req, "Bearer", [Role.ADMIN]);
		next();
	},
	express.static("storage/private"),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/swagger.json", (_request, response) => {
	response.json(swaggerDocument);
});

RegisterRoutes(app);

app.use(errorMiddleware);

const start = async (): Promise<void> => {
	await bootstrap();

	const schema = await buildSchema({
		resolvers: [UserResolver],
	});

	const apollo = new ApolloServer<GraphQLContext>({
		schema,
		plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
		formatError: formatGraphQLError,
	});

	await apollo.start();

	app.use(
		"/graphql",
		graphqlUploadExpress({ maxFileSize }),
		expressMiddleware(apollo, {
			context: async ({ req, res }): Promise<GraphQLContext> => {
				return { req, res };
			},
		}),
	);

	const server = app.listen(config.server.port, config.server.host, () => {
		logger.info(
			{
				host: config.server.host,
				port: config.server.port,
				cors: config.cors.origin,
			},
			"[HTTP] listening",
		);
		logger.info(`Swagger docs available at ${config.server.publicUrl}/docs`);
		logger.info(
			`GraphQL Playground available at ${config.server.publicUrl}/graphql`,
		);
	});

	const gracefulShutdown = async (): Promise<void> => {
		logger.info("[HTTP] shutting down");
		server.close(async () => {
			await apollo.stop();
			await shutdown();
			process.exit(0);
		});
	};

	process.on("SIGINT", gracefulShutdown);
	process.on("SIGTERM", gracefulShutdown);
};

start().catch((error) => {
	logger.error("Failed to start server:", error);
	process.exit(1);
});
