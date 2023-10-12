import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule],
  controllers: [GuildController],
})
export class GuildModule {

}
