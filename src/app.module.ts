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
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
      auth: {
        username: process.env.MONGO_INITDB_ROOT_USERNAME,
        password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      },
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    CommandsModule,
    ShardsModule,
    LevelsModule,
    GuildModule,
    EventModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
