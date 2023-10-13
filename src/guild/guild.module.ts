import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { EventModule } from '../event/event.module';
import { GuildService } from './guild.service';
import { GuildConfigurationSchema } from './schemas/guildConfiguration.schema';

@Module({
  imports: [EventModule,
  GuildConfigurationSchema],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {

}
