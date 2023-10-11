import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { EventService } from './event.service';

@Module({
  imports: [],
  providers: [EventGateway, EventService],
  controllers: [],
  exports: [EventGateway, EventService],
})
export class EventModule {}
