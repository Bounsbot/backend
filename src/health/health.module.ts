import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TerminusModule, HttpModule, EventModule],
  controllers: [HealthController],
})
export class HealthModule {


}
