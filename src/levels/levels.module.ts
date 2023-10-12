import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { EventModule } from '../event/event.module';
import { GlobalLevel } from './schemas/globalLevel.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LevelsService } from './levels.service';

@Module({
  imports: [EventModule,
    MongooseModule.forFeature([{ name: 'GlobalLevel', schema: GlobalLevel }]),
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {

}
