import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { EventModule } from '../event/event.module';
import { GlobalLevelSchema } from './schemas/globalLevel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelsService } from './levels.service';
import { GuildLevelSchema } from './schemas/guildLevel.schema';

@Module({
  imports: [EventModule,
    MongooseModule.forFeature([
      { name: 'GlobalLevel', schema: GlobalLevelSchema },
      { name: 'GuildLevel', schema: GuildLevelSchema }
    ]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {

}
