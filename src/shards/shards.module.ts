import { Module } from '@nestjs/common';
import { ShardsController } from './shards.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule],
  controllers: [ShardsController],
})
export class ShardsModule {

}
