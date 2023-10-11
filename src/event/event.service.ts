import { Inject, Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { EmitPixelwarDto, NotificationType } from './dto/emit-pixelwar.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { S3Service } from '../S3/S3.service';
import { createCanvas, loadImage } from 'canvas';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class EventService {
  public constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  // async getConnectedUser(userId: string) {
  //   return await this.cacheManager.get<string[]>(userId);
  // }

  // async setConnectedUser(userId: string, socketIds: string[]) {
  //   return await this.cacheManager.set(userId, socketIds);
  // }

  // deleteConnectedUser(userId: string) {
  //   return this.cacheManager.del(userId);
  // }

  async pixelwar(
    emitPixelwarDto: EmitPixelwarDto,
    size: number[],
    server: Namespace,
  ) {
    let content: Buffer;

    if (emitPixelwarDto.type === NotificationType.FILE) {
      content = await this.cacheManager.get<Buffer>(
        `${emitPixelwarDto.guildId}-canvas`,
      );
    }

    server.emit(emitPixelwarDto.guildId, {
      ...emitPixelwarDto,
      content,
    });

    await this.cacheManager.del(`${emitPixelwarDto.guildId}-canvas`);

    this.schedulerRegistry.deleteTimeout(emitPixelwarDto.guildId);

    const buffer = await this.s3Service.getObject({
      filename: '1108033923780460556',
    });

    const img = await loadImage(buffer.Body as Buffer);
    const layer = await loadImage(Buffer.from(content));

    const canvas = createCanvas(size[0], size[1]);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);

    ctx.save();

    await this.s3Service.set({
      file: canvas.toBuffer('image/png'),
      filename: emitPixelwarDto.guildId,
    });
  }
}
