import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';
import { PixelwarModule } from '../pixelwar/pixelwar.module';
import { S3Module } from '../S3/S3.module';

@Module({
  imports: [PixelwarModule, S3Module],
  providers: [EventGateway, EventService],
  controllers: [],
  exports: [EventGateway, EventService],
})
export class EventModule {}
