import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { EventModule } from '../event/event.module';
import { GuildService } from './guild.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildConfigurationSchema } from './schemas/guildConfiguration.schema';

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      { name: 'GuildConfiguration', schema: GuildConfigurationSchema },
    ]),
  ],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule {

}
