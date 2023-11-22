import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { EventModule } from '../event/event.module';
import { GuildService } from './guild.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GuildConfigurationSchema } from './schemas/guildConfiguration.schema';
import { AuthGuildAccessMiddleware } from '../auth/auth.middlewars';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    EventModule,
    MongooseModule.forFeature([
      { name: 'GuildConfiguration', schema: GuildConfigurationSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [GuildController],
  providers: [GuildService],
})
export class GuildModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthGuildAccessMiddleware)
      .exclude(
        { path: 'guilds/best', method: RequestMethod.ALL },
        { path: 'guilds/has', method: RequestMethod.ALL },
      )
      .forRoutes('guilds');
  }
}
