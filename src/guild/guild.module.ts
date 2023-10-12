import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { EventModule } from '../event/event.module';
import { GuildService } from './guild.service';

@Module({
  imports: [EventModule],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {

}
