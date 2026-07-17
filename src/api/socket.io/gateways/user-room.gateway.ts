import type { User } from "../../../DTOs/user/output/user.dto";
import { Role } from "../../../enums/role.enum";
import UserService from "../../../services/user.service";
import { logger } from "../../../utils/logger.util";
import { decode } from "../../../utils/validator.util";
import { idSchema } from "../../../validation/schemas/common.schemas";
import { userRoom } from "../common/user-room.common";
import {
	Gateway,
	On,
	OnConnect,
	UseSocket,
} from "../decorators/socket.decorator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { contextMiddleware } from "../middlewares/context.middleware";
import type { SocketEventContext } from "../types/socket-event-context.type";
import { BaseGateway } from "./base.gateway";

type UserRoomPayload = Pick<User, "id">;
type RoomAction = "join" | "leave";

@Gateway()
export default class UserRoomGateway extends BaseGateway {
	@OnConnect()
	@UseSocket(authMiddleware([Role.USER]), contextMiddleware())
	async connect(ctx: SocketEventContext): Promise<void> {
		const userId = ctx.context?.actor.id;
		if (!userId) {
			logger.warn(
				{ socket_id: ctx.socket.id },
				"[Socket.IO] authenticated actor id is invalid",
			);
			ctx.socket.disconnect(true);
			return;
		}
		const room = userRoom.self(userId);
		ctx.socket.join(room);
		logger.info(
			{ socket_id: ctx.socket.id, room, user_id: userId },
			"[Socket.IO] joined self room",
		);
	}

	@On("user.subscribe")
	@UseSocket(authMiddleware([Role.USER]), contextMiddleware())
	async subscribe(ctx: SocketEventContext<UserRoomPayload>): Promise<void> {
		await this.handleRoom(ctx, "join");
	}

	@On("user.unsubscribe")
	@UseSocket(authMiddleware([Role.USER]), contextMiddleware())
	async unsubscribe(ctx: SocketEventContext<UserRoomPayload>): Promise<void> {
		await this.handleRoom(ctx, "leave");
	}

	private async handleRoom(
		ctx: SocketEventContext<UserRoomPayload>,
		action: RoomAction,
	): Promise<void> {
		const subscriberId = ctx.context?.actor.id;

		if (!subscriberId) {
			this.deny(
				ctx,
				"INVALID_ACTOR",
				"Authenticated actor id is invalid",
				action,
			);
			return;
		}

		let targetId: string;
		try {
			targetId = this.parseTargetId(ctx.payload);
		} catch {
			this.deny(
				ctx,
				"INVALID_PAYLOAD",
				"Payload must include a valid user id",
				action,
			);
			return;
		}

		if (action === "join" && targetId === subscriberId) {
			this.deny(
				ctx,
				"SELF_SUBSCRIPTION",
				"Cannot subscribe to yourself",
				action,
			);
			return;
		}

		const targetExists = await new UserService().exists(targetId);
		if (!targetExists) {
			this.deny(ctx, "USER_NOT_FOUND", "Target user does not exist", action);
			return;
		}

		const room = userRoom.watch(targetId);
		const isSubscribed = ctx.socket.rooms.has(room);

		if (action === "join") {
			if (!isSubscribed) ctx.socket.join(room);
		} else if (isSubscribed) ctx.socket.leave(room);

		ctx.ack?.({
			ok: true,
			action,
			room,
			targetId,
			subscribed: action === "join",
		});

		const status = this.roomStatus(action, isSubscribed);
		logger.info(
			{
				socket: {
					id: ctx.socket.id,
					event: ctx.eventName,
					room,
				},
				subscription: {
					action,
					subscriber: subscriberId,
					targetId,
					status,
				},
				actor: ctx.context?.actor.audit,
			},
			`[Socket.IO] ${status} watch room`,
		);
	}

	private parseTargetId(payload: unknown): string {
		if (!payload || typeof payload !== "object" || !("id" in payload))
			throw new Error("Missing target id");

		return decode(idSchema, (payload as { id: unknown }).id);
	}

	private roomStatus(action: RoomAction, isSubscribed: boolean): string {
		if (action === "join") return isSubscribed ? "already joined" : "joined";

		return isSubscribed ? "left" : "already left";
	}

	private deny(
		ctx: SocketEventContext<UserRoomPayload>,
		code: string,
		message: string,
		action: RoomAction,
	): void {
		const label = action === "join" ? "subscription" : "unsubscription";
		logger.warn(
			{
				socket: { id: ctx.socket.id, event: ctx.eventName },
				payload: ctx.payload,
				error: { code, message },
				actor: ctx.context?.actor.audit,
			},
			`[Socket.IO] denied room ${label}`,
		);
		if (ctx.ack) ctx.ack({ ok: false, error: { code, message } });
	}
}
