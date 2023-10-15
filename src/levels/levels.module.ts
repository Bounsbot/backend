import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { EventModule } from '../event/event.module';
import { GlobalLevelSchema } from './schemas/globalLevel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelsService } from './levels.service';
import { GuildLevelSchema } from './schemas/guildLevel.schema';
import { GuildModule } from '../guild/guild.module';
import { GuildService } from 'src/guild/guild.service';
import { GuildConfigurationSchema } from 'src/guild/schemas/guildConfiguration.schema';

@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      { name: 'GlobalLevel', schema: GlobalLevelSchema },
      { name: 'GuildLevel', schema: GuildLevelSchema },
      { name: 'GuildConfiguration', schema: GuildConfigurationSchema }
    ]),
    GuildModule
  ],
  controllers: [LevelsController],
  providers: [LevelsService, GuildService],
})
export class LevelsModule {

}
