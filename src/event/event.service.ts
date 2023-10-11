import { Inject, Injectable } from '@nestjs/common';
import { Namespace } from 'socket.io';
import { EmitPixelwarDto, NotificationType } from './dto/emit-pixelwar.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { createCanvas, loadImage } from 'canvas';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class EventService {
  public constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  async pixelwar(
    emitPixelwarDto: EmitPixelwarDto,
    size: number[],
    server: Namespace,
  ) {

  }
}
