import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from './event/event.module';
import { CommandsModule } from './commands/commands.module';
import { ShardsModule } from './shards/shards.module';
import { LevelsModule } from './levels/levels.module';
import { GuildModule } from './guild/guild.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { InfractionsModule } from './infractions/infractions.module';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => ({
        store: (await redisStore({
          socket: {
            host: 'redis',
            port: Number(process.env.REDIS_PORT),
          },
          password: process.env.REDIS_PASSWORD,
        })) as unknown as CacheStore,
      }),
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    HealthModule,
    CommandsModule,
    ShardsModule,
    LevelsModule,
    GuildModule,
    EventModule,
    AuthModule,
    UserModule,
    InfractionsModule
  ],
  controllers: [AppController],
})
export class AppModule { }
