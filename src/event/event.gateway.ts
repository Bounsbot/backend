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
import { AddPixelDto } from './dto/add-pixel.dto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { createCanvas, loadImage } from 'canvas';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotificationType } from './dto/emit-pixelwar.dto';
import { DateTime } from 'luxon';

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
    if (socket.handshake.headers.authorization !== process.env.TOKEN_WEBSOCKET) {
      this.logger.log(`Socket ${socket.id} unauthorized`);
      return socket.disconnect(true);
    }

    this.shards[parseInt(socket.handshake.headers.shard_id as string)] = socket.id
    this.shardsCount = parseInt(socket.handshake.headers.shards_count as string)
  }

  private disconnect(socket: BounsbotSocket) {
    socket.disconnect();
  }

  @SubscribeMessage('FETCH_CLIENT_VALUES')
  async fetchClientValues(@ConnectedSocket() socket: BounsbotSocket, @MessageBody() arg: String): Promise<any> {
    console.log(`La shard ${socket.id} demande cette information:\n> "${arg}"`);

    try {
      return await this.server.timeout(1000).emitWithAck("FETCH_CLIENT_VALUES", arg)
    }
    catch (e) {
      return e
    }
  }
}
