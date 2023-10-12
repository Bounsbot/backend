import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [EventModule],
  controllers: [CommandsController],
})
export class CommandsModule {

}
