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
import { PixelounsSocket } from '../@types/PixelounsSocket';
import { AddPixelDto } from './dto/add-pixel.dto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { PixelwarService } from '../pixelwar/pixelwar.service';
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
    private readonly pixelwarService: PixelwarService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  @WebSocketServer()
  server: Namespace;

  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleDisconnect(socket: PixelounsSocket) {
    // if (socket.data.user) {
    //   const connectedUser = await this.eventService.getConnectedUser(
    //     socket.data.user?._id?.toString(),
    //   );

    //   const filteredUser = connectedUser.filter((c) => c !== socket.id);

    //   if (filteredUser.length < 1) {
    //     await this.eventService.deleteConnectedUser(
    //       socket.data.user._id.toString(),
    //     );
    //   } else {
    //     await this.eventService.setConnectedUser(
    //       socket.data.user._id.toString(),
    //       filteredUser,
    //     );
    //   }

    // }
    socket.disconnect();
  }

  async handleConnection(socket: PixelounsSocket) {
    try {
      this.logger.log(`User ${socket.id} connected`);

      // await this.eventService.setConnectedUser(user._id.toString(), [
      //   ...((await this.eventService.getConnectedUser(user._id.toString())) ||
      //     []),
      //   socket.id,
      // ]);

      const lastPixel = await this.cacheManager.get(socket.handshake.address);

      return this.server.to(socket.id).emit('status', {
        timestamp: lastPixel,
      });
    } catch (e) {
      console.error(e);
      return this.disconnect(socket);
    }
  }

  private disconnect(socket: PixelounsSocket) {
    socket.disconnect();
  }

  @SubscribeMessage('FETCH_CLIENT_VALUES')
  async fetchClientValues(@ConnectedSocket() socket: PixelounsSocket, @MessageBody() arg: String): Promise<any> {
    console.log(`La shard ${socket.id} demande ${arg}`);

    // return new Promise((resolve, reject) => {
    //   this.server.timeout(1000).emit("FETCH_CLIENT_VALUES", arg, (err, clientResponses) => {
    //     err ? reject(err) : resolve(clientResponses);
    //   })
    // })

    try {
      return await this.server.timeout(1000).emitWithAck("FETCH_CLIENT_VALUES", arg)
    }
    catch (e) {
      return e
    }

  }
}
