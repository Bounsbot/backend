import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';
import { EventService } from './event.service';
import { Inject, Logger } from '@nestjs/common';
import { BounsbotSocket } from '../@types/BounsbotSocket';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { SchedulerRegistry } from '@nestjs/schedule';

@WebSocketGateway({
  namespace: 'event',
})
export class EventGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private readonly logger = new Logger(EventGateway.name);

  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  @WebSocketServer()
  server: Namespace;

  shards: Array<any> = Array.from({ length: process.env.SHARD_COUNT ? parseInt(process.env.SHARD_COUNT) : 1 }, (e, i) => (null));
  shardsCount: number = process.env.SHARD_COUNT ? parseInt(process.env.SHARD_COUNT) : 1

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleDisconnect(socket: BounsbotSocket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
    socket.disconnect();
  }

  async handleConnection(socket: BounsbotSocket) {
    this.logger.log(`Socket ${socket.id} connected`);
    try {
      if (!process.env.TOKEN_WEBSOCKET) throw new Error("TOKEN_WEBSOCKET not found")
      if (socket.handshake.headers.authorization !== process.env.TOKEN_WEBSOCKET) {
        this.logger.log(`Socket ${socket.id} unauthorized`);
        return throw new Error(`Socket ${socket.id} unauthorized`)
      }

      this.shards[parseInt(socket.handshake.headers.shard_id as string)] = socket.id
      this.shardsCount = parseInt(socket.handshake.headers.shards_count as string)
    }
    catch (e) {
      socket.disconnect(true);
      this.logger
    }
  }

  private disconnect(socket: BounsbotSocket) {
    socket.disconnect();
  }

  @SubscribeMessage('FETCH_CLIENT_VALUES')
  async fetchClientValues(@ConnectedSocket() socket: BounsbotSocket, @MessageBody() args: Array<string>): Promise<any> {
    const [command, shardId] = args
    console.log(`La shard ${socket.id} demande à '${shardId}' cette information:\n> "${command}"`);


    if (shardId != null && parseInt(shardId) >= 0) {
      if (parseInt(shardId) >= this.shardsCount) {
        return { success: false, error: "Shard id out of range" }
      }

      if (!this.shards[parseInt(shardId)]) {
        return { success: false, error: "Shard id not connected" }
      }

      try {
        return await this.server.to(this.shards[parseInt(shardId)]).timeout(10000).emitWithAck("FETCH_CLIENT_VALUES", command)
      }
      catch (e) {
        return { success: false, error: e }
      }
    }
    else {
      try {
        return await this.server.timeout(1000).emitWithAck("FETCH_CLIENT_VALUES", command)
      }
      catch (e) {
        return { success: false, error: e }
      }
    }
  }

  @SubscribeMessage('LEAVE_GUILDS')
  async leaveGuild(@ConnectedSocket() socket: BounsbotSocket, @MessageBody() guilds: Array<string>): Promise<any> {
    try {
      const response: Array<Array<string>> = await this.server.timeout(60000).emitWithAck("LEAVE_GUILDS", guilds)
      return response.flat()
    }
    catch (e) {
      return []
    }
  }

  @SubscribeMessage('GET_GUILDS_INVITE')
  async getGuildsInvite(@ConnectedSocket() socket: BounsbotSocket, @MessageBody() guilds: Array<string>): Promise<any> {
    try {
      const response: Array<Array<string>> = await this.server.timeout(60000).emitWithAck("GET_GUILDS_INVITE", guilds)
      return response.flat()
    }
    catch (e) {
      return []
    }
  }

  @SubscribeMessage('SEND_MESSAGE')
  async sendMessage(@ConnectedSocket() socket: BounsbotSocket, @MessageBody() messageObject: Object): Promise<any> {
    try {
      const shardsResponse = await this.server.timeout(5000).emitWithAck('SEND_MESSAGE', messageObject);

      return shardsResponse.find((e) => e !== null) || {
        success: false,
        message: "Bouns'bot n'a pas pu envoyé le message"
      }
    } catch (e) {
      this.logger.error(e)
      return {
        success: false,
        message: "Bouns'bot n'a pas pu envoyé le message"
      }
    }
  }
}
