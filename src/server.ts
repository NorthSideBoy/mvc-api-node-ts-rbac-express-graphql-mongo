import "reflect-metadata";
import { createServer } from "node:http";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { expressMiddleware } from "@as-integrations/express5";
import { instrument } from "@socket.io/admin-ui";
import cors from "cors";
import express from "express";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import multer from "multer";
import { pinoHttp } from "pino-http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { buildSchema } from "type-graphql";
import { formatGraphQLError } from "./api/graphql/middlewares/error.middleware";
import AuthResolver from "./api/graphql/resolvers/auth.resolver";
import CronJobResolver from "./api/graphql/resolvers/cron-job.resolver";
import UserResolver from "./api/graphql/resolvers/user.resolver";
import type { GraphQLContext } from "./api/graphql/types/graphql-context.type";
import swaggerDocument from "./api/rest/docs/swagger.json";
import { expressAuthentication } from "./api/rest/middlewares/auth.middleware";
import { errorMiddleware } from "./api/rest/middlewares/error.middleware";
import { generalLimiter } from "./api/rest/middlewares/rate-limiter.middleware";
import { RegisterRoutes } from "./api/rest/routes/routes";
import { bridges } from "./api/socket.io/bridges/socket-bridge";
import { gateways } from "./api/socket.io/gateways";
import { bootstrap, shutdown } from "./bootstrap";
import { config } from "./configs/env.config";
import { cronScheduler } from "./cron/scheduler";
import { Role } from "./enums/role.enum";
import { logger } from "./utils/logger.util";

const app = express();
const server = createServer(app);
const responseTimeoutMs = config.server.responseTimeout * 60 * 1000;

server.setTimeout(responseTimeoutMs);
server.requestTimeout = responseTimeoutMs;

const io = new Server(server, {
	cors: {
		origin: config.cors.origin,
		methods: ["GET", "POST"],
		credentials: config.server.isProduction,
	},
});
instrument(io, {
	auth: {
		type: "basic",
		username: config.socketAdmin.username,
		password: config.socketAdmin.password,
	},
	mode: config.server.nodeEnv,
	namespaceName: "/admin",
});

const maxFileSize = config.file.max_size * 1024 * 1024;

app.use(
	config.server.isProduction
		? pinoHttp({ logger: logger.raw, level: config.server.logLevel })
		: (_req, _res, next) => next(),
);
app.use(cors({ origin: config.cors.origin }));
app.use((_req, res, next) => {
	res.setTimeout(responseTimeoutMs);
	next();
});
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

app.use(
	"/socket-ui",
	express.static(
		path.resolve("node_modules", "@socket.io", "admin-ui", "ui", "dist"),
	),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/swagger.json", (_request, response) => {
	response.json(swaggerDocument);
});

RegisterRoutes(app, {
	multer: multer({ limits: { fileSize: maxFileSize } }),
});
app.use(errorMiddleware);

const start = async () => {
	await bootstrap();
	bridges.initialize(io);
	gateways.initialize(io);

	io.on("connection", (socket) => {
		logger.info({ socket_id: socket.id }, "[Socket.IO] client connected");
		gateways.register(socket);

		socket.on("disconnect", (reason) => {
			logger.info(
				{ socket_id: socket.id, reason },
				"[Socket.IO] client disconnected",
			);
		});
	});

	const schema = await buildSchema({
		resolvers: [AuthResolver, CronJobResolver, UserResolver],
	});

	const apollo = new ApolloServer<GraphQLContext>({
		schema,
		stopOnTerminationSignals: false,
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
	try {
		await cronScheduler.initialize();
		await new Promise<void>((resolve, reject) => {
			const onError = (error: Error) => reject(error);
			server.once("error", onError);
			server.listen(config.server.port, config.server.host, () => {
				server.off("error", onError);
				resolve();
			});
		});
	} catch (error) {
		await cronScheduler.shutdown();
		gateways.shutdown();
		bridges.shutdown();
		await apollo.stop();
		await shutdown();
		throw error;
	}

	logger.info(
		{
			host: config.server.host,
			port: config.server.port,
			cors: config.cors.origin,
		},
		"[HTTP] listening",
	);
	logger.info(`Swagger docs available at: ${config.server.publicUrl}/docs`);
	logger.info(
		`GraphQL sandbox available at: ${config.server.publicUrl}/graphql`,
	);
	logger.info(
		`Socket.io admin-ui available at: ${config.server.publicUrl}/socket-ui`,
	);

	let shuttingDown = false;
	const gracefulShutdown = async () => {
		if (shuttingDown) return;
		shuttingDown = true;

		logger.info("[HTTP] shutting down");
		try {
			const httpShutdown = server.listening
				? new Promise<void>((resolve, reject) => {
						server.close((error) => (error ? reject(error) : resolve()));
					})
				: Promise.resolve();
			await cronScheduler.shutdown();
			logger.info("[Socket.IO] shutting down");
			gateways.shutdown();
			bridges.shutdown();
			await new Promise<void>((resolve) => io.close(() => resolve()));
			await httpShutdown;
			await apollo.stop();
			await shutdown();
		} catch (error) {
			logger.error({ error }, "[APP] graceful shutdown failed");
			process.exitCode = 1;
		}
	};

	process.once("SIGINT", gracefulShutdown);
	process.once("SIGTERM", gracefulShutdown);
};

start().catch((error) => {
	logger.error({ error }, "Failed to start server");
	process.exit(1);
});
