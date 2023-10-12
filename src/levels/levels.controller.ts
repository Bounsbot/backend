import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventGateway } from '../event/event.gateway';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { GlobalLevel } from './schemas/globalLevel.schema';
import { LevelsService } from './levels.service';

@Controller('levels')
@ApiTags('levels')
export class LevelsController {
  constructor(
    private readonly eventService: EventGateway,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,

    private readonly levelsService: LevelsService
  ) { }

  @Get("/global")
  @ApiOperation({ summary: 'Get global levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the global levels',
  })
  async getGlobalLevels(): Promise<GlobalLevel[]> {

    return this.levelsService.findAll()
  }

  @Get("/guild/:id")
  @ApiOperation({ summary: 'Get guild levels' })
  @ApiResponse({
    status: 200,
    description: 'Returns the guild levels',
  })
  async locateGuildInShard(@Param('id') id: string) {
    try {
      const getInfo = await this.eventService.server.timeout(1000).emitWithAck('FETCH_CLIENT_VALUES', "guilds.cache.has('" + id + "') ? process.env.SHARDS_ID : null");
      const located = getInfo.find((e) => e !== null);
      return { shard: located || null }
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
